import { formatTime } from "../utils/formatDate";
import { isOwnMessage } from "../utils/messages";

export default function Message({ message, currentUserId, isGroup }) {
  const isMine = isOwnMessage(message, currentUserId);
  // Sender names are only shown on other people's messages in groups
  const showSenderName =
    isGroup && !isMine && !message.groupCreated && message.senderName;

  return (
    <div
      className="message"
      style={
        message.groupCreated
          ? groupCreatedMsgStyle
          : isMine
            ? sentMsgStyle
            : receivedMsgStyle
      }
    >
      {showSenderName && (
        <div style={{ color: "rgb(86 232 26)" }}>{message.senderName}</div>
      )}
      <span
        style={{ display: "flex", gap: message.groupCreated ? "" : "1rem" }}
      >
        <div className="text">{message.message}</div>
        <div
          className="time"
          style={{
            display: message.groupCreated ? "none" : "flex",
            alignItems: "end",
            fontSize: "0.7rem",
          }}
        >
          {formatTime(message.date)}
        </div>
      </span>
    </div>
  );
}

let sentMsgStyle = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "10px",
  padding: "0.3rem 0.5rem",
  textAlign: "right",
  marginLeft: "auto",
  backgroundColor: "limegreen",
};

let receivedMsgStyle = {
  display: "flex",
  flexDirection: "column",
  borderRadius: "10px",
  padding: "0.3rem 0.5rem",
  width: "fit-content",
  backgroundColor: "#31374f",
};

let groupCreatedMsgStyle = {
  display: "flex",
  padding: "0.5rem",
  borderRadius: "1rem",
  textAlign: "center",
  margin: "0 auto",
};
