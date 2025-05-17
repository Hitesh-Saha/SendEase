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
import { RecieverPanelProps } from "../../models/common";

const RecieverPanel = ({
  reciever,
  status,
  isRecieveMode,
  connectReciever,
}: RecieverPanelProps) => {
  return (
    <>
      <Grid item xs={12} md={true}>
        <Grid container direction="column" spacing={3} width="100%">
          <Grid item>
            <Typography variant="h6" color="text.secondary">
              Active {isRecieveMode ? "Sender" : "Recievers"}
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
                    <Avatar src={reciever.avatar}/>
                  </ListItemAvatar>
                  <ListItemText primary={reciever.username} secondary={status} />
                  {!isRecieveMode && (
                    <ListItemSecondaryAction>
                      <Button
                        color="secondary"
                        onClick={connectReciever}
                        startIcon={<Sync />}
                      >
                        {status === "Disconnected" ? "Accept" : "Disconnect"}
                      </Button>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              </List>
            ) : (
              <Typography variant="body2" color="text.primary">
                No Active {isRecieveMode ? "Sender" : "Reciever"}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RecieverPanel;
