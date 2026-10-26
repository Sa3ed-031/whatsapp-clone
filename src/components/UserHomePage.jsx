/* eslint-disable react-hooks/exhaustive-deps */
// COMPONENTS
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Avatar from "./Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useParams } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";

// ICONS
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddchartOutlinedIcon from "@mui/icons-material/AddchartOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Face6OutlinedIcon from "@mui/icons-material/Face6Outlined";
import SwitchAccountOutlinedIcon from "@mui/icons-material/SwitchAccountOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DataSaverOffOutlinedIcon from "@mui/icons-material/DataSaverOffOutlined";
import AccessibilityNewOutlinedIcon from "@mui/icons-material/AccessibilityNewOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import SystemSecurityUpdateGoodOutlinedIcon from "@mui/icons-material/SystemSecurityUpdateGoodOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DialpadIcon from "@mui/icons-material/Dialpad";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import DoneIcon from "@mui/icons-material/Done";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

// Others
import { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUsers } from "../contexts/UsersContext";
import { useToast } from "../contexts/ToastContext";
import { hashPassword } from "../utils/hashPassword";
import { DEFAULT_STATUS } from "../data/initialUsers";
import Chat from "./Chat";

const settingsItems = [
  {
    Icon: VpnKeyOutlinedIcon,
    title: "Account",
    text: "Security notifications, change number",
  },
  {
    Icon: LockOutlinedIcon,
    title: "Privacy",
    text: "Block contacts, disappearing messages",
  },
  {
    Icon: Face6OutlinedIcon,
    title: "Avatar",
    text: "Create, edit, profile photo",
  },
  {
    Icon: SwitchAccountOutlinedIcon,
    title: "Lists",
    text: "Manage people and groups",
  },
  {
    Icon: ChatOutlinedIcon,
    title: "Chats",
    text: "Theme, wallpapers, chat history",
  },
  {
    Icon: NotificationsOutlinedIcon,
    title: "Notifications",
    text: "Message, group & call tones",
  },
  {
    Icon: DataSaverOffOutlinedIcon,
    title: "Storage and data",
    text: "Network usage, auto-download",
  },
  {
    Icon: AccessibilityNewOutlinedIcon,
    title: "Accessibility",
    text: "Increase contrast, animation",
  },
  {
    Icon: LanguageOutlinedIcon,
    title: "App language",
    text: "English (device's language)",
  },
  {
    Icon: HelpOutlineOutlinedIcon,
    title: "Help",
    text: "Help center, contact us, privacy policy",
  },
  { Icon: GroupOutlinedIcon, title: "Invite a friend" },
  { Icon: SystemSecurityUpdateGoodOutlinedIcon, title: "App updates" },
];

const footerTabs = [
  { value: "chats", label: "Chats", Icon: ChatOutlinedIcon },
  { value: "updates", label: "Updates", Icon: UpdateOutlinedIcon },
  { value: "communities", label: "Communities", Icon: PeopleOutlinedIcon },
  { value: "calls", label: "Calls", Icon: CallOutlinedIcon },
];

