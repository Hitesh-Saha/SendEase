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
import { glassBackground, glassBackgroundLight, gradientAvatar, gradientButton, gradientText, pageContainer, progressBar, statusMessage, textField } from "../styles/index.styles";

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
            downloadFile();
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
        type: "completed",
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
              <Grid container direction="column" spacing={{ xs: 2, sm: 3, md: 4 }}>
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
                      sx={glassBackgroundLight}
                    >
                      <Box sx={{ width: "100%", position: "relative" }}>
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
                )}
                {file.current && (
                  <Grid item>
                    <Box
                      sx={glassBackgroundLight}
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
