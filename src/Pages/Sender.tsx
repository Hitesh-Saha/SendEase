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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  ContentCopy,
  Email,
  Error,
  Info,
  InsertLink,
  Share,
  WhatsApp,
} from "@mui/icons-material";
import {
  pageContainer,
  glassMenu,
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
import { formatSpeed, formatTime, getAvatar, getFileSize, getName } from "../utils/utils";
import { RecieverData } from "../models/common";
import { encryptFile } from "../core/FileEncryption";
import { encryptAESKey, generateAESKey } from "../core/KeyGeneration";
import EmailDialog from "../components/EmailDialog/EmailDialog";

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
  const open = Boolean(anchorEl);
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

  const handleShare = async (platform: string) => {
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
    // Connect to our custom PeerJS server
    const peerOptions = {
      host: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
      port: window.location.hostname === 'localhost' ? 9000 : 443,
      path: '/peerjs',
      secure: window.location.protocol === 'https:',
      debug: 2,
    };
    
    peer.current = new Peer();
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
    connInstance.current?.send({ type: "end" });
  };

  connInstance.current?.on("data", (data: any) => {
    if (data.type === "completed") {
      const totalTime = (Date.now() - transferStats.startTime) / 1000; // in seconds
      const averageSpeed = file ? file.size / totalTime : 0; // bytes per second
      
      setStatus(`File Sent Successfully (${formatSpeed(averageSpeed)} avg)`);
      setButtonDisabled(false);
      setFileContents(null);
      setProgress(0);
      setIsProgressBar(false);
    }
  });

  const sendFileInChunks = () => {
    const chunkSize = 16 * 1024; // 16 KB per chunk
    let offset = 0;
    let sequence = 0;
    const totalSize = fileContents?.byteLength || 0;
    let lastUpdateTime = Date.now();
    let lastOffset = 0;

    const sendNextChunk = () => {
      if (!fileContents || !connInstance.current?.open) return;

      if (offset >= fileContents.byteLength) return;

      const chunk = new Uint8Array(
        fileContents.slice(offset, offset + chunkSize)
      );
      const encryptedChunk = encryptFile(chunk, aesKey.current!);
      connInstance.current?.send({
        contents: encryptedChunk,
        sequence,
        type: "file-data-chunk",
      });
      offset += chunkSize;
      sequence += 1;
      
      // Update progress and transfer statistics
      const now = Date.now();
      
      // Update transfer stats every ~500ms to avoid excessive re-renders
      if (now - lastUpdateTime > 500) {
        const timeElapsed = (now - lastUpdateTime) / 1000; // in seconds
        const bytesInInterval = offset - lastOffset;
        const currentSpeed = bytesInInterval / timeElapsed; // bytes per second
        const bytesRemaining = totalSize - offset;
        const eta = currentSpeed > 0 ? bytesRemaining / currentSpeed : 0;
        
        setTransferStats(prev => ({
          ...prev,
          speed: currentSpeed,
          eta: eta,
          bytesTransferred: offset
        }));
        
        lastUpdateTime = now;
        lastOffset = offset;
      }
      
      const currentProgress = Math.min(Math.round((offset / totalSize) * 100), 99);
      setProgress(currentProgress);
      
      // Update status message with progress percentage only
      // (speed and ETA are shown in the progress bar component)
      setStatus(`Sending File...`);
      
      // Use setTimeout to prevent UI freezing with large files
      sendNextChunk();
    };
    sendNextChunk();
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
                  />{" "}
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleShareClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    sx={glassMenu}
                  >
                    <MenuItem onClick={() => handleShare("copy-id")}>
                      <ListItemIcon>
                        <ContentCopy fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Copy ID to clipboard</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleShare("copy-link")}>
                      <ListItemIcon>
                        <InsertLink fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Copy shareable link</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleShare("email")}>
                      <ListItemIcon>
                        <Email fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Send via email</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleShare("whatsapp")}>
                      <ListItemIcon>
                        <WhatsApp fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Share on WhatsApp</ListItemText>
                    </MenuItem>
                  </Menu>
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
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Speed: {formatSpeed(transferStats.speed)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Estimated Time: {formatTime(transferStats.eta)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
