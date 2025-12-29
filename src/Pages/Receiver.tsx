import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Info,
  InsertLink,
  Link,
  Schedule,
  Speed,
  SyncAlt,
} from "@mui/icons-material";
import FileItem from "../components/FileList/FileItem";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import { formatSpeed, formatTime, getAvatar, getFileSize, getName } from "../lib/utils";
import { PeerData, RecievedFileType, RecieverData } from "../models/common";
import { decryptAESKey, generateRSAPairKeys } from "../core/KeyGeneration";
import { glassBackground, glassBackgroundLight, gradientAvatar, gradientButton, gradientText, pageContainer, progressBar, statusMessage, textField } from "../styles/index.styles";
import FileRecieverWorker from '../lib/fileReceiver.worker.ts?worker';

const recieverAvatar = getAvatar();
const recieverName = getName();

const Receiver = () => {
  const { id: urlSenderId } = useParams();
  const navigate = useNavigate();
  const [peerId, setPeerId] = useState<string | null>(null);
  const [sender, setSender] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [currentSenderStatus, setCurrentSenderStatus] =
    useState<string>("Disconnected");
  const [senderDetails, setSenderDetails] = useState<RecieverData | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const privateKey = useRef<string | null>(null);
  const file = useRef<RecievedFileType | null>(null);
  const connInstance = useRef<DataConnection | null>(null);
  const peer = useRef<Peer | null>(null);
  const aesKey = useRef<string>("");
  const startTime = useRef<number | null>(null);
  const receivedBytes = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const [isDownloadEnabled, setIsDownloadEnabled] = useState<boolean>(false);

  const initializeReciever = useCallback(() => {
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
      setPeerId(id as string);
    });

    const keys = generateRSAPairKeys();
    privateKey.current = keys.privateKey;
    setPublicKey(keys.publicKey);

    peer.current?.on("connection", (conn) => {
      conn.on("data", (data: unknown) => {
        const peerData = data as PeerData;
        switch (peerData.type) {
          case "connect":
            if (!privateKey.current) return;
            const { senderAvatar, senderName, key } = peerData;
            aesKey.current = decryptAESKey(privateKey.current as string, key);
            setSenderDetails({
              id: sender || "",
              avatar: senderAvatar,
              username: senderName,
            });
            setCurrentSenderStatus("Connected");
            setStatus("Connection Established");
            break;
          case "file-meta":
            file.current = {
              name: peerData.fileName,
              size: peerData.fileSize,
              type: peerData.fileType,
            };
            break;
          case "start":
            if (!file.current) return;
            startTime.current = Date.now();
            receivedBytes.current = 0;
            setEstimatedTime(null);
            setProgress(0);
            setSpeed(null);
            setStatus("Recieving File...");
            break;
          case "file-data-chunk":
            if (!aesKey.current || !file) return;
            recieveFileChunks(peerData.contents, peerData.sequence);
            break;
          case "end":
            respondSender();
            break;
          default:
            break;
        }
      });
      connInstance.current = conn;
    });
  }, []);

  useEffect(() => {
    new Promise((resolve) => {
      initializeReciever();
      resolve(true);
    }).then(() => {
      // If a sender ID is provided in the URL, set it and try to connect
      if (urlSenderId && !sender && !isConnected && peer.current && publicKey) {
        setSender(urlSenderId);
        const conn = peer.current.connect(urlSenderId);
        conn?.on("open", () => {
          conn.send({
            peerId,
            recieverAvatar,
            recieverName,
            key: publicKey,
            type: "connect",
          });
          setStatus("Connection request sent to the sender");
        });
        conn?.on("error", (err) => {
          console.log(err);
          setStatus(
            "Failed to connect to sender. Please check the ID and try again."
          );
        });
        connInstance.current = conn;
        setIsConnected(true);
      }
    });

    workerRef.current = new FileRecieverWorker();
    workerRef.current.postMessage({ type: 'init' });
    
    return () => {
      if (peer.current) {
        peer.current.destroy();
      }
      if (connInstance.current) {
        connInstance.current.close();
      }
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'cleanup' });
      }
    };
  }, []);

  const updateStatus = 
  // useCallback(
    (currentReceived: number, totalSize: number) => {
      if (totalSize && startTime.current) {
        const elapsedTime = (Date.now() - startTime.current) / 1000; // in seconds
        const speedBps = currentReceived / elapsedTime; // bytes per sec
        const remainingBytes = totalSize - currentReceived;
        const remainingTime = remainingBytes / speedBps;

        const newProgress = (currentReceived / totalSize) * 100;
        setProgress(Math.round(Math.min(newProgress, 100)));

        setEstimatedTime(remainingTime ? formatTime(remainingTime) : 'Calculating...');
        setSpeed(formatSpeed(speedBps));
      }
    }
    // []
  // );

  // Function to handle the received file chunks
  const recieveFileChunks = (encryptedChunk: string, sequence: number) => {
    if (!aesKey.current) return;
    workerRef.current?.postMessage({
      type: 'chunk',
      chunk: encryptedChunk,
      sequence,
      aesKey: aesKey.current,
      fileType: file.current?.type || 'application/octet-stream',
    });

    receivedBytes.current += encryptedChunk.length;
    updateStatus(receivedBytes.current, file.current?.size || 0);
  };

  const downloadFile = () => {
    setStatus("Preparing file for download...");
    workerRef.current?.postMessage({ type: 'download', aesKey: aesKey.current, fileType: file.current?.type || 'application/octet-stream' });
    if (workerRef.current) {
      workerRef.current.onmessage = (e) => {
        const { type, blob } = e.data;
        if (type !== 'download-ready' || !blob) return;
        setStatus("Download started...");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.current?.name || "recieved_file";
        a.click();
        URL.revokeObjectURL(url);
        setStatus("File downloaded successfully");
        workerRef.current?.postMessage({ type: 'cleanup' });
        workerRef.current?.terminate();
        workerRef.current = null;
        setIsDownloadEnabled(false);
      }
    }
  };
  
  const respondSender = () => {
    if (connInstance.current) {
      connInstance.current?.send({
        type: "completed",
      });
      setIsDownloadEnabled(true);
      setStatus("File Recieved Successfully");
    }
  };

  const createConnection = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!peer.current || !sender) return;

    if (currentSenderStatus === "Disconnected") {
      const conn = peer.current?.connect(sender);
      conn?.on("open", () => {
        conn.send({
          peerId,
          recieverAvatar,
          recieverName,
          key: publicKey,
          type: "connect",
        });
        setStatus("Connection request sent to the sender");
      });
      conn?.on("error", (err) => {
        console.log(err);
      });
      connInstance.current = conn;
      setIsConnected(true);
    }
  };

  const onSenderChangeHandler = (e: any) => {
    e.preventDefault();
    const newSenderId = e.target.value;
    setSender(newSenderId);
    setIsConnected(false);
    setCurrentSenderStatus("Disconnected");

    // Update URL when sender ID changes
    if (newSenderId) {
      navigate("/receiver", { replace: true });
    }
  };

  return (
    <Box
      sx={pageContainer}
    >
      <Container maxWidth="xl">
        <Grid container direction="row" spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} lg={8}>
            <Box
              sx={glassBackground}
            >
              <Grid container direction="column" spacing={{ xs: 2, sm: 3, md: 3 }}>
                <Grid item sx={{ display: "flex", gap: { xs: 1, sm: 2 }, alignItems: "center", flexWrap: 'wrap' }}>
                  <Avatar
                    src={recieverAvatar}
                    sx={gradientAvatar}
                  />
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={gradientText}
                  >
                    {recieverName}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    color="secondary"
                    value={sender || ""}
                    label="Enter Sender ID"
                    fullWidth
                    onChange={onSenderChangeHandler}
                    sx={textField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InsertLink sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={createConnection}
                    disabled={isConnected}
                    sx={gradientButton}
                    startIcon={<Link />}
                  >
                    Connect
                  </Button>
                </Grid>
                {status && (
                <Grid item>
                  <Typography
                    variant="body1"
                    sx={statusMessage({ status })}
                  >
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
                {file.current && (
                  <Grid item>
                    <Box
                      sx={{ ...glassBackgroundLight, display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center' }}
                    >
                      <Box sx={{ width: "100%", position: "relative", mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={progressBar}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            position: "absolute",
                            right: 0,
                            top: -25,
                            fontWeight: 600,
                            color: "primary.main",
                          }}
                        >
                          {progress.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", px: 1, flexWrap: "wrap", gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "text.secondary",
                          }}
                        >
                          <Speed fontSize="small" />
                          Speed: {speed || "Calculating..."}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "text.secondary",
                          }}
                        >
                          <Schedule fontSize="small" />
                          Time Left: {estimatedTime || "Calculating..."}
                        </Typography>

                        <Typography 
                          variant="body2" 
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "text.secondary",
                          }}
                        >
                          <SyncAlt fontSize="small" />
                          Recieved: {getFileSize(receivedBytes.current)} / {file.current ? getFileSize( file.current.size) : '0 B'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {file.current && (
                  <Grid item>
                    <Box
                      sx={{...glassBackgroundLight, display: 'flex', alignItems: 'center', gap: 1} }
                    >
                      <FileItem
                        fileName={file.current?.name || ""}
                        fileSize={file.current?.size || 0}
                        fileType={file.current?.type}
                        isRecieveMode={true}
                      />
                      <Button
                        variant="contained"
                        onClick={() => {
                          downloadFile();
                        }}
                        disabled={!isDownloadEnabled}
                        sx={gradientButton}
                      >
                        Download
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={glassBackgroundLight}
            >
              <RecieverPanel
                reciever={senderDetails}
                status={currentSenderStatus}
                isRecieveMode={true}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Receiver;
