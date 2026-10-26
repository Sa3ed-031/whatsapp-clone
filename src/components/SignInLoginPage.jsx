import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";

import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useUsers } from "../contexts/UsersContext";
import { useToast } from "../contexts/ToastContext";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/hashPassword";
import { DEFAULT_STATUS } from "../data/initialUsers";
import Disclaimer from "./Disclaimer";

export default function SignInLoginPage() {
  const { userNumber } = useParams();
  const { users, setUsers } = useUsers();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // true = Register mode, false = Log in mode
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const btnIsDisabled = showConfirmPassword
    ? formValues.username.trim() === "" ||
      formValues.password === "" ||
      confirmPassword === ""
    : formValues.username.trim() === "" || formValues.password === "";

  const passwordsDontMatched = showConfirmPassword
    ? formValues.password !== confirmPassword
    : false;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleMouseUpPassword = (event) => event.preventDefault();

  async function handleSignRegisterSubmit(event) {
    event.preventDefault();
    if (btnIsDisabled) return;

    const username = formValues.username.trim();
    const isSameName = (u) =>
      u.userName?.toLowerCase() === username.toLowerCase();
    const passwordHash = await hashPassword(formValues.password);

    if (showConfirmPassword) {
      if (passwordsDontMatched) {
        showToast("Password and confirmation don't match.", "error");
        return;
      }
      if (users.some(isSameName)) {
        showToast("That username is already taken.", "error");
        return;
      }
      const newUser = {
        userId: uuidv4(),
        userNumber: userNumber,
        userName: username,
        passwordHash: passwordHash,
        userStatus: DEFAULT_STATUS,
        userProfile: "",
        userChats: [],
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      navigate(`/user-homepage/${newUser.userId}`);
    } else {
      const loginUser = users.find(
        (u) => isSameName(u) && u.passwordHash === passwordHash,
      );
      if (loginUser) {
        navigate(`/user-homepage/${loginUser.userId}`);
      } else {
        showToast("Incorrect username or password.", "error");
      }
    }
  }

  const passwordAdornment = (
    <InputAdornment position="end">
      <IconButton
        aria-label={showPassword ? "Hide the password" : "Show the password"}
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        onMouseUp={handleMouseUpPassword}
        edge="end"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <>
      <Card
        className="card"
        sx={{
          width: "90%",
          maxWidth: "420px",
          marginLeft: "auto",
          marginRight: "auto",
          bgcolor: "#111a3f",
          color: "white",
          overflow: "hidden",
          borderRadius: "13px",
          border: "1px solid #31374f",
        }}
      >
        <div className="card-hero">
          <ForumRoundedIcon sx={{ color: "limegreen", fontSize: "4.5rem" }} />
        </div>

        <Typography
          gutterBottom
          variant="h6"
          component="h1"
          sx={{ padding: "0.5rem", margin: 0, textAlign: "center" }}
        >
          {showConfirmPassword ? "Create an account" : "Welcome back"}
        </Typography>

        <CardActions className="card-actions">
          <Button
            size="medium"
            onClick={() => {
              setShowConfirmPassword(false);
            }}
            style={{
              color: showConfirmPassword ? "rgb(188, 183, 183)" : "limegreen",
            }}
          >
            Log in
          </Button>
          <Button
            size="medium"
            onClick={() => {
              setShowConfirmPassword(true);
            }}
            style={{
              color: showConfirmPassword ? "limegreen" : "rgb(188, 183, 183)",
            }}
          >
            Register
          </Button>
        </CardActions>

        <form className="inputs" onSubmit={handleSignRegisterSubmit}>
          <FormControl className="text-input" variant="outlined">
            <InputLabel htmlFor="text-input">Username</InputLabel>
            <OutlinedInput
              id="text-input"
              type="text"
              label="Username"
              autoComplete="username"
              value={formValues.username}
              onChange={(e) => {
                setFormValues({ ...formValues, username: e.target.value });
              }}
            />
          </FormControl>

          <FormControl className="password-input" variant="outlined">
            <InputLabel htmlFor="password-input">Password</InputLabel>
            <OutlinedInput
              id="password-input"
              type={showPassword ? "text" : "password"}
              autoComplete={
                showConfirmPassword ? "new-password" : "current-password"
              }
              endAdornment={passwordAdornment}
              label="Password"
              value={formValues.password}
              onChange={(e) => {
                setFormValues({ ...formValues, password: e.target.value });
              }}
            />
          </FormControl>

          <FormControl
            style={{
              display: showConfirmPassword ? "flex" : "none",
            }}
            className="confirm-password-input"
            variant="outlined"
          >
            <InputLabel htmlFor="confirm-password-input">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="confirm-password-input"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              endAdornment={passwordAdornment}
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </FormControl>

          <Button
            type="submit"
            disabled={btnIsDisabled}
            className={`submit-button ${btnIsDisabled ? "disabled" : ""}`}
            variant="contained"
          >
            {showConfirmPassword ? "Register" : "Log in"}
          </Button>
        </form>

        <Disclaimer />
      </Card>
    </>
  );
}
