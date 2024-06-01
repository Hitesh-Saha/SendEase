import { Sync } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";

type RecieverPanelProps = {
  reciever: string | null;
  status?: string;
  isRecieveMode: boolean;
  connectReciever?: () => void;
};

const RecieverPanel = ({ reciever, status, isRecieveMode, connectReciever }: RecieverPanelProps) => {
  return (
    <>
      <Grid item xs={12} md={4} width="100%">
        <Grid container direction="column" spacing={3} width="100%">
          <Grid item>
            <Typography variant="h6" color="text.secondary">
              {`Active ${isRecieveMode ? 'Sender' : 'Recievers'}`}
            </Typography>
          </Grid>
          <Grid item width={"100%"}>
            {reciever ? (
              <List
                sx={{
                  bgcolor: "background.paper",
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>R</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={reciever}
                    secondary={status}
                  />
                  {!isRecieveMode && <ListItemSecondaryAction>
                    <Button
                      color="secondary"
                      onClick={connectReciever}
                      startIcon={<Sync />}
                    >
                      {status==='Disconnected' ? 'Connect' : 'Disconnect'}
                    </Button>
                  </ListItemSecondaryAction>}
                </ListItem>
              </List>
            ) : <List  sx={{
                bgcolor: "background.paper",
              }}>
                <ListItem>
                  <ListItemText
                    primary={`No Active ${isRecieveMode ? 'Sender' : 'Reciever'}`}
                  />
                </ListItem>
                </List>}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RecieverPanel;
