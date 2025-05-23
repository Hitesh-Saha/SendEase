import {
  Delete,
  Folder,
  Image,
  InsertDriveFile,
  PictureAsPdf,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { getFileSize } from "../../utils/utils";

type FileItemProps = {
  fileName: string;
  fileSize: number;
  fileType: string;
  isRecieveMode: boolean;
  deleteFile?: () => void;
};

const FileItem = ({
  fileName,
  fileSize,
  fileType,
  isRecieveMode,
  deleteFile,
}: FileItemProps) => {

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'image/jpeg':
        return <Image />
      case 'image/png':
        return <Image />
      case 'application/pdf':
        return <PictureAsPdf />
      case 'application/x-zip-compressed':
        return <Folder />
      default:
        return <InsertDriveFile />
    }
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "0.8rem",
          alignItems: "center",
        }}
      >
        <List
          sx={{
            bgcolor: "background.paper",
            width: "100%",
          }}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {getFileTypeIcon(fileType)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={fileName}
              secondary={getFileSize(fileSize)}
            />
          </ListItem>
        </List>
        {!isRecieveMode && <Delete
          color="secondary"
          fontSize="large"
          sx={{ cursor: "pointer" }}
          onClick={deleteFile}
        />}
      </Box>
    </>
  );
};

export default FileItem;
