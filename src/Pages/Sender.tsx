import React, { useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import {
  Button,
  Grid,
  Typography,
  styled,
  LinearProgress,
  Box,
  TextField,
  Tooltip,
  Divider,
  Avatar,
} from "@mui/material";
import { CloudUpload, FileCopy } from "@mui/icons-material";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import FileItem from "../components/FileList/FileItem";
import { getAvatar, getName } from "../utils/utils";
import { RecieverData } from "../models/common";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const senderAvatar = getAvatar();
const senderName = getName();

const Sender = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [reciever, setReciever] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [isProgressBar, setIsProgressBar] = useState<boolean>(false);
  const [fileContents, setFileContents] = useState<ArrayBuffer | string | null>(
    null
  );
  const [currentRecieverStatus, setCurrentRecieverStatus] =
    useState<string>("Disconnected");
  const [recieverDetails, setRecieverDetails] = useState<RecieverData | null>(
    null
  );
  const connInstance = useRef<DataConnection | null>(null);
  const peer = useRef<Peer | null>(null);

  const initializeSender = () => {
    // Initialize Peer
    peer.current = new Peer();
    peer.current.on("open", (id) => {
      setPeerId(id);
    });

    peer.current.on("connection", (conn) => {
      conn.on("data", (data: any) => {
        if (data.type === "connect") {
          const { peerId, recieverAvatar, recieverName } = data;
          setReciever(peerId);
          setRecieverDetails({
            id: peerId,
            avatar: recieverAvatar,
            username: recieverName,
          });
          setStatus(`Reciever waiting in the lobby`);
        } else {
          const { message } = data;
          if (message === "File Recieved") {
            setStatus("File Sent Successfully");
          }
        }
      });
      connInstance.current = conn;
    });
  };
  useEffect(() => {
    initializeSender();
  }, []);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setIsProgressBar(true);
    if (event.target.files && event.target.files[0]) {
      setStatus("Uploading...");
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (reader.result) {
          setFileContents(reader.result);
          if (ev.loaded === ev.total) {
            setStatus("File Uploaded");
            setTimeout(() => setIsProgressBar(false), 2000);
          }
        }
      };
      reader.onprogress = (ev) => {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      };
      reader.readAsArrayBuffer(event.target.files[0]);
      setFile(event.target.files[0]);
    }
  };

  // Send file to connected peer
  const sendFile = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (connInstance.current && fileContents) {
      const uploadedFile = {
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        contents: fileContents,
        type: "file",
      };
      connInstance.current?.send({ message: "Sending File" });
      connInstance.current?.send(uploadedFile);
      connInstance.current?.send({ message: "File Sent" });
      setStatus("Sending File...");
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
          type: "connect",
        });
        setCurrentRecieverStatus("Connected");
        setStatus("Connection Established");
      });
      connInstance.current = conn;
    }
    // else {
    //   connInstance.current?.close();
    //   connInstance.current?.on("close", () => {
    //     setCurrentRecieverStatus('Disconnected')
    //     // setStatus("Connected to Reciever");
    //   });
    // }
  };

  const handleCopy = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(peerId ?? "");
  };

  const DeleteFileHandler = () => {
    setStatus("File Removed");
    setFile(null);
    setFileContents(null);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        spacing={2}
        justifyContent={"space-between"}
        padding={"1rem"}
      >
        <Grid item xs={12} md={8} paddingRight={"1rem"}>
          <Grid container direction="column" spacing={3}>
            <Grid
              item
              sx={{ display: "flex", gap: "1rem", alignItems: "center" }}
            >
              <Avatar src={senderAvatar} sizes="large" />
              <Typography variant="h5" component="h2">
                {senderName}
              </Typography>
            </Grid>
            <Grid item width="100%">
              <Grid container spacing={2}>
                <Grid item xs={true}>
                  <TextField
                    color="secondary"
                    value={peerId || ""}
                    label="Sender ID"
                    fullWidth
                    focused
                    InputProps={{
                      readOnly: true,
                    }}
                    helperText="The receiver needs to connect to this id"
                  />
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Copy to clipboard">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCopy}
                      sx={{
                        display: "flex",
                        paddingTop: "0.7rem",
                        paddingBottom: "0.7rem",
                      }}
                    >
                      <FileCopy fontSize="large" />
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h4" color="text.secondary">
                Upload a file to send
              </Typography>
            </Grid>
            <Grid item width="100%">
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: "flex", gap: "1.2rem" }}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                    size="large"
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={sendFile}
                    disabled={fileContents === null || reciever === null}
                  >
                    Send File
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{status}</Typography>
                  {isProgressBar && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          color="primary"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >{`${Math.round(progress)}%`}</Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
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
                  isRecieveMode={false}
                  DeleteFile={DeleteFileHandler}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Divider variant="fullWidth" orientation="vertical" flexItem />
        <RecieverPanel
          reciever={recieverDetails}
          status={currentRecieverStatus}
          isRecieveMode={false}
          connectReciever={connectReciever}
        />
      </Grid>
    </>
  );
};

export default Sender;
