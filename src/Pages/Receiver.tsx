import { useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import { Avatar, Button, Divider, Grid, TextField, Typography } from "@mui/material";
import FileItem from "../components/FileList/FileItem";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import { getAvatar, getName } from "../utils/utils";
import { RecievedFileType, RecieverData } from "../models/common";
import { decryptAESKey, generateRSAPairKeys } from "../core/KeyGeneration";
import { decryptFile } from "../core/FileDecryption";

const recieverAvatar = getAvatar();
const recieverName = getName();

const Receiver = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [file, setFile] = useState<RecievedFileType | null>(null);
  const [sender, setSender] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [currentSenderStatus, setCurrentSenderStatus] = useState<string>("Disconnected");
  const [senderDetails, setSenderDetails] = useState<RecieverData | null>(null);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const privateKey = useRef<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const connInstance = useRef<DataConnection | null>(null);
  const peer = useRef<Peer | null>(null);
  const recievedFileChunks = useRef<Record<number,Uint8Array>>({});
  const aesKey = useRef<string>();

  useEffect(() => {
    initializeReciever();
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
      conn.on("data", (data: any) => {
        if (data.type === "fileMeta") {
          const { fileName, fileSize, fileType } = data;
          setFile({
            name: fileName,
            size: fileSize,
            type: fileType,
          });
        }else if (data.type === "chunk") {
          if (!aesKey.current) return;
          const { sequence, contents } = data;
          recieveFileChunks(contents, sequence)
        } else if (data.type === 'connect') {
          const { senderAvatar, senderName, key } = data;
          aesKey.current = decryptAESKey(privateKey.current as string, key);
          setSenderDetails({
            id: sender || '',
            avatar: senderAvatar,
            username: senderName,
          })
          setCurrentSenderStatus("Connected");
          setStatus('Connection Established');
        }
        else if (data.type === 'start') {
          setStatus('Recieving File...');
        }
        else if (data.type === "end") {
          const { fileName } = data;
          downloadFile(fileName)
        }
      });
      connInstance.current = conn;
    });
  };


  useEffect(() => {
    senderResponse()
  }, [isDownloaded]);

  const recieveFileChunks = (encryptedChunk: string, sequence: number) => {
  if (!aesKey.current) return;

  const decryptedChunk = decryptFile(encryptedChunk, aesKey.current);
  recievedFileChunks.current[sequence] = decryptedChunk;
};

  const downloadFile = (fileName: string) => {
    const allChunks = Object.keys(recievedFileChunks.current)
    .sort((a, b) => Number(a) - Number(b))
    .map(key => recievedFileChunks.current[Number(key)]);
    const blob = new Blob(allChunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    setStatus("File recieved successfully");
    setIsDownloaded(true);
  }

  const senderResponse = () => {
    if (isDownloaded && connInstance.current) {
      setStatus("File Downloaded Successfully");
      connInstance.current?.send({
        type: 'recieve',
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
  }

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
            <Grid
              item
              sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              {file && (
                <FileItem
                  fileName={file?.name || ""}
                  fileSize={file?.size || 0}
                  fileType={file?.type}
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
