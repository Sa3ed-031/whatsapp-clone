import Grid from "@mui/material/Grid";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Avatar from "./Avatar";
import { isOwnMessage } from "../utils/messages";
import { formatChatListDate } from "../utils/formatDate";

export default function Chat({ userId, chat }) {
  const messages = chat.messages ?? [];
  const lastMsg = messages[messages.length - 1];
  const lastMsgIsMine = lastMsg ? isOwnMessage(lastMsg, userId) : false;
  const isGroup = Boolean(chat.membersIds);

  return (
    <>
      <Grid
        container
        spacing={1}
        className="chat-container"
        sx={{
          width: "92%",
          marginLeft: "auto",
          marginRight: "auto",
          alignItems: "center",
        }}
      >
        <Grid
          size={2}
          className="chat-profile"
          sx={{
            display: "flex",
            justifyContent: "center",
            minWidth: "65px",
          }}
        >
          <Avatar
            id={isGroup ? chat.id : chat.receiverId}
            name={chat.name}
            src={chat.profile}
            size="3.5rem"
          />
        </Grid>
        <Grid
          size={8}
          className="chat-body"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.1rem",
          }}
        >
          <div className="chat-name">{chat.name ?? "Unknown"}</div>
          <div
            className="chat-last-message"
            style={{
              margin: "0 0 0 1rem",
              display: "flex",
              gap: "0.4rem",
            }}
          >
            <DoneAllIcon
              color={chat.lastMsgSeen ? "primary" : "inherit"}
              style={{
                display: lastMsgIsMine ? "" : "none",
              }}
            />
            <span
              style={{
                color: "rgba(184, 181, 181, 0.69)",
              }}
            >
              {lastMsg?.message ?? ""}
            </span>
          </div>
        </Grid>
        <Grid
          size={2}
          className="chat-date"
          sx={{ textAlign: "center", fontSize: "0.8rem" }}
        >
          {formatChatListDate(lastMsg?.date ?? chat.date)}
        </Grid>
      </Grid>
    </>
  );
}
