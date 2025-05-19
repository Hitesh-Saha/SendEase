import { PersonOff, Sync } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { RecieverPanelProps } from "../../models/common";

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
        {/* {isRecieveMode ? "Sender" : "Reciever"} */}
        Active Connections
      </Typography>

      {reciever ? (
        <Box
          sx={{
            background: (theme) => `${theme.palette.background.paper}40`,
            backdropFilter: "blur(12px)",
            borderRadius: 2,
            p: 3,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: (theme) => `linear-gradient(90deg, transparent, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40, transparent)`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Avatar
              src={reciever.avatar}
              sx={{
                width: 80,
                height: 80,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                border: (theme) => `3px solid ${theme.palette.background.paper}`,
                boxShadow: (theme) => `0 0 20px ${theme.palette.primary.main}30`,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
              }}
            >
              {reciever.username}
            </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: (theme) => 
                      status === "Connected" 
                        ? theme.palette.success.main 
                        : theme.palette.text.disabled,
                    boxShadow: (theme) => 
                      status === "Connected" 
                        ? `0 0 12px ${theme.palette.success.main}`
                        : "none",
                    transition: "all 0.3s ease",
                  }}
                />
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
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.2,
                background: (theme) => status === "Disconnected" 
                  ? `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  : `linear-gradient(120deg, ${theme.palette.secondary.main}, ${theme.palette.error.main})`,
                boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}30`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}40`,
                },
                transition: 'all 0.3s ease'
              }}
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
            width: "100%",
            p: { xs: 2, sm: 3 },
            background: (theme) => `${theme.palette.background.paper}40`,
            backdropFilter: "blur(4px)",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <PersonOff sx={{ color: "text.secondary" }} />
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