export default function UserHomePage() {
  const { userId } = useParams();
  const { users, setUsers } = useUsers();
  const { showToast, showComingSoon } = useToast();
  const user = users.find((u) => u.userId == userId);
  let receiverId = "",
    receiverProfile = "";

  const [chats, setChats] = useState([]);

  const receiverUsersIds = [];
  chats.map((c) => {
    receiverUsersIds.push(c.receiverId);
  });

  const [showSettingsNav, setShowSettingsNav] = useState(false);
  const [toggleChoice, setToggleChoice] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [showAddChatDialog, setShowAddChatDialog] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    status: "",
    profile: "",
  });
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showEditUserInfo, setShowEditUserInfo] = useState(null);
  const [showAddNewGroup, setShowAddNewGroup] = useState(false);
  const [showAddNewGroupInfo, setShowAddNewGroupInfo] = useState(false);
  const [newChatInfo, setNewChatInfo] = useState({
    name: "",
    phoneNumber: "",
  });
  const [selectedChats, setSelectedChats] = useState({});
  const [newGroupInfo, setNewGroupInfo] = useState({
    profile: "",
    name: "",
  });
  const [newGroupProfile, setNewGroupProfile] = useState(null);

  useEffect(() => {
    const storageUsers = JSON.parse(localStorage.getItem("users")) ?? users;
    const storageUser = storageUsers.find((u) => u.userId == userId);
    if (!storageUser) return;
    setUserInfo({
      ...userInfo,
      name: storageUser.userName,
      phone: storageUser.userNumber,
      status: storageUser.userStatus ?? DEFAULT_STATUS,
      profile: storageUser.userProfile,
    });
    setSelectedImg(storageUser.userProfile);
    setChats(storageUser.userChats ?? []);
  }, []);

  const unreadChats = useMemo(() => {
    return chats?.filter((c) => !c.lastMsgSeen);
  }, [chats]);
  const groups = useMemo(() => {
    return chats?.filter((c) => c.membersIds);
  }, [chats]);
  const favorites = useMemo(() => {
    return chats?.filter((c) => c.favorite);
  }, [chats]);

  if (!user) {
    return (
      <div
        style={{
          padding: "3rem",
          color: "white",
          backgroundColor: "#111a3f",
        }}
      >
        <Link to="/homepage-addnumber">Back to main page</Link>
        <p>User not found.</p>
      </div>
    );
  }

  let chatsToBeRendered = chats;
  if (toggleChoice === "unread") {
    chatsToBeRendered = unreadChats;
  } else if (toggleChoice === "favorites") {
    chatsToBeRendered = favorites;
  } else if (toggleChoice === "groups") {
    chatsToBeRendered = groups;
  }
  if (searchText.trim()) {
    const query = searchText.trim().toLowerCase();
    chatsToBeRendered = chatsToBeRendered?.filter((c) =>
      c.name?.toLowerCase().includes(query),
    );
  }

  let chatsList = [];
  if (chatsToBeRendered) {
    chatsList = chatsToBeRendered.map((chat) => (
      <Link
        key={chat.id}
        to={`/user-homepage/${userId}/chat-homepage/${chat.id}`}
        style={{ color: "white" }}
        onClick={() => {
          const storedUsers = JSON.parse(localStorage.getItem("users"));
          const user = storedUsers.find((u) => u.userId == userId);
          const updatedChats = user.userChats.map((c) => {
            if (c.id == chat.id) {
              return {
                ...c,
                lastMsgSeen: true,
              };
            }
            return c;
          });

          const updatedUsers = storedUsers.map((u) => {
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
        }}
      >
        <Chat userId={userId} chat={chat} />
      </Link>
    ));
  }

  // Handlers
  function handleAddChatClick() {
    setShowAddChatDialog(true);
  }

  function handleAddChatClose() {
    setShowAddChatDialog(false);
    setNewChatInfo({ name: "", phoneNumber: "" });
  }

  async function handleAddChatConfirm() {
    if (newChatInfo.name.length >= 3) {
      let addNewUser = false;

      users.map((u) => {
        if (
          u.userNumber === newChatInfo.phoneNumber &&
          u.userName === newChatInfo.name
        ) {
          receiverId = u.userId;
          receiverProfile = u.userProfile;
        }
      });

      const receiverNewChat = {
        id: uuidv4(),
        receiverId: userId,
        profile: userInfo.profile,
        name: userInfo.name,
        phone: userInfo.phone,
        favorite: false,
        lastMsgSeen: false,
        date: new Date().toISOString(),
        messages: [],
      };

      let updatedUsers = [...users];
      if (receiverId == "") {
        addNewUser = true;
        receiverId = uuidv4();
        const newUser = {
          userId: receiverId,
          userName: newChatInfo.name,
          userNumber: newChatInfo.phoneNumber,
          passwordHash: await hashPassword(`${newChatInfo.name}123`),
          userStatus: DEFAULT_STATUS,
          userProfile: "",
          userChats: [receiverNewChat],
        };
        updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
      }

      const newChat = {
        id: uuidv4(),
        receiverId: receiverId,
        profile: receiverProfile,
        name: newChatInfo.name,
        phone: newChatInfo.phoneNumber,
        favorite: false,
        lastMsgSeen: false,
        date: new Date().toISOString(),
        messages: [],
      };
      const updatedChats = [newChat, ...chats];
      setChats(updatedChats);

      if (!addNewUser) {
        const updatedUsers = addChatBetweenExistedUsers(
          newChat,
          receiverNewChat,
          receiverId,
        );

        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      } else {
        const updatedUsersWithNew = updatedUsers.map((u) => {
          if (u.userId == userId) {
            return {
              ...u,
              userChats: updatedChats,
            };
          }
          return u;
        });
        setUsers(updatedUsersWithNew);
        localStorage.setItem("users", JSON.stringify(updatedUsersWithNew));
      }

      setShowAddChatDialog(false);
      setNewChatInfo({ name: "", phoneNumber: "" });
      showToast("New Chat Successfully Added.");
    }
  }

  function addChatBetweenExistedUsers(
    newChatSender,
    newChatReceiver,
    receiverId,
  ) {
    let receiverUser = {};
    users.map((u) => {
      if (u.userId == receiverId) receiverUser = u;
    });
    const newChatsSender = [newChatSender, ...chats];
    const newChatsReceiver = [newChatReceiver, ...receiverUser.userChats];

    const newUsersSenderReceiver = users.map((u) => {
      if (u.userId == userId) {
        return {
          ...u,
          userChats: newChatsSender,
        };
      } else if (u.userId == receiverId) {
        return {
          ...u,
          userChats: newChatsReceiver,
        };
      }
      return u;
    });
    return newUsersSenderReceiver;
  }

  function handleCheckBoxChange(index) {
    setSelectedChats((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  }

  function handleAddGroupConfirm() {
    if (newGroupInfo.name) {
      setShowAddNewGroup(false);
      setShowAddNewGroupInfo(false);

      let membersIds = [userId];
      chats.map((c, index) => {
        if (selectedChats[index]) membersIds.push(c.receiverId);
      });

      const newChatGroup = {
        id: uuidv4(),
        favorite: false,
        lastMsgSeen: false,
        membersIds: membersIds,
        name: newGroupInfo.name,
        profile: newGroupProfile,
        createdBy: userInfo.name,
        messages: [
          {
            id: uuidv4(),
            message: `${userInfo.name} created the group and added you.`,
            send: false,
            groupCreated: true,
            date: "no-date",
          },
        ],
        date: new Date().toISOString(),
      };

      const updatedChats = [{ ...newChatGroup, messages: [] }, ...chats];
      setChats(updatedChats);

      const updatedUsers = users.map((u) => {
        if (membersIds.includes(u.userId)) {
          if (u.userId == userId) {
            return { ...u, userChats: updatedChats };
          } else {
            return {
              ...u,
              userChats: [newChatGroup, ...u.userChats],
            };
          }
        }
        return u;
      });

      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setSelectedChats({});
      setNewGroupInfo({ ...newGroupInfo, name: "", profile: "" });
      setNewGroupProfile(null);
      showToast("New Group Successfully Added.");
    }
  }

  let selectedChatsNum = 0;
  chats.map((c, index) => {
    if (selectedChats[index]) if (!c.membersIds) selectedChatsNum++;
  });

  function handleProfileUpdate(event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUsers = users.map((u) => {
          if (u.userId == userId) {
            return {
              ...u,
              userProfile: reader.result,
            };
          } else if (receiverUsersIds.includes(u.userId)) {
            const updatedChatsForReceivers = u.userChats?.map((c) => {
              if (c.receiverId == userId) {
                return {
                  ...c,
                  profile: reader.result,
                };
              }
              return c;
            });
            return {
              ...u,
              userChats: updatedChatsForReceivers,
            };
          }
          return u;
        });
        setUsers(updatedUsers);
        setUserInfo({ ...userInfo, profile: reader.result });
        setSelectedImg(reader.result);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      };
      reader.readAsDataURL(file);
      showToast("Your Profile Successfully Updated.");
    }
  }

  function handleGroupProfileUpdate(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGroupProfile(reader.result);
        setNewGroupInfo({ ...newGroupInfo, profile: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleEditInfoEdit(field) {
    setShowEditUserInfo(field);
  }

  function handleEditUserInfoSave() {
    const updatedUsers = users.map((u) => {
      if (u.userId == userId) {
        return {
          ...u,
          userName: userInfo.name,
          userNumber: userInfo.phone,
          userStatus: userInfo.status,
        };
      } else if (receiverUsersIds.includes(u.userId)) {
        const updatedChatsReceiver = u.userChats?.map((c) => {
          if (c.receiverId == userId) {
            return {
              ...c,
              name: userInfo.name,
              phone: userInfo.phone,
            };
          }
          return c;
        });
        return {
          ...u,
          userChats: updatedChatsReceiver,
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setShowEditUserInfo(null);
    setShowSettingsPage(false);
    setShowProfilePage(false);
    showToast("Your Info Successfully Updated.");
  }

  return (
    <>
      <Dialog
        open={showAddChatDialog}
        onClose={handleAddChatClose}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Adding new chat: "}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            type="text"
            label="Phone Number"
            margin="dense"
            variant="standard"
            value={newChatInfo.phoneNumber}
            onChange={(e) => {
              setNewChatInfo({ ...newChatInfo, phoneNumber: e.target.value });
            }}
          />
          <TextField
            fullWidth
            type="text"
            label="Name"
            margin="dense"
            variant="standard"
            value={newChatInfo.name}
            onChange={(e) => {
              setNewChatInfo({ ...newChatInfo, name: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddChatClose}>Close</Button>
          <Button onClick={handleAddChatConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <div
        className="homepage-container"
        onClick={() => {
          showSettingsNav ? setShowSettingsNav(false) : null;
        }}
        style={{
          display: showSettingsPage
            ? "none"
            : showAddNewGroup
              ? "none"
              : showProfilePage
                ? "none"
                : showEditUserInfo != null
                  ? "none"
                  : "",
        }}
      >
        <header>
          <div className="logo">ChatApp</div>
          <nav>
            <IconButton
              className="icon-btn"
              aria-label="Camera"
              onClick={showComingSoon}
            >
              <CameraAltOutlinedIcon className="icon" />
            </IconButton>
            <IconButton
              className="icon-btn"
              aria-label="Menu"
              onClick={() => setShowSettingsNav(true)}
            >
              <MoreVertOutlinedIcon className="icon" />
            </IconButton>
            <ul
              className="nav"
              style={{
                display: showSettingsNav ? "flex" : "none",
              }}
            >
              <li
                onClick={() => {
                  setShowAddNewGroup(true);
                }}
              >
                New group
              </li>
              <li onClick={showComingSoon}>New broadcast</li>
              <li onClick={showComingSoon}>Linked devices</li>
              <li onClick={showComingSoon}>Starred</li>
              <li
                onClick={() => {
                  setShowSettingsPage(true);
                }}
              >
                Settings
              </li>
            </ul>
          </nav>
        </header>

        <main className="content">
          <div className="search-input">
            <IconButton
              className="search icon-btn"
              aria-label="Search"
              tabIndex={-1}
            >
              <SearchIcon className="icon" />
            </IconButton>
            <InputBase
              className="input-base"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              inputProps={{ "aria-label": "Search chats" }}
            ></InputBase>
          </div>

          <ToggleButtonGroup
            className="toggle-btn-group"
            value={toggleChoice}
            onChange={(e) => {
              setToggleChoice(e.target.value);
            }}
          >
            {["all", "unread", "favorites", "groups"].map((choice) => (
              <ToggleButton
                key={choice}
                className="toggle-btn-choice"
                value={choice}
                style={{
                  backgroundColor: `${toggleChoice === choice ? "rgba(0, 255, 0, 0.7)" : ""}`,
                  color: toggleChoice === choice ? "#313f47" : "",
                  position: "static",
                }}
              >
                {choice}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <div className="conversations">{chatsList}</div>

          <div
            className="plus-icon"
            style={{ display: "flex" }}
            onClick={handleAddChatClick}
          >
            <IconButton className="icon-btn" aria-label="New chat">
              <AddchartOutlinedIcon className="icon" />
            </IconButton>
          </div>
        </main>

        <footer>
          <div className="settings-bar">
            {footerTabs.map((tab) => (
              <div
                key={tab.value}
                className="choice-container"
                onClick={tab.value === "chats" ? undefined : showComingSoon}
              >
                <ToggleButton
                  className="settings-toggle-btn-choice"
                  value={tab.value}
                  aria-label={tab.label}
                  style={{
                    backgroundColor: `${tab.value === "chats" ? "rgba(0, 255, 0, 0.7)" : ""}`,
                  }}
                >
                  <span className="footer-icon-btn">
                    <tab.Icon className="icon" />
                  </span>
                </ToggleButton>
                {tab.label}
              </div>
            ))}
          </div>
        </footer>
      </div>

      <div
        className="settings-page homepage-container"
        style={{ display: showSettingsPage ? "" : "none" }}
      >
        <header>
          <div className="go-back-and-icon">
            <IconButton
              className="icon-btn"
              aria-label="Back"
              onClick={() => setShowSettingsPage(false)}
            >
              <ArrowBackOutlinedIcon className="icon" />
            </IconButton>
            <h3>Settings</h3>
          </div>
          <IconButton
            className="icon-btn"
            aria-label="Search settings"
            onClick={showComingSoon}
          >
            <SearchIcon className="icon" />
          </IconButton>
        </header>
        <div
          className="info"
          onClick={() => {
            setShowSettingsPage(false);
            setShowProfilePage(true);
          }}
        >
          <div className="left">
            <div className="profile">
              <Avatar
                id={userId}
                name={userInfo.name}
                src={userInfo.profile}
                size="4rem"
              />
            </div>
            <div className="name-bio">
              <h3>{userInfo.name ?? ""}</h3>
              <p>{userInfo.status}</p>
            </div>
          </div>
          <div className="right">
            <IconButton className="icon-btn" aria-label="QR code">
              <QrCodeIcon className="icon" />
            </IconButton>
            <IconButton className="icon-btn" aria-label="Open profile">
              <ControlPointOutlinedIcon className="icon" />
            </IconButton>
          </div>
        </div>
        <div className="aside">
          <div className="settings">
            {settingsItems.map((item) => (
              <div
                key={item.title}
                className="setting"
                onClick={showComingSoon}
              >
                <IconButton
                  className="icon-btn"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <item.Icon className="icon" />
                </IconButton>
                {item.text ? (
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ) : (
                  <h3>{item.title}</h3>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="settings-page homepage-container profile-page"
        style={{
          display: showProfilePage
            ? showEditUserInfo != null
              ? "none"
              : ""
            : "none",
        }}
      >
        <header>
          <div className="go-back-and-icon">
            <IconButton
              className="icon-btn"
              aria-label="Back"
              onClick={() => {
                setShowProfilePage(false);
                setShowSettingsPage(true);
              }}
            >
              <ArrowBackOutlinedIcon className="icon" />
            </IconButton>
            <h3>Profile</h3>
          </div>
        </header>

        <div className="user-info">
          <div className="profile">
            <Avatar
              id={userId}
              name={userInfo.name}
              src={selectedImg}
              size="10rem"
            />

            <label>
              Edit
              <input
                id="user-profile-img"
                type="file"
                accept="image/*"
                aria-label="Upload profile photo"
                onChange={(e) => {
                  handleProfileUpdate(e);
                }}
              />
            </label>
          </div>

          <div className="bio">
            <div
              className="cont"
              onClick={() => {
                handleEditInfoEdit("name");
              }}
            >
              <PermIdentityIcon className="icon" />
              <div>
                <h3>Name</h3>
                <p>{userInfo.name ?? ""}</p>
              </div>
            </div>
            <div
              className="cont"
              onClick={() => {
                handleEditInfoEdit("about");
              }}
            >
              <InfoIcon className="icon" />
              <div>
                <h3>About</h3>
                <p>{userInfo.status ?? ""}</p>
              </div>
            </div>
            <div
              className="cont"
              onClick={() => {
                handleEditInfoEdit("phone");
              }}
            >
              <CallOutlinedIcon className="icon" />
              <div>
                <h3>Phone</h3>
                <p>{userInfo.phone ?? ""}</p>
              </div>
            </div>
            <div className="cont" onClick={showComingSoon}>
              <LinkIcon className="icon" />
              <div>
                <h3>Links</h3>
                <p style={{ color: "rgba(0, 255, 0, 0.7)" }}>Add links</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="settings-page homepage-container edit-user-info"
        style={{ display: showEditUserInfo != null ? "" : "none" }}
      >
        <header>
          <div className="go-back-and-icon">
            <IconButton
              className="icon-btn"
              aria-label="Back"
              onClick={() => {
                setShowEditUserInfo(null);
              }}
            >
              <ArrowBackOutlinedIcon className="icon" />
            </IconButton>
            <h3>
              {showEditUserInfo == "name"
                ? "Name"
                : showEditUserInfo == "about"
                  ? "About"
                  : showEditUserInfo == "phone"
                    ? "Phone"
                    : ""}
            </h3>
          </div>
        </header>
        <div className="user-info">
          <TextField
            className="edit-user-info-input"
            label={`Your ${
              showEditUserInfo == "name"
                ? "Name"
                : showEditUserInfo == "about"
                  ? "Status"
                  : "Phone"
            }`}
            value={
              showEditUserInfo == "name"
                ? userInfo.name
                : showEditUserInfo == "about"
                  ? userInfo.status
                  : showEditUserInfo == "phone"
                    ? userInfo.phone
                    : ""
            }
            onChange={(e) => {
              showEditUserInfo == "name"
                ? setUserInfo({ ...userInfo, name: e.target.value })
                : showEditUserInfo == "about"
                  ? setUserInfo({ ...userInfo, status: e.target.value })
                  : setUserInfo({ ...userInfo, phone: e.target.value });
            }}
          />
          <IconButton
            className="icon-btn"
            aria-label="Emoji"
            onClick={showComingSoon}
            style={{ display: showEditUserInfo == "phone" ? "none" : "" }}
          >
            <InsertEmoticonIcon className="icon" />
          </IconButton>
          <p>
            People will see this{" "}
            {showEditUserInfo == "about" ? "status" : showEditUserInfo} if you
            interact with them and they don't have you saved as a contact.
          </p>
        </div>
        <footer>
          <button
            onClick={() => {
              handleEditUserInfoSave();
            }}
          >
            Save
          </button>
        </footer>
      </div>

      <div
        className="add-group-page homepage-container"
        style={{
          display: showAddNewGroup
            ? showAddNewGroupInfo
              ? "none"
              : ""
            : "none",
        }}
      >
        <header>
          <div className="go-back-and-icon">
            <IconButton
              className="icon-btn"
              aria-label="Back"
              onClick={() => setShowAddNewGroup(false)}
            >
              <ArrowBackOutlinedIcon className="icon" />
            </IconButton>
            <h3
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              Add group members
              <p>
                {selectedChatsNum} of{" "}
                {chats.filter((c) => !c.membersIds).length} selected
              </p>
            </h3>
          </div>
          <div className="search-input">
            <IconButton
              className="search icon-btn"
              aria-label="Search"
              tabIndex={-1}
            >
              <SearchIcon className="icon" />
            </IconButton>
            <InputBase
              className="input-base"
              placeholder="Search name or number..."
              inputProps={{ "aria-label": "Search name or number" }}
            />
            <IconButton
              className="apps icon-btn"
              aria-label="Dial pad"
              onClick={showComingSoon}
            >
              <DialpadIcon className="icon" />
            </IconButton>
          </div>
        </header>
        <div className="aside">
          <div className="chats">
            {chats.map((c, index) => {
              if (!c.membersIds) {
                return (
                  <div key={c.id} className="chat">
                    <Checkbox
                      id={`chat-input#${index}`}
                      className="input-chat"
                      checked={!!selectedChats[index]}
                      onChange={() => {
                        handleCheckBoxChange(index);
                      }}
                    />
                    <label
                      htmlFor={`chat-input#${index}`}
                      className="input-body"
                    >
                      <Avatar
                        id={c.receiverId}
                        name={c.name}
                        src={c.profile}
                        size="4.4rem"
                      />
                      <div>
                        <h3>{c.name}</h3>
                        <p>{c.phone}</p>
                      </div>
                    </label>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        <footer>
          <div
            className="plus-icon"
            style={{
              display: "flex",
              cursor: "pointer",
            }}
          >
            <IconButton
              className="icon-btn"
              aria-label="Next"
              onClick={() => {
                setShowAddNewGroupInfo(true);
              }}
            >
              <ArrowForwardIcon className="icon" />
            </IconButton>
          </div>
        </footer>
      </div>

      <div
        className="add-group-page confirm homepage-container"
        style={{
          display: showAddNewGroupInfo ? "" : "none",
        }}
      >
        <header>
          <div className="go-back-and-icon">
            <IconButton
              className="icon-btn"
              aria-label="Back"
              onClick={() => setShowAddNewGroupInfo(false)}
            >
              <ArrowBackOutlinedIcon className="icon" />
            </IconButton>
            <h3>New group</h3>
          </div>
        </header>

        <div className="aside">
          <div className="group-info">
            <IconButton
              className="icon-btn group-profile"
              aria-label="Add group photo"
            >
              <AddAPhotoOutlinedIcon className="icon" />
              {newGroupProfile && (
                <img src={newGroupProfile} alt="Group photo" />
              )}
              <label>
                <input
                  id="group-profile-input"
                  type="file"
                  accept="image/*"
                  aria-label="Upload group photo"
                  onChange={(e) => {
                    handleGroupProfileUpdate(e);
                  }}
                />
              </label>
            </IconButton>
            <TextField
              focused
              color="success"
              label="Group name"
              className="group-name"
              value={newGroupInfo.name}
              onChange={(e) => {
                setNewGroupInfo({ ...newChatInfo, name: e.target.value });
              }}
            />
            <IconButton
              className="icon-btn"
              aria-label="Emoji"
              onClick={showComingSoon}
            >
              <InsertEmoticonOutlinedIcon className="icon" />
            </IconButton>
          </div>
          <div className="group-settings">
            <div className="group-setting" onClick={showComingSoon}>
              <h4>
                Disappearing messages
                <span> off</span>
              </h4>
              <IconButton
                className="icon-btn"
                aria-label="Disappearing messages"
              >
                <HistoryToggleOffOutlinedIcon className="icon" />
              </IconButton>
            </div>
            <div className="group-setting" onClick={showComingSoon}>
              <h4>Group permissions</h4>
              <IconButton className="icon-btn" aria-label="Group permissions">
                <SettingsOutlinedIcon className="icon" />
              </IconButton>
            </div>
          </div>
          <div className="group-members">
            <span>Members: {selectedChatsNum}</span>
            {chats.map((c, index) => {
              if (selectedChats[index] === true) {
                return (
                  <div key={c.id} className="member">
                    <Avatar
                      id={c.receiverId}
                      name={c.name}
                      src={c.profile}
                      size="5rem"
                    />
                    <span>{c.name}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <footer>
          <div className="plus-icon">
            <IconButton
              className="icon-btn"
              aria-label="Create group"
              onClick={() => {
                handleAddGroupConfirm();
              }}
            >
              <DoneIcon className="icon" />
            </IconButton>
          </div>
        </footer>
      </div>
    </>
  );
}
