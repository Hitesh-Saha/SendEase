import { useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import FileItem from "../components/FileList/FileItem";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
// import { useParams } from "react-router-dom";

type RecievedFileType = {
  name: string;
  size: number;
  type: string;
};

const Receiver = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [file, setFile] = useState<RecievedFileType | null>(null);
  const [sender, setSender] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [currentSenderStatus, setCurrentSenderStatus] =
    useState<string>("Disconnected");
  const connInstance = useRef<DataConnection | null>(null);
  const peer = useRef<Peer | null>(null);
  // const { id: senderId } = useParams();

  const initializeReciever = () => {
    peer.current = new Peer();
    peer.current.on("open", (id) => {
      setPeerId(id as string);
    });

    peer.current.on("connection", (conn) => {
      conn.on("data", (data: any) => {
        if (data.type === "file") {
          const { fileName, fileSize, fileType, contents } = data;
          setFile({
            name: fileName,
            size: fileSize,
            type: fileType,
          });
          const blob = new Blob([contents]);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
          setStatus("File recieved successfully");
        } else {
          const { message } = data;
          if (message === "Connection Established"){
            setCurrentSenderStatus("Connected");
          }
          else if (message === 'Sending File') {
            setStatus('Recieving File...')
          }
        }
      });
      connInstance.current = conn;
    });

    // if(senderId){
    //   setSender(senderId);
    //   const conn = peerInstance?.connect(senderId);
    //   conn?.on("open", () => {
    //     conn.send(`peerId:${peerId}`);
    //     setStatus("Connected to peer");
    //   });
    // }
  };

  useEffect(() => {
    initializeReciever();
  }, []);

  const createConnection = () => {
    if (!peer.current || !sender) return;

    if (currentSenderStatus === "Disconnected") {
      const conn = peer.current?.connect(sender);
      conn?.on("open", () => {
        conn.send({ 
          peerId,
          type: 'connect'
        });
        setStatus("Connected to Sender");
      });
      conn?.on('error', (err) => {
        console.log(err)
      })
      connInstance.current = conn;
    }
  };

  return (
    <>
      <Grid container direction="row" spacing={2} flexWrap="nowrap">
        <Grid item xs={12} md={8} paddingRight={"1rem"}>
          <Grid container direction="column" spacing={3}>
            <Grid item width="100%">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    color="secondary"
                    value={sender || ""}
                    label="Enter the sender Id:"
                    fullWidth
                    onChange={(e) => setSender(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: "1.2rem" }}>
              <Button
                variant="contained"
                size="large"
                onClick={createConnection}
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
          reciever={sender}
          status={currentSenderStatus}
          isRecieveMode={true}
        />
      </Grid>
    </>
  );
};

export default Receiver;
