import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { glassDialog, textField, gradientButton } from "../../styles/index.styles";

interface EmailDialogProps {
  isDialogOpen: boolean;
  peerId: string;
  onClose: () => void;
}

const EmailDialog = ({ isDialogOpen, peerId, onClose }: EmailDialogProps) => {
  const [receiverEmail, setReceiverEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = () => {
    if (!validateEmail(receiverEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    const shareUrl = `${window.location.origin}/receiver/${peerId}`;
    const shareText = `Join me on SendEase to receive a secure file transfer. My Sender ID is: ${peerId}. You can also use this link: ${shareUrl}`;
    window.location.href = `mailto:${receiverEmail}?subject=SendEase File Transfer&body=${encodeURIComponent(shareText)}`;
    onClose();
  };

  const handleClose = () => {
    setEmailError("");
    setReceiverEmail("");
    onClose();
  };

  return (    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      sx={glassDialog}
    >
      <DialogTitle>Send via Email</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Recipient's Email"
          type="email"
          fullWidth
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          variant="outlined"
          sx={textField}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSend}
          variant="contained"
          sx={gradientButton}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog;
