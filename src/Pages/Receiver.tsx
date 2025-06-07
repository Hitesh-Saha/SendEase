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
} from "@mui/icons-material";
import FileItem from "../components/FileList/FileItem";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import { getAvatar, getName } from "../lib/utils";
import { PeerData, RecievedFileType, RecieverData } from "../models/common";
import { decryptAESKey, generateRSAPairKeys } from "../core/KeyGeneration";
import { decryptFile } from "../core/FileDecryption";
import { statusMessage } from "../styles/index.styles";
import LoadingComponent from "../components/LoadingComponent";

const recieverAvatar = getAvatar();
const recieverName = getName();

const Receiver = () => {
  const [isInitializing, setIsInitializing] = useState(true);
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
  const recievedFileChunks = useRef<Record<number, Uint8Array>>({});
  const aesKey = useRef<string>("");
  const startTime = useRef<number | null>(null);
  const receivedBytes = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [isFileReady, setIsFileReady] = useState(false);

  const initializeReciever = useCallback(() => {
    // Connect to our custom PeerJS server
    // const peerOptions = {
    //   host: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
    //   port: window.location.hostname === 'localhost' ? 9000 : 443,
    //   path: '/peerjs',
    //   secure: window.location.protocol === 'https:',
    //   debug: 2,
    // };
    
    peer.current = new Peer();
    peer.current.on("open", (id) => {
      setPeerId(id as string);
      console.log("Connected to signaling server with ID:", id);
    });
    
    peer.current.on("error", (err) => {
      console.error("PeerJS error:", err);
      setStatus(`Connection error: ${err.type}`);
    });

    const keys = generateRSAPairKeys();
    privateKey.current = keys.privateKey;
    setPublicKey(keys.publicKey);
    setIsInitializing(false);

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
            sendResponse();
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
    
    return () => {
      if (peer.current) {
        peer.current.destroy();
      }
      if (connInstance.current) {
        connInstance.current.close();
      }
    };
  }, []);

  const updateStatus = useCallback(
    (currentReceived: number, totalSize: number) => {
      if (totalSize && startTime.current) {
        const elapsedTime = (Date.now() - startTime.current) / 1000; // in seconds
        const speedBps = currentReceived / elapsedTime; // bytes per sec
        const speedKbps = speedBps / 1024;
        const speedMbps = speedKbps / 1024;
        const remainingBytes = totalSize - currentReceived;
        const remainingTime = remainingBytes / speedBps;

        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);

        if (minutes > 60) {
          const hours = Math.floor(minutes / 60);
          const newMinutes = Math.floor(minutes % 60);
          setEstimatedTime(`${hours}h ${newMinutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setEstimatedTime(`${minutes}m ${seconds}s`);
        } else {
          setEstimatedTime(`${seconds}s`);
        }
        const newProgress = (currentReceived / totalSize) * 100;
        setProgress(Math.round(Math.min(newProgress, 100)));
        setSpeed(
          speedMbps >= 1
            ? `${speedMbps.toFixed(2)} MB/s`
            : `${speedKbps.toFixed(2)} KB/s`
        );
      }
    },
    []
  );

  // Function to handle the received file chunks
  const recieveFileChunks = (encryptedChunk: string, sequence: number) => {
    if (!aesKey.current) return;

    const decryptedChunk = decryptFile(encryptedChunk, aesKey.current);
    recievedFileChunks.current[sequence] = decryptedChunk;

    receivedBytes.current += decryptedChunk.byteLength;
    updateStatus(receivedBytes.current, file.current?.size || 0);

    // setTimeout(() => {
    //   updateStatus(currentReceived, file.current?.size || 0);
    // }, 500);
  };

  const sendResponse = () => {
    setIsFileReady(true);
    if (connInstance.current) {
      setStatus("File Recieved Successfully");
      connInstance.current?.send({
        type: "completed",
      });
    }
  }

  const downloadFile = () => {
    const allChunks = Object.keys(recievedFileChunks.current)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => recievedFileChunks.current[Number(key)]);
    const blob = new Blob(allChunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.current?.name || "recieved_file";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("File Downloaded Successfully");
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

  if (isInitializing) {
    return (
      <LoadingComponent />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: (theme) =>
          `linear-gradient(145deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container direction="row" spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                background: (theme) =>
                  `linear-gradient(145deg, ${theme.palette.background.paper}80, ${theme.palette.background.default}40)`,
                backdropFilter: "blur(8px)",
                borderRadius: 2,
                p: { xs: 2, sm: 3, md: 4 },
                boxShadow: (theme) =>
                  `0 8px 32px ${theme.palette.primary.main}10`,
              }}
            >
              <Grid container direction="column" spacing={{ xs: 2, sm: 3, md: 4 }}>
                <Grid item sx={{ display: "flex", gap: { xs: 1, sm: 2 }, alignItems: "center", flexWrap: 'wrap' }}>
                  <Avatar
                    src={recieverAvatar}
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      boxShadow: (theme) =>
                        `0 0 0 4px ${theme.palette.background.paper}`,
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      fontWeight: 700,
                      background: (theme) =>
                        `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        background: (theme) =>
                          `${theme.palette.background.paper}80`,
                        backdropFilter: "blur(8px)",
                        borderRadius: 2,
                      },
                    }}
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
                    sx={{
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: "white",
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: (theme) =>
                          `0 8px 16px ${theme.palette.primary.main}40`,
                      },
                    }}
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
                </Grid>)}
                {file.current && (
                  <Grid item>
                    <Box
                      sx={{
                        background: (theme) =>
                          `${theme.palette.background.paper}60`,
                        backdropFilter: "blur(8px)",
                        borderRadius: 2,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ width: "100%", position: "relative" }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: (theme) =>
                              `${theme.palette.primary.main}20`,
                            "& .MuiLinearProgress-bar": {
                              background: (theme) =>
                                `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              borderRadius: 6,
                            },
                          }}
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
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                )}{" "}
                {file.current && (
                  <Grid item>
                    <Box
                      sx={{
                        background: (theme) =>
                          `${theme.palette.background.paper}60`,
                        backdropFilter: "blur(8px)",
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <FileItem
                        fileName={file.current?.name || ""}
                        fileSize={file.current?.size || 0}
                        fileType={file.current?.type}
                        isRecieveMode={true}
                      />
                      {isFileReady && (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={downloadFile}
                          sx={{
                            mt: 2,
                            background: (theme) =>
                              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            color: "white",
                            py: 1.5,
                            borderRadius: 2,
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: (theme) =>
                                `0 8px 16px ${theme.palette.primary.main}40`,
                            },
                          }}
                        >
                          Download File
                        </Button>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background: (theme) =>
                  `linear-gradient(145deg, ${theme.palette.background.paper}60, ${theme.palette.background.default}40)`,
                backdropFilter: "blur(8px)",
                borderRadius: 2,
                p: 3,
                height: "100%",
                boxShadow: (theme) =>
                  `0 8px 32px ${theme.palette.primary.main}10`,
              }}
            >
              <RecieverPanel
                reciever={senderDetails}
                status={currentSenderStatus}
                isRecieveMode={true}
              />
            </Box>
          </Grid>{" "}
        </Grid>
      </Container>
    </Box>
  );
};

export default Receiver;
