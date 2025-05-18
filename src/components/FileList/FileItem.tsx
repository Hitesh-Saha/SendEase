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
  IconButton,
  Typography,
  useTheme,
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
  const theme = useTheme();

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'image/jpeg':
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        background: `linear-gradient(145deg, ${theme.palette.background.paper}80, ${theme.palette.background.default}40)`,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.palette.divider}20`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
        }
      }}
    >
      <Avatar
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          boxShadow: `0 2px 10px ${theme.palette.primary.main}40`,
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        }}
      >
        {getFileTypeIcon(fileType)}
      </Avatar>
      <Box sx={{ flex: 1, ml: 1 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: theme.palette.text.primary,
            mb: 0.5
          }}
        >
          {fileName}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            display: 'block'
          }}
        >
          {getFileSize(fileSize)}
        </Typography>
      </Box>
      {!isRecieveMode && (
        <IconButton
          onClick={deleteFile}
          sx={{
            color: theme.palette.error.main,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: `${theme.palette.error.main}15`,
              transform: 'scale(1.1)',
            }
          }}
        >
          <Delete />
        </IconButton>
      )}
    </Box>
  );
};

export default FileItem;
