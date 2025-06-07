import { Avatar, Box, Button, Typography } from "@mui/material";
import { PersonOff, Sync } from "@mui/icons-material";
import { RecieverData } from "../../models/common";
import { 
  statusIndicator, 
  panelContainer, 
  gradientAvatar, 
  gradientText,
  connectedButton 
} from "../../styles/index.styles";

interface RecieverPanelProps {
  reciever: RecieverData | null;
  status: string;
  isRecieveMode: boolean;
  connectReciever?: () => void;
}

const RecieverPanel = ({
  reciever,
  status,
  isRecieveMode,
  connectReciever,
}: RecieverPanelProps) => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 3
        }}
      >
        Active Connections
      </Typography>

      {reciever ? (
        <Box sx={panelContainer}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 2, sm: 3 },
              textAlign: 'center',
              width: '100%'
            }}
          >
            <Avatar
              src={reciever.avatar}
              sx={{
                ...gradientAvatar,
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 }
              }}
            />

            <Box sx={{ width: '100%' }}>
              <Typography
                variant="h5"
                sx={gradientText}
              >
                {reciever.username}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  my: { xs: 2, sm: 3 }
                }}
              >
                <Box sx={statusIndicator(status === "Connected")} />
                <Typography
                  variant="body1"
                  sx={{
                    color: (theme) => 
                      status === "Connected" 
                        ? theme.palette.success.main 
                        : theme.palette.text.secondary,
                    fontWeight: 500,
                    transition: "color 0.3s ease",
                  }}
                >
                  {status}
                </Typography>
              </Box>

              {!isRecieveMode && (
                <Button
                  variant="contained"
                  fullWidth
                  color={status === "Disconnected" ? "primary" : "secondary"}
                  onClick={connectReciever}
                  startIcon={<Sync />}
                  sx={connectedButton(status !== "Disconnected")}
                >
                  {status === "Disconnected" ? "Accept" : "Disconnect"}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            ...panelContainer,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            p: { xs: 3, sm: 4 }
          }}
        >
          <PersonOff sx={{ 
            color: "text.secondary",
            fontSize: { xs: 24, sm: 32 }
          }} />
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            No {isRecieveMode ? "sender" : "reciever"} connected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecieverPanel;
