import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

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
    }

    const handleClose = () => {
        setEmailError("");
        setReceiverEmail("");
        onClose();
    }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          background: (theme) => `${theme.palette.background.paper}CC`,
          backdropFilter: "blur(8px)",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        },
      }}
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
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              background: (theme) => `${theme.palette.background.paper}80`,
              backdropFilter: "blur(8px)",
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSend}
          variant="contained"
          sx={{
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: (theme) =>
                `0 8px 16px ${theme.palette.primary.main}40`,
            },
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog;
