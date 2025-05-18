import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer, { DataConnection } from "peerjs";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Link,
  Schedule,
  Share,
  Speed,
} from "@mui/icons-material";
import FileItem from "../components/FileList/FileItem";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import { getAvatar, getName } from "../utils/utils";
import { PeerData, RecievedFileType, RecieverData } from "../models/common";
import { decryptAESKey, generateRSAPairKeys } from "../core/KeyGeneration";
import { decryptFile } from "../core/FileDecryption";

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
  const recievedFileChunks = useRef<Record<number, Uint8Array>>({});
  const aesKey = useRef<string>("");
  const startTime = useRef<number | null>(null);
  const receivedBytes = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  useEffect(() => {
    initializeReciever();

    // If a sender ID is provided in the URL, set it and try to connect
    // if (urlSenderId && !sender) {
    //   setSender(urlSenderId);
    //   setIsConnected(false);
    //   setCurrentSenderStatus("Disconnected");
    // }

    return () => {
      if (peer.current) {
        peer.current.destroy();
      }
      if (connInstance.current) {
        connInstance.current.close();
      }
    };
  }, []);

  // Auto-connect when sender ID is set from URL
  // useEffect(() => {
  //   if (
  //     urlSenderId &&
  //     sender === urlSenderId &&
  //     !isConnected &&
  //     peer.current &&
  //     publicKey
  //   ) {
  //     const conn = peer.current.connect(urlSenderId);
  //     conn?.on("open", () => {
  //       conn.send({
  //         peerId,
  //         recieverAvatar,
  //         recieverName,
  //         key: publicKey,
  //         type: "connect",
  //       });
  //       setStatus("Connection request sent to the sender");
  //     });
  //     conn?.on("error", (err) => {
  //       console.log(err);
  //       setStatus(
  //         "Failed to connect to sender. Please check the ID and try again."
  //       );
  //     });
  //     connInstance.current = conn;
  //     setIsConnected(true);
  //   }
  // }, [urlSenderId, sender, isConnected, peer.current, publicKey, peerId]);

  const initializeReciever = useCallback(() => {
    peer.current = new Peer();
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
            downloadFile();
            break;
          default:
            break;
        }
      });
      connInstance.current = conn;
    });
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

    if (connInstance.current) {
      setStatus("File Downloaded Successfully");
      connInstance.current?.send({
        type: "finished",
      });
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
    // if (newSenderId) {
    //   navigate(`/receiver/${newSenderId}`, { replace: true });
    // } else {
    //   navigate("/receiver", { replace: true });
    // }
  };
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: (theme) =>
          `linear-gradient(145deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                background: (theme) =>
                  `linear-gradient(145deg, ${theme.palette.background.paper}80, ${theme.palette.background.default}40)`,
                backdropFilter: "blur(8px)",
                borderRadius: 2,
                p: 4,
                boxShadow: (theme) =>
                  `0 8px 32px ${theme.palette.primary.main}10`,
              }}
            >
              <Grid container direction="column" spacing={4}>
                <Grid
                  item
                  sx={{ display: "flex", gap: 2, alignItems: "center" }}
                >
                  <Avatar
                    src={recieverAvatar}
                    sx={{
                      width: 56,
                      height: 56,
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
                </Grid>{" "}
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
                          <Share sx={{ color: "primary.main" }} />
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
                <Grid item>
                  <Typography
                    variant="body1"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: (theme) =>
                        status.includes("Successfully")
                          ? `${theme.palette.success.main}10`
                          : status.includes("error")
                          ? `${theme.palette.error.main}10`
                          : `${theme.palette.info.main}10`,
                      border: (theme) =>
                        `1px solid ${
                          status.includes("Successfully")
                            ? theme.palette.success.main
                            : status.includes("error")
                            ? theme.palette.error.main
                            : theme.palette.info.main
                        }20`,
                      color: "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
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
                </Grid>{" "}
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
