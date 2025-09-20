import { ContentCopy, Email, InsertLink, WhatsApp } from "@mui/icons-material";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { glassMenu } from "../styles/index.styles";
import { ShareOption } from "../models/common";

type MenuBarProps = {
    anchorEl: null | HTMLElement;
    onHandleClose: () => void;
    handleShare: (type: ShareOption) => void;
};

const MenuBar = ({anchorEl, onHandleClose, handleShare}: MenuBarProps) => {
  const open = Boolean(anchorEl);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onHandleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={glassMenu}
      >
        <MenuItem onClick={() => handleShare("copy-id")}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy ID to clipboard</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShare("copy-link")}>
          <ListItemIcon>
            <InsertLink fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy shareable link</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShare("email")}>
          <ListItemIcon>
            <Email fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send via email</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShare("whatsapp")}>
          <ListItemIcon>
            <WhatsApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share on WhatsApp</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default MenuBar;
