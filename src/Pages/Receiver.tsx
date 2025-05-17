import { useCallback, useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import { Avatar, Button, Divider, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import FileItem from "../components/FileList/FileItem";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import { getAvatar, getName } from "../utils/utils";
import { PeerData, RecievedFileType, RecieverData } from "../models/common";
import { decryptAESKey, generateRSAPairKeys } from "../core/KeyGeneration";
import { decryptFile } from "../core/FileDecryption";

const recieverAvatar = getAvatar();
const recieverName = getName();

const Receiver = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [sender, setSender] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [currentSenderStatus, setCurrentSenderStatus] = useState<string>("Disconnected");
  const [senderDetails, setSenderDetails] = useState<RecieverData | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const privateKey = useRef<string | null>(null);
  const file = useRef<RecievedFileType | null>(null);
  const connInstance = useRef<DataConnection | null>(null);
  const peer = useRef<Peer | null>(null);
  const recievedFileChunks = useRef<Record<number,Uint8Array>>({});
  const aesKey = useRef<string>('');
  const startTime = useRef<number | null>(null);
  const receivedBytes = useRef<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  useEffect(() => {
    initializeReciever();

    return () => {
      if (peer.current) {
        peer.current.destroy();
      }
      if (connInstance.current) {
        connInstance.current.close();
      }
    };
  }, []);

  const initializeReciever = () => {
    peer.current = new Peer();
    peer.current.on("open", (id) => {
      setPeerId(id as string);
    });

    const keys = generateRSAPairKeys()
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
              id: sender || '',
              avatar: senderAvatar,
              username: senderName,
            })
            setCurrentSenderStatus("Connected");
            setStatus('Connection Established');
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
            recieveFileChunks(peerData.contents, peerData.sequence)
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
  };

  const updateStatus = useCallback((currentReceived: number, totalSize: number) => {
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
      }
      else if (minutes > 0) {
        setEstimatedTime(`${minutes}m ${seconds}s`);
      } else {
        setEstimatedTime(`${seconds}s`);
      }
      const newProgress = (currentReceived / totalSize) * 100;
      setProgress(Math.round(Math.min(newProgress, 100)));
      setSpeed(speedMbps >= 1 ? `${speedMbps.toFixed(2)} MB/s` : `${speedKbps.toFixed(2)} KB/s`);
    }
  }, []);

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
    .map(key => recievedFileChunks.current[Number(key)]);
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
        type: 'finished',
      })
    }
  }

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
          type: 'connect'
        });
        setStatus("Connection request sent to the sender");
      });
      conn?.on('error', (err) => {
        console.log(err)
      })
      connInstance.current = conn;
      setIsConnected(true)
    }
  };

  const onSenderChangeHandler = (e: any) => {
    e.preventDefault();
    setSender(e.target.value);
    setIsConnected(false);
    setCurrentSenderStatus("Disconnected");
  };

  return (
    <>
      <Grid container direction="row" spacing={2} justifyContent={'space-between'} padding={'1rem'}>
        <Grid item xs={12} md={8} paddingRight={'1rem'}>
          <Grid container direction="column" spacing={3}>
          <Grid item sx={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
              <Avatar src={recieverAvatar} sizes="large"/>
              <Typography variant="h5" component="h2">{recieverName}</Typography>
            </Grid>
            <Grid item width="100%">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    color="secondary"
                    value={sender || ""}
                    label="Enter the sender Id:"
                    fullWidth
                    onChange={onSenderChangeHandler}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: "1.2rem" }}>
              <Button
                variant="contained"
                size="large"
                onClick={createConnection}
                disabled={isConnected}
              >
                Connect
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">{status}</Typography>
            </Grid>
            {file.current && (
              <Grid item xs={12}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 5, mt: 2 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Progress: {progress.toFixed(2)}%
                </Typography>
                <Typography variant="body2">
                  Estimated Time Left: {estimatedTime || "Calculating..."}
                </Typography>
                <Typography variant="body2">
                  Speed: {speed || "Calculating..."}
                </Typography>
              </Grid>
            )}
            <Grid
              item
              sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              {file.current && (
                <FileItem
                  fileName={file.current?.name || ""}
                  fileSize={file.current?.size || 0}
                  fileType={file.current?.type}
                  isRecieveMode={true}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Divider variant="middle" orientation="vertical" flexItem />
        <RecieverPanel
          reciever={senderDetails}
          status={currentSenderStatus}
          isRecieveMode={true}
        />
      </Grid>
    </>
  );
};

export default Receiver;
