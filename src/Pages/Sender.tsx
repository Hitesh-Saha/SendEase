import React, { useCallback, useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Info,
  InsertLink,
  Share,
  Schedule,
  Speed,
  SyncAlt,
} from "@mui/icons-material";
import {
  pageContainer,
  glassBackground,
  glassBackgroundLight,
  gradientButton,
  gradientText,
  textField,
  gradientAvatar,
  statusMessage,
  progressBar,
  iconButton
} from "../styles/index.styles";
import DragAndDrop from "../components/DragAndDrop/DragAndDrop";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import FileItem from "../components/FileList/FileItem";
import { formatSpeed, formatTime, getAvatar, getFileSize, getName } from "../lib/utils";
import { RecieverData, ShareOption } from "../models/common";
import { encryptAESKey, generateAESKey } from "../core/KeyGeneration";
import EmailDialog from "../components/EmailDialog/EmailDialog";

// @ts-ignore
import FileSenderWorker from '../lib/fileSender.worker.ts?worker';
import MenuBar from "../components/MenuBar";

const senderAvatar = getAvatar();
const senderName = getName();

const Sender = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [reciever, setReciever] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [isProgressBar, setIsProgressBar] = useState<boolean>(false);
  const [fileContents, setFileContents] = useState<ArrayBuffer | null>(null);
  const [currentRecieverStatus, setCurrentRecieverStatus] =
    useState<string>("Disconnected");
  const [recieverDetails, setRecieverDetails] = useState<RecieverData | null>(
    null
  );
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const connInstance = useRef<DataConnection | null>(null);
  const peer = useRef<Peer | null>(null);
  const aesKey = useRef<string>();
  const encryptedAESKey = useRef<string>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [transferStats, setTransferStats] = useState({
    speed: 0, // bytes per second
    eta: 0, // seconds remaining
    startTime: 0, // timestamp when transfer started
    bytesTransferred: 0, // total bytes transferred so far
  });


  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setAnchorEl(null);
  };

  const handleShare = async (platform: ShareOption) => {
    if (!peerId) return;

    const shareUrl = `${window.location.origin}/receiver/${peerId}`;
    const shareText = `Join me on SendEase to receive a secure file transfer. My Sender ID is: ${peerId}. You can also use this link: ${shareUrl}`;

    switch (platform) {
      case "copy-id":
        await navigator.clipboard.writeText(peerId);
        setStatus("ID copied to clipboard");
        break;
      case "copy-link":
        await navigator.clipboard.writeText(shareUrl);
        setStatus("Link copied to clipboard");
        break;
      case "email":
        handleEmailDialogOpen();
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
        break;
    }
    handleShareClose();
  };

  const handleEmailDialogOpen = () => {
    setIsEmailDialogOpen(true);
    handleShareClose();
  };

  const initializeSender = useCallback(() => {
    // peer.current = new Peer();
    // Connect to our custom PeerJS server
    const peerOptions = {
      host: window.location.hostname || 'localhost',
      port: window.location.protocol === 'https:' ? 443 : 9000,
      path: '/sendease',
      secure: window.location.protocol === 'https:',
      debugger: 2,
    };
    peer.current = new Peer(peerOptions);
    peer.current.on("open", (id) => {
      setPeerId(id);
      console.log("Connected to signaling server with ID:", id);
    });
    peer.current.on("error", (err) => {
      console.error("PeerJS error:", err);
      setStatus(`Connection error: ${err.type}`);
    });
    aesKey.current = generateAESKey();
    peer.current.on("connection", (conn) => {
      conn.on("data", (data: any) => {
        if (data.type == "connect") {
          const { peerId, recieverAvatar, recieverName, key } = data;
          setReciever(peerId);
          encryptedAESKey.current = encryptAESKey(key, aesKey.current!);
          setRecieverDetails({
            id: peerId,
            avatar: recieverAvatar,
            username: recieverName,
          });
          setStatus(`Reciever waiting in the lobby`);
        }
      });
      connInstance.current = conn;
    });
  }, []);

  useEffect(() => {
    initializeSender();
    return () => {
      if (peer.current) {
        peer.current.destroy();
      }
      if (connInstance.current) {
        connInstance.current.close();
      }
    };
  }, []);

  // Handle file input from both drag-drop and button upload
  const handleFileUpload = (selectedFile: File) => {
    setIsProgressBar(true);
    setStatus("Uploading...");
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (reader.result) {
        setFileContents(reader.result as ArrayBuffer);
        if (ev.loaded === ev.total) {
          setStatus("File Uploaded");
          setTimeout(() => {
            setIsProgressBar(false);
            setProgress(0);
          }, 2000);
        }
      }
    };
    reader.onprogress = (ev) => {
      setProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    reader.readAsArrayBuffer(selectedFile);
    setFile(selectedFile);
  };

  // Send file to connected peer
  const sendFile = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!fileContents || !connInstance.current) return;

    setButtonDisabled(true);
    setStatus("Preparing to send file...");
    setIsProgressBar(true);
    setProgress(0);
    
    // Initialize transfer statistics
    setTransferStats({
      speed: 0,
      eta: 0,
      startTime: Date.now(),
      bytesTransferred: 0,
    });

    connInstance.current?.send({
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      type: "file-meta",
    });
    connInstance.current?.send({ type: "start" });
    sendFileInChunks();
  };

  const sendFileInChunks = async () => {
    if (!file || !connInstance.current?.open || !aesKey.current) return;

    const chunkSize = 256 * 1024; // 256KB chunks for better performance
    const worker = new FileSenderWorker();
    const totalSize = file.size;
    let lastTime = Date.now();
    let startTime = lastTime;
    
    try {
      // Setup worker message handler before sending the file
      worker.onmessage = (e: MessageEvent) => {
        const { type, sequence, contents, offset, error } = e.data;
        
        switch (type) {
          case "chunk":
            if (!connInstance.current?.open) {
              worker.terminate();
              setStatus("Connection lost");
              setButtonDisabled(false);
              return;
            }

            connInstance.current.send({
              type: "file-data-chunk",
              sequence,
              contents,
            });

            // Always update progress for smooth UI
            const now = Date.now();
            const totalElapsed = (now - startTime) / 1000; // total time since start
            const bytesTransferred = offset;
            const averageSpeed = bytesTransferred / totalElapsed;
            
            // Use average speed for more stable ETA calculation
            const remainingBytes = totalSize - offset;
            const eta = remainingBytes / averageSpeed;
            
            // Update transfer stats on every chunk for real-time feedback
            setTransferStats({
              speed: averageSpeed,
              eta,
              startTime,
              bytesTransferred: offset,
            });
            
            lastTime = now;

            const currentProgress = Math.min(Math.round((offset / totalSize) * 100), 99);
            setProgress(currentProgress);
            setIsProgressBar(true);
            setStatus(`Sending File...`);
            break;

          case "done":
            connInstance.current?.send({ type: "end" });
            setProgress(100);
            const totalTime = (Date.now() - startTime) / 1000;
            const finalSpeed = totalSize / totalTime;
            setTransferStats(prev => ({
              ...prev,
              speed: finalSpeed,
              eta: 0,
              bytesTransferred: totalSize
            }));
            setStatus(`File Sent Successfully (${formatSpeed(finalSpeed)} avg)`);
            worker.terminate();
            setTimeout(() => {
              setIsProgressBar(false);
              setProgress(0);
              setTransferStats({
                speed: 0,
                eta: 0,
                startTime: 0,
                bytesTransferred: 0,
              });
            }, 3000);
            break;

          case "error":
            setStatus(`Error: ${error}`);
            setButtonDisabled(false);
            worker.terminate();
            break;
        }
      };

      worker.onerror = (error: ErrorEvent) => {
        setStatus(`Worker error: ${error.message}`);
        setButtonDisabled(false);
        worker.terminate();
      };

      // Start the worker
      worker.postMessage({
        file,
        chunkSize,
        aesKey: aesKey.current,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? (error as Error)?.message as string : String(error);
      setStatus(`Failed to start file transfer: ${errorMessage}`);
      setButtonDisabled(false);
      worker?.terminate();
    }
  };

  const connectReciever = () => {
    if (!peer.current || !reciever) return;

    if (currentRecieverStatus === "Disconnected") {
      const conn = peer.current.connect(reciever);
      conn.on("open", () => {
        conn.send({
          senderAvatar,
          senderName,
          key: encryptedAESKey.current,
          type: "connect",
        });
        setCurrentRecieverStatus("Connected");
        setStatus("Connection Established");
        connInstance.current = conn;
      });
    } else {
      connInstance.current?.close();
      setCurrentRecieverStatus("Disconnected");
      setStatus("Connection Closed");
    }
  };

  const deleteFileHandler = () => {
    setStatus("File Removed");
    setFile(null);
    setFileContents(null);
  };

  return (
    <Box sx={pageContainer}>
      <Container maxWidth="xl">
        <Grid container direction="row" spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} lg={8}>
            <Box sx={glassBackground}>
              <Grid
                container
                direction="column"
                spacing={{ xs: 2, sm: 3, md: 4 }}
              >
                <Grid
                  item
                  sx={{
                    display: "flex",
                    gap: { xs: 1, sm: 2 },
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Avatar src={senderAvatar} sx={gradientAvatar} />
                  <Typography variant="h4" component="h1" sx={gradientText}>
                    {senderName}
                  </Typography>
                </Grid>

                <Grid item>
                  <TextField
                    color="secondary"
                    value={peerId || ""}
                    label="Your Sender ID"
                    fullWidth
                    focused
                    sx={textField}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <InsertLink sx={{ color: "primary.main" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Share ID">
                            <Button onClick={handleShareClick} sx={iconButton}>
                              <Share color="primary" />
                            </Button>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Share this ID with the receiver to establish connection"
                  />
                  <MenuBar anchorEl={anchorEl} onHandleClose={handleShareClose} handleShare={handleShare} />
                </Grid>

                <Grid item>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      mb: 2,
                    }}
                  >
                    Upload a file to send
                  </Typography>

                  <DragAndDrop
                    onFileDrop={handleFileUpload}
                    disabled={buttonDisabled}
                  />

                  {fileContents && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                    >
                      <Button
                        variant="contained"
                        onClick={sendFile}
                        disabled={
                          fileContents === null ||
                          reciever === null ||
                          buttonDisabled
                        }
                        sx={gradientButton}
                      >
                        Send File
                      </Button>
                    </Box>
                  )}
                </Grid>

                {status && (
                  <Grid item>
                    <Typography variant="body1" sx={statusMessage({ status })}>
                      {status.includes("Successfully") ? (
                        <CheckCircle color="success" />
                      ) : status.includes("error") ? (
                        <Error color="error" />
                      ) : (
                        <Info color="info" />
                      )}
                      {status}
                    </Typography>
                  </Grid>
                )}

                {isProgressBar && (
                  <Grid item>
                    <Box sx={glassBackgroundLight}>
                      <Box sx={{ width: "100%", position: "relative", mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={progressBar}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            position: "absolute",
                            right: 0,
                            top: -20,
                            fontWeight: 600,
                            color: "primary.main",
                          }}
                        >
                          {progress.toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      {/* Transfer statistics */}
                      {transferStats.speed > 0 && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", px: 1, flexWrap: "wrap", gap: 1 }}>
                          <Typography variant="body2" sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: 1 }}>
                            <Speed fontSize="small" /> Speed: {formatSpeed(transferStats.speed)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: 1}}>
                            <Schedule fontSize="small" /> Estimated Time: {formatTime(transferStats.eta)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: 1}}>
                            <SyncAlt fontSize="small" />
                            Sent: {getFileSize(transferStats.bytesTransferred)} / {file ? getFileSize(file.size) : '0 B'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                )}

                {file && (
                  <Grid item>
                    <Box sx={glassBackgroundLight}>
                      <FileItem
                        fileName={file?.name || ""}
                        fileSize={file?.size || 0}
                        fileType={file?.type}
                        isRecieveMode={false}
                        deleteFile={deleteFileHandler}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={glassBackgroundLight}>
              <RecieverPanel
                reciever={recieverDetails}
                status={currentRecieverStatus}
                isRecieveMode={false}
                connectReciever={connectReciever}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <EmailDialog
        isDialogOpen={isEmailDialogOpen}
        peerId={peerId || ""}
        onClose={() => setIsEmailDialogOpen(false)}
      />
    </Box>
  );
};

export default Sender;
