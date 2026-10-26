// Icons
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CloseIcon from "@mui/icons-material/Close";

// Components
import { Button, IconButton, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import Disclaimer from "./Disclaimer";

export default function WelcomePage() {
  const { showComingSoon } = useToast();
  const [showAddNewAccount, setShowAddNewAccount] = useState(false);

  const [values, setValues] = useState({
    country: "Syria",
    prefix: "+963",
    number: "",
  });

  return (
    <>
      <div
        className="homepage-container new-account"
        style={{ display: showAddNewAccount ? "none" : "" }}
      >
        <header>
          <Link to="/">
            <IconButton className="icon-btn" aria-label="Back">
              <ArrowBackOutlinedIcon className="icon" />
            </IconButton>
          </Link>

          <IconButton
            className="icon-btn"
            aria-label="More options"
            onClick={showComingSoon}
          >
            <MoreVertOutlinedIcon className="icon" />
          </IconButton>
        </header>
        <main>
          <div className="animating-preview">
            <ForumRoundedIcon
              sx={{
                color: "limegreen",
                fontSize: "5rem",
              }}
            />
          </div>
          <div className="add-account">
            <h1>Add an account</h1>
            <p>
              Read our Privacy Policy. Tap "Agree and continue" to accept the
              Terms of Service.
            </p>
          </div>
        </main>
        <footer>
          <Button
            className="btn"
            variant="outlined"
            onClick={() => setShowAddNewAccount(true)}
          >
            Agree and continue
          </Button>
          <Disclaimer />
        </footer>
      </div>

      <div
        className="addnewaccount-container"
        style={{
          display: showAddNewAccount ? "" : "none",
        }}
      >
        <header>
          <IconButton
            className="icon-btn"
            aria-label="Close"
            onClick={() => setShowAddNewAccount(false)}
          >
            <CloseIcon className="icon" />
          </IconButton>
          <IconButton
            className="icon-btn"
            aria-label="More options"
            onClick={showComingSoon}
          >
            <MoreVertOutlinedIcon className="icon" />
          </IconButton>
        </header>
        <main>
          <h2>Enter your phone number</h2>
          <p>ChatApp will need to verify your phone number.</p>
          <p>Carrier charges may apply.</p>
          <div className="input">
            <TextField
              className="text-field"
              variant="standard"
              style={{ textAlign: "center" }}
              slotProps={{ htmlInput: { "aria-label": "Country" } }}
              value={values.country}
              onChange={(e) =>
                setValues({ ...values, country: e.target.value })
              }
            />
            <div className="number">
              <TextField
                className="text-field"
                variant="standard"
                style={{ width: "45px" }}
                slotProps={{ htmlInput: { "aria-label": "Country code" } }}
                value={values.prefix}
                onChange={(e) =>
                  setValues({ ...values, prefix: e.target.value })
                }
              />
              <TextField
                className="text-field"
                variant="standard"
                placeholder="Phone Number"
                slotProps={{ htmlInput: { "aria-label": "Phone number" } }}
                value={values.number}
                onChange={(e) =>
                  setValues({ ...values, number: e.target.value })
                }
              />
            </div>
          </div>
        </main>
        <footer>
          <Link
            to={
              values.number.length < 5
                ? "/homepage-addnumber"
                : `/signin-login-page/${values.number}`
            }
          >
            <Button
              className="btn"
              variant="outlined"
              disabled={values.number.length < 5}
              style={{
                color: values.number.length < 5 ? "grey" : "",
                backgroundColor:
                  values.number.length < 5 ? "#364456" : "limegreen",
              }}
            >
              Next
            </Button>
          </Link>
          <Disclaimer />
        </footer>
      </div>
    </>
  );
}
