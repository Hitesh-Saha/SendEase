import { useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import {
  CloudUpload,
  FileCopy,
} from "@mui/icons-material";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import FileItem from "../components/FileList/FileItem";

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

const Sender = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [reciever, setReciever] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [isProgressBar, setIsProgressBar] = useState<boolean>(false);
  const [fileContents, setFileContents] = useState<ArrayBuffer | string | null>(null);
  const [currentRecieverStatus, setCurrentRecieverStatus] = useState<string>('Disconnected');
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
        const { peerId } = data;
        setReciever(peerId);
        setStatus(`Connected to Reciever`);
      });
      connInstance.current = conn;
    });
  }
  useEffect(() => {
    initializeSender()
  }, []);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsProgressBar(true)
    if (event.target.files && event.target.files[0]) {
      setStatus('Uploading...')
      setFile(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (reader.result) {
          setFileContents(reader.result);
          if(ev.loaded === ev.total){
            setStatus('File Uploaded')
            setTimeout(()=> setIsProgressBar(false),2000)
          }
        }
      };
      reader.onprogress = (ev) => {
        setProgress(Math.round((ev.loaded/ev.total)*100))
      }
      reader.readAsArrayBuffer(event.target.files[0]);
    }
  };

  // Send file to connected peer
  const sendFile = () => {
    if (connInstance.current && fileContents) {
      const uploadedFile = {
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        contents: fileContents
      }
      connInstance.current?.send(uploadedFile);
      setStatus('File Sent');
    }
  };

  const connectReciever = () => {
    if (!peer.current || !reciever) return;

    if(currentRecieverStatus === 'Disconnected') {
      const conn = peer.current.connect(reciever);
      conn.on("open", () => {
        setCurrentRecieverStatus('Connected')
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

  const handleCopy = () => {
    navigator.clipboard.writeText(peerId ?? '');
  }

  const DeleteFileHandler = () => {
    setStatus('File Removed')
    setFile(null)
    setFileContents(null)
  }

  const resetStatus = () => {
    setStatus('');
  }

  return (
    <>
      <Grid container direction="row" spacing={2} padding={3} flexWrap='nowrap'>
        <Grid item xs={12} md={8} paddingRight={"1rem"}>
          <Grid container direction="column" spacing={3}>
            <Grid item width="100%">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    color="secondary"
                    value={peerId || ''}
                    label="Sender ID"
                    fullWidth
                    focused
                    InputProps={{
                      readOnly: true,
                    }}
                    helperText="The receiver needs to connect to this id"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title="Copy to clipboard">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCopy}
                      size='large'
                    >
                      <FileCopy />
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
            <Grid
              item
              width="100%"
            >
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
                  <Button variant="contained" size="large" onClick={sendFile} disabled={(!reciever && !file)}>
                    Send File
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{status}</Typography>
                  {isProgressBar && <Box
                    sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
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
                  </Box>}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              {file && <FileItem fileName={file?.name || ''} fileSize={file?.size || 0} fileType={file?.type} DeleteFile={DeleteFileHandler}/>}
            </Grid>
          </Grid>
        </Grid>
        <Divider variant="middle" orientation="vertical" flexItem />
        <RecieverPanel reciever={reciever} status={currentRecieverStatus} isRecieveMode={false} connectReciever={connectReciever}/>
      </Grid>
    </>
  );
};

export default Sender;
