// ICONS
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import KeyboardVoiceRoundedIcon from "@mui/icons-material/KeyboardVoiceRounded";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CollectionsIcon from "@mui/icons-material/Collections";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EnhancedEncryptionOutlinedIcon from "@mui/icons-material/EnhancedEncryptionOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SwitchAccountOutlinedIcon from "@mui/icons-material/SwitchAccountOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

// OTHERS
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { Box } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUsers } from "../contexts/UsersContext";
import { useToast } from "../contexts/ToastContext";
import { v4 as uuidv4 } from "uuid";
import Message from "./Message";
import Avatar from "./Avatar";
import { formatDate } from "../utils/formatDate";
import { dedupeMessages } from "../utils/messages";

export default function ChatHomePage() {
  const { users, setUsers } = useUsers();
  const { showToast, showComingSoon } = useToast();
  const { userId, chatId } = useParams();
  const user = users.find((u) => u.userId == userId) ?? { userChats: [] };
  const [chats, setChats] = useState([]);

  const chat = chats.find((c) => c.id == chatId) ?? {};
  const receiverId = chat.receiverId;
  const thisIsGroup = chat.membersIds ? true : false;
  const receiverUser = users.find((u) => u.userId == receiverId);

  const [message, setMessage] = useState("");
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [showMoreNav2, setShowMoreNav2] = useState(false);
  const [showChatInfoMore, setShowChatInfoMore] = useState(false);
  const [chatIsFavorite, setChatIsFavorite] = useState(chat.favorite);
  const [messages, setMessages] = useState(() => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const storageUser = storedUsers.find((u) => u.userId == userId);
      const storageChats = storageUser?.userChats ?? [];
      const storageChat = storageChats.find((c) => c.id == chatId);
      return storageChat?.messages ?? [];
    } catch (e) {
      console.warn("Failed to parse users from localStorage", e);
      return [];
    }
  });
  const [displayChatInfo, setDisplayChatInfo] = useState(false);

  useEffect(() => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const storageUser = storedUsers.find((u) => u.userId == userId);
      const storageChats = storageUser?.userChats ?? [];
      setChats(storageChats);
      const storageChat = storageChats.find((c) => c.id == chatId);
      setMessages(storageChat?.messages ?? []);
      setChatIsFavorite(Boolean(storageChat?.favorite));
    } catch (e) {
      console.warn("Failed to load chats from localStorage", e);
    }
  }, [userId, chatId]);

  if (!chat || Object.keys(chat).length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <Link to={`/user-homepage/${userId}`}>Back to chats</Link>
        <p>Chat not found.</p>
      </div>
    );
  }

  // Event Handlers
  function handleSendMsgClicked() {
    if (message != null && message.trim()) {
      const newMsg = {
        id: uuidv4(),
        message: message,
        send: true,
        senderId: userId,
        senderName: "",
        date: new Date().toISOString(),
      };

      const updatedChats = chats.map((c) =>
        c.id == chatId
          ? { ...c, messages: [...(c.messages ?? []), newMsg] }
          : c,
      );
      setChats(updatedChats);

      if (!thisIsGroup) {
        let updatedChatsForReceiver = receiverUser?.userChats?.map((c) =>
          c.receiverId == userId
            ? {
                ...c,
                messages: [
                  ...(c.messages ?? []),
                  {
                    ...newMsg,
                    send: false,
                  },
                ],
              }
            : c,
        );

        const updatedUsers = users.map((u) => {
          if (u.userId == userId) {
            return {
              ...u,
              userChats: updatedChats,
            };
          } else if (u.userId == receiverId) {
            return {
              ...u,
              userChats: updatedChatsForReceiver,
            };
          }
          return u;
        });
        setUsers(updatedUsers);

        try {
          localStorage.setItem("users", JSON.stringify(updatedUsers));
        } catch (e) {
          console.warn("Failed to save users to localStorage", e);
        }
      } else {
        const membersIDs = chat.membersIds;

        const updatedUsers = users.map((u) => {
          if (membersIDs.includes(u.userId)) {
            if (u.userId == userId) {
              return {
                ...u,
                userChats: updatedChats,
              };
            } else {
              const updatedChatsForMemberGroup = u.userChats.map((c) => {
                if (c.id == chatId) {
                  return {
                    ...c,
                    messages: [
                      ...(c.messages ?? []),
                      {
                        ...newMsg,
                        send: false,
                        senderName: user.userName,
                      },
                    ],
                  };
                }
                return c;
              });
              return {
                ...u,
                userChats: updatedChatsForMemberGroup,
              };
            }
          }
          return u;
        });

        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }
      const updatedChat = updatedChats.find((c) => c.id == chatId);
      setMessages(updatedChat?.messages ?? []);
      setMessage("");
    }
  }

  function handleClearChatClicked() {
    const updatedChats = chats.map((c) =>
      c.id == chatId ? { ...c, messages: [] } : c,
    );
    setChats(updatedChats);
    setMessages([]);

    const updatedUsers = users.map((u) =>
      u.userId == userId ? { ...u, userChats: updatedChats } : u,
    );
    setUsers(updatedUsers);

    try {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch (e) {
      console.warn("Failed to save cleared chat to localStorage", e);
    }
    showToast("Chat History Cleared Successfully.");
  }

  function handleAddToFavorite() {
    const updatedChats = chats.map((c) => {
      if (c.id == chatId) {
        return {
          ...c,
          favorite: !chatIsFavorite,
        };
      }
      return c;
    });
    setChats(updatedChats);

    const updatedUsers = users.map((u) => {
      if (u.userId == userId) {
        return {
          ...u,
          userChats: updatedChats,
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    showToast(
      `Chat ${!chatIsFavorite ? "added to" : "removed from"} Favorites Successfully.`,
    );
  }

  const visibleMessages = dedupeMessages(messages ?? [], userId);

  return (
    <>
      <div
        className="homepage-container chat"
        onClick={() => {
          showMoreNav
            ? setShowMoreNav(false)
            : showMoreNav2
              ? setShowMoreNav2(false)
              : null;
        }}
        style={{
          display: displayChatInfo ? "none" : "",
        }}
      >
        <header>
          <div className="left-side-and-link">
            <Link to={`/user-homepage/${userId}`} style={{ display: "flex" }}>
              <IconButton className="icon-btn" aria-label="Back to chats">
                <ArrowBackOutlinedIcon className="icon" />
              </IconButton>
            </Link>
            <div className="chat-details">
              <div className="chat-profile">
                <Avatar
                  id={thisIsGroup ? chat.id : receiverId}
                  name={chat.name}
                  src={chat.profile}
                  size="45px"
                />
              </div>
              <div
                className="chat-body"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setDisplayChatInfo(true);
                }}
              >
                <div className="chat-name">{chat.name ?? "Unknown"}</div>
                <div className="chat-last-seen">
                  {thisIsGroup
                    ? `${chat.membersIds.length} members`
                    : "tap here for contact info"}
                </div>
              </div>
            </div>
          </div>

          <nav>
            <IconButton
              className="icon-btn"
              aria-label="Video call"
              onClick={showComingSoon}
            >
              <VideocamOutlinedIcon className="icon" />
            </IconButton>
            <IconButton
              className="icon-btn"
              aria-label="Voice call"
              onClick={showComingSoon}
            >
              <CallOutlinedIcon className="icon" />
            </IconButton>
            <IconButton
              className="icon-btn"
              aria-label="More options"
              onClick={() => setShowMoreNav(true)}
            >
              <MoreVertOutlinedIcon className="icon" />
            </IconButton>

            <ul
              className="nav"
              style={{
                display: showMoreNav ? "flex" : "none",
              }}
            >
              <li onClick={() => setDisplayChatInfo(true)}>
                {thisIsGroup ? "Group info" : "View contact"}
              </li>
              <li onClick={showComingSoon}>Search</li>
              <li onClick={showComingSoon}>Media, links, and docs</li>
              <li onClick={showComingSoon}>Mute notifications</li>
              <li onClick={showComingSoon}>Disappearing messages</li>
              <li onClick={showComingSoon}>Chat theme</li>
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreNav2(true);
                  setShowMoreNav(false);
                }}
              >
                More <ArrowRightRoundedIcon />
              </li>
            </ul>

            <ul
              className="nav two"
              style={{
                display: showMoreNav2 ? "flex" : "none",
              }}
            >
              <li onClick={showComingSoon}>Report</li>
              <li onClick={showComingSoon}>Block</li>
              <li onClick={handleClearChatClicked}>Clear chat</li>
              <li onClick={showComingSoon}>Export chat</li>
              <li onClick={showComingSoon}>Add shortcut</li>
              <li onClick={showComingSoon}>Add to list</li>
            </ul>
          </nav>
        </header>

        <main
          className="content"
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "3.5rem",
            gap: "0.3rem",
          }}
        >
          {messages === null ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            visibleMessages.map((m) => (
              <Message
                key={m.id}
                message={m}
                currentUserId={userId}
                isGroup={thisIsGroup}
              />
            ))
          )}
        </main>

        <footer>
          <div className="search-input">
            <InputBase
              className="input-base"
              sx={{ ml: 1, flex: 1, color: "grey" }}
              placeholder="Message..."
              inputProps={{ "aria-label": "Message" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMsgClicked();
              }}
            ></InputBase>
            <IconButton
              className="camera-icon"
              type="button"
              aria-label={message === "" ? "Camera" : "Attach file"}
              onClick={showComingSoon}
            >
              {message === "" ? (
                <CameraAltOutlinedIcon />
              ) : (
                <AttachFileRoundedIcon />
              )}
            </IconButton>
            <IconButton
              style={{
                display: message === "" ? "" : "none",
              }}
              className="attach-icon"
              type="button"
              aria-label="Attach file"
              onClick={showComingSoon}
            >
              <AttachFileRoundedIcon />
            </IconButton>
            <IconButton
              className="sticker-icon"
              type="button"
              aria-label="Emoji"
              onClick={showComingSoon}
            >
              <SentimentSatisfiedAltOutlinedIcon />
            </IconButton>
          </div>

          <IconButton
            className={`${message === "" ? "voice-btn" : "send-btn"}`}
            aria-label={message === "" ? "Voice message" : "Send message"}
            onClick={() => {
              message !== "" ? handleSendMsgClicked() : showComingSoon();
            }}
          >
            {message === "" ? (
              <KeyboardVoiceRoundedIcon className="voice-icon" />
            ) : (
              <SendIcon className="send-icon" />
            )}
          </IconButton>
        </footer>
      </div>

      <div
        className="homepage-container chat chat-info"
        onClick={() => {
          showChatInfoMore ? setShowChatInfoMore(false) : null;
        }}
        style={{
          display: displayChatInfo ? "flex" : "none",
        }}
      >
        <div className="header">
          <IconButton
            className="icon-btn go-back"
            aria-label="Back to chat"
            onClick={() => {
              setDisplayChatInfo(false);
            }}
          >
            <ArrowBackOutlinedIcon className="icon" />
          </IconButton>

          <div className="chat-details">
            <div className="chat-profile">
              <Avatar
                id={thisIsGroup ? chat.id : receiverId}
                name={chat.name}
                src={chat.profile}
                size="10rem"
              />
            </div>
            <span>{chat.name ?? "Unknown"}</span>
            <span>
              {thisIsGroup
                ? `Group . ${chat.membersIds.length} members`
                : (chat.phone ?? "")}
            </span>
          </div>

          <nav>
            <IconButton
              className="icon-btn"
              aria-label="More options"
              onClick={() => setShowChatInfoMore(true)}
            >
              <MoreVertOutlinedIcon className="icon" />
            </IconButton>

            <ul
              className="nav"
              style={{
                display: showChatInfoMore ? "flex" : "none",
              }}
            >
              <li onClick={showComingSoon}>Share</li>
              <li onClick={showComingSoon}>Edit</li>
              <li onClick={showComingSoon}>View in address book</li>
              <li onClick={showComingSoon}>Verify security code</li>
            </ul>
          </nav>
        </div>

        <div className="icons">
          <IconButton className="icon-btn" onClick={showComingSoon}>
            <CallOutlinedIcon className="icon" />
            Audio
          </IconButton>
          <IconButton className="icon-btn" onClick={showComingSoon}>
            <VideocamOutlinedIcon className="icon" />
            Video
          </IconButton>
          {thisIsGroup ? (
            <IconButton className="icon-btn" onClick={showComingSoon}>
              <PersonAddAltOutlinedIcon className="icon" />
              Add
            </IconButton>
          ) : (
            <></>
          )}
          <IconButton className="icon-btn" onClick={showComingSoon}>
            <SearchIcon className="icon" />
            Search
          </IconButton>
        </div>

        {thisIsGroup ? (
          <div className="group-description">
            <button
              style={{
                border: "none",
                display: "flex",
                fontWeight: "bold",
                color: "rgba(0, 255, 0, 0.7)",
                backgroundColor: "#111a3f",
              }}
              onClick={showComingSoon}
            >
              Add group description
            </button>
            <p>
              {`Created by ${chat.createdBy}`}
              {formatDate(chat.date) && `, ${formatDate(chat.date)}`}
            </p>
          </div>
        ) : (
          <div className="status">
            <span>{receiverUser?.userStatus ?? ""}</span>
          </div>
        )}

        <div className="media-links-docs" onClick={showComingSoon}>
          <span>Media, links, and docs</span>
          <IconButton
            className="icon-btn"
            aria-label="Open media, links, and docs"
          >
            <ChevronRightIcon className="icon" />
          </IconButton>
        </div>

        <div className="notification-media-visibility">
          <div onClick={showComingSoon}>
            <NotificationsNoneIcon className="icon" />
            <span>
              Notification
              <p style={{ display: thisIsGroup ? "" : "none" }}>All</p>
            </span>
          </div>
          <div onClick={showComingSoon}>
            <CollectionsIcon className="icon" />
            <span>Media visibility</span>
          </div>
        </div>

        <div className="encryption-and3">
          <div className="choice-cont" onClick={showComingSoon}>
            <LockOutlinedIcon className="icon" />
            <div>
              <span>Encryption</span>
              <p>Messages and calls are end-to-end encrypted. Tap to verify.</p>
            </div>
          </div>
          <div className="choice-cont" onClick={showComingSoon}>
            <VideocamOutlinedIcon className="icon" />
            <div>
              <span>Disappearing messages</span>
              <p>off</p>
            </div>
          </div>
          <div className="choice-cont lock-toggle">
            <div>
              <EnhancedEncryptionOutlinedIcon className="icon" />
              <div>
                <span>Chat lock</span>
                <p>Lock and hide this chat on this device.</p>
              </div>
            </div>
            <FormControlLabel
              control={
                <Switch slotProps={{ input: { "aria-label": "Chat lock" } }} />
              }
              style={{ margin: "0" }}
            />
          </div>
          <div className="choice-cont" onClick={showComingSoon}>
            <SecurityOutlinedIcon className="icon" />
            <div>
              <span>Advanced chat privacy</span>
              <p>off</p>
            </div>
          </div>
        </div>

        {thisIsGroup ? (
          <div className="group-members">
            <div className="members-and-search">
              <p>{`${chat.membersIds.length} members`}</p>
              <IconButton
                className="icon-btn"
                aria-label="Search members"
                onClick={showComingSoon}
              >
                <SearchIcon className="icon" />
              </IconButton>
            </div>
            <div className="add-members" onClick={showComingSoon}>
              <IconButton className="icon-btn" aria-label="Add members">
                <PersonAddAlt1Icon className="icon" />
              </IconButton>
              <span>Add members</span>
            </div>
            {users.map((u) => {
              if (!chat.membersIds.includes(u.userId)) return null;
              if (u.userName == chat.createdBy)
                return (
                  <div key={u.userId} className="group-member admin-member">
                    <div className="admin-content">
                      <div className="member-profile">
                        <Avatar
                          id={u.userId}
                          name={u.userName}
                          src={u.userProfile}
                          size="3.5rem"
                        />
                      </div>
                      <div>
                        <h3>{u.userId == userId ? "You" : chat.createdBy}</h3>
                        <p>{u.userStatus}</p>
                      </div>
                    </div>
                    <div className="admin">
                      <span>Group Admin</span>
                    </div>
                  </div>
                );
              return (
                <div key={u.userId} className="group-member">
                  <div className="member-profile">
                    <Avatar
                      id={u.userId}
                      name={u.userName}
                      src={u.userProfile}
                      size="3.5rem"
                    />
                  </div>
                  <div>
                    <h3>{u.userId == userId ? "You" : u.userName}</h3>
                    <p>{u.userStatus}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="common-groups">
              <p>No groups in common</p>
              <div className="create-group-with" onClick={showComingSoon}>
                <IconButton className="icon-btn" aria-label="Create group">
                  <PeopleAltOutlinedIcon className="icon" />
                </IconButton>
                <span>Create group with {chat.name}</span>
              </div>
            </div>

            <div className="phone">
              <div className="number">
                <p>Other phones</p>
                <div className="spans">
                  <span>{chat.phone ?? ""}</span>
                  <p>Mobile</p>
                </div>
              </div>
              <div className="buttons">
                <IconButton
                  className="icon-btn"
                  aria-label="Message"
                  onClick={() => setDisplayChatInfo(false)}
                >
                  <ChatOutlinedIcon className="icon" />
                </IconButton>
                <IconButton
                  className="icon-btn"
                  aria-label="Voice call"
                  onClick={showComingSoon}
                >
                  <CallOutlinedIcon className="icon" />
                </IconButton>
                <IconButton
                  className="icon-btn"
                  aria-label="Video call"
                  onClick={showComingSoon}
                >
                  <VideocamOutlinedIcon className="icon" />
                </IconButton>
              </div>
            </div>
          </>
        )}

        <div className="add-to">
          <div
            className="icon-btn"
            onClick={() => {
              setChatIsFavorite((prev) => !prev);
              handleAddToFavorite();
            }}
          >
            {chatIsFavorite ? (
              <FavoriteOutlinedIcon className="icon added-to-favorite" />
            ) : (
              <FavoriteBorderIcon className="icon" />
            )}
            <span>{chatIsFavorite ? "Remove from " : "Add to "}Favorites</span>
          </div>
          <div className="icon-btn" onClick={showComingSoon}>
            <SwitchAccountOutlinedIcon className="icon" />
            <span>Add to list</span>
          </div>

          {thisIsGroup ? (
            <div className="icon-btn danger" onClick={showComingSoon}>
              <LogoutOutlinedIcon className="icon" />
              <span>Exit group</span>
            </div>
          ) : (
            <div className="icon-btn danger" onClick={showComingSoon}>
              <BlockOutlinedIcon className="icon" />
              <span>Block {chat.name}</span>
            </div>
          )}

          <div className="icon-btn danger" onClick={showComingSoon}>
            <ThumbDownAltOutlinedIcon className="icon" />
            <span>Report {thisIsGroup ? "group" : chat.name}</span>
          </div>
        </div>
      </div>
    </>
  );
}
