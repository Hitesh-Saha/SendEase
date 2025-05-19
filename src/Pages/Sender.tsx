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
import DragAndDrop from "../components/DragAndDrop/DragAndDrop";
import { 
  CheckCircle,
  ContentCopy,
  Email,
  Error,
  Facebook,
  Info,
  LinkedIn,
  InsertLink,
  Share,
  Twitter,
  WhatsApp
} from "@mui/icons-material";
import RecieverPanel from "../components/RecieverPanel/RecieverPanel";
import FileItem from "../components/FileList/FileItem";
import { getAvatar, getName } from "../utils/utils";
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
  const [fileContents, setFileContents] = useState<ArrayBuffer | null>(
    null
  );
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
      case 'copy-id':
        await navigator.clipboard.writeText(peerId);
        setStatus("ID copied to clipboard");
        break;
      case 'copy-link':
        await navigator.clipboard.writeText(shareUrl);
        setStatus("Link copied to clipboard");
        break;
      case 'email':
        handleEmailDialogOpen();
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
    }
    handleShareClose();
  };

  const handleEmailDialogOpen = () => {
    setIsEmailDialogOpen(true);
    handleShareClose();
  };

  const initializeSender =  useCallback(() => {
    peer.current = new Peer();
    peer.current.on("open", (id) => {
      setPeerId(id);
    });

    aesKey.current = generateAESKey();

    peer.current.on("connection", (conn) => {
      conn.on("data", (data: any) => {
        if (data.type == 'connect') {
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
    setStatus("Sending File...");

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
    if (data.type === "finished") {
      setStatus("File Sent Successfully");
      setButtonDisabled(false)
      setFileContents(null)
    }
  });

  const sendFileInChunks = () => {
    const chunkSize = 16 * 1024; // 16 KB per chunk
    let offset = 0;
    let sequence = 0;

    const sendNextChunk = () => {
      if (!fileContents || !connInstance.current?.open) return;

      if (offset >= fileContents.byteLength) return;

      const chunk = new Uint8Array(fileContents.slice(offset, offset + chunkSize));
      const encryptedChunk = encryptFile(chunk, aesKey.current!);
      connInstance.current?.send({
        contents: encryptedChunk,
        sequence,
        type: "file-data-chunk",
      });
      offset += chunkSize;
      sequence += 1;
      sendNextChunk();
    }
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
    }
    else {
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
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: (theme) => `linear-gradient(145deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container direction="row" spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}80, ${theme.palette.background.default}40)`,
                backdropFilter: 'blur(8px)',
                borderRadius: 2,
                p: { xs: 2, sm: 3, md: 4 },
                boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}10`,
              }}
            >
              <Grid container direction="column" spacing={{ xs: 2, sm: 3, md: 4 }}>
                <Grid item sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Avatar 
                    src={senderAvatar} 
                    sx={{ 
                      width: { xs: 48, sm: 56 }, 
                      height: { xs: 48, sm: 56 },
                      boxShadow: (theme) => `0 0 0 4px ${theme.palette.background.paper}`,
                      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  />
                  <Typography 
                    variant="h4" 
                    component="h1"
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      fontWeight: 700,
                      background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: (theme) => `${theme.palette.background.paper}80`,
                        backdropFilter: 'blur(8px)',
                        borderRadius: 2,
                      },
                    }}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <InsertLink sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Share ID">
                            <Button
                              onClick={handleShareClick}
                              sx={{
                                minWidth: 'auto',
                                p: 1,
                                borderRadius: 1,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  background: (theme) => `${theme.palette.primary.main}20`,
                                  transform: 'scale(1.05)',
                                }
                              }}
                            >
                              <Share color="primary" />
                            </Button>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Share this ID with the receiver to establish connection"
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleShareClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    sx={{
                      '& .MuiPaper-root': {
                        background: (theme) => `${theme.palette.background.paper}CC`,
                        backdropFilter: 'blur(8px)',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                      }
                    }}
                  >
                    <MenuItem onClick={() => handleShare('copy-id')}>
                      <ListItemIcon>
                        <ContentCopy fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Copy ID to clipboard</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleShare('copy-link')}>
                      <ListItemIcon>
                        <InsertLink fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Copy shareable link</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleShare('email')}>
                      <ListItemIcon>
                        <Email fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Send via email</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleShare('whatsapp')}>
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
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >                    
                    Upload a file to send
                  </Typography>                  

                  <DragAndDrop onFileDrop={handleFileUpload}
                    disabled={buttonDisabled}
                  />

                  {fileContents && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                      <Button
                        variant="contained"
                        onClick={sendFile}
                        disabled={fileContents === null || reciever === null || buttonDisabled}
                        sx={{
                          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          color: 'white',
                          px: 6,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}40`,
                          },
                        }}
                      >
                        Send File
                      </Button>
                    </Box>
                  )}
                </Grid>

                <Grid item>
                  <Typography
                    variant="body1"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: (theme) => status.includes("Successfully") ? 
                        `${theme.palette.success.main}10` : 
                        status.includes("error") ?
                        `${theme.palette.error.main}10` :
                        `${theme.palette.info.main}10`,
                      border: (theme) => `1px solid ${status.includes("Successfully") ? 
                        theme.palette.success.main : 
                        status.includes("error") ?
                        theme.palette.error.main :
                        theme.palette.info.main}20`,
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: isProgressBar ? 2 : 0,
                    }}
                  >
                    {status.includes("Successfully") ? <CheckCircle color="success" /> :
                     status.includes("error") ? <Error color="error" /> :
                     <Info color="info" />}
                    {status}
                  </Typography>

                  {isProgressBar && (
                    <Box
                      sx={{
                        background: (theme) => `${theme.palette.background.paper}60`,
                        backdropFilter: 'blur(8px)',
                        borderRadius: 2,
                        p: 3,
                      }}
                    >
                      <Box sx={{ width: '100%', position: 'relative' }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: (theme) => `${theme.palette.primary.main}20`,
                            '& .MuiLinearProgress-bar': {
                              background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              borderRadius: 6,
                            }
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: -20,
                            fontWeight: 600,
                            color: 'primary.main',
                          }}
                        >
                          {progress.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                {file && (
                  <Grid item>
                    <Box
                      sx={{
                        background: (theme) => `${theme.palette.background.paper}60`,
                        backdropFilter: 'blur(8px)',
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
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
            <Box
              sx={{
                background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}60, ${theme.palette.background.default}40)`,
                backdropFilter: 'blur(8px)',
                borderRadius: 2,
                p: 3,
                height: '100%',
                boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}10`,
              }}
            >
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
      <EmailDialog isDialogOpen={isEmailDialogOpen} peerId={peerId || ''} onClose={() => setIsEmailDialogOpen(false)} />
    </Box>
  );
};

export default Sender;
