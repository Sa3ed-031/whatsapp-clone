import WelcomePage from "./components/WelcomePage";
import SignInLoginPage from "./components/SignInLoginPage";
import UserHomePage from "./components/UserHomePage";
import ChatHomePage from "./components/ChatHomePage";

import { Routes, Route } from "react-router-dom";
import { UsersProvider } from "./contexts/UsersContext";
import { ToastProvider } from "./contexts/ToastContext";
import "./App.css";

function App() {
  return (
    <>
      <ToastProvider>
        <UsersProvider>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/homepage-addnumber" element={<WelcomePage />} />
            <Route
              path="/signin-login-page/:userNumber"
              element={<SignInLoginPage />}
            />
            <Route path="/user-homepage/:userId" element={<UserHomePage />} />
            <Route
              path="/user-homepage/:userId/chat-homepage/:chatId"
              element={<ChatHomePage />}
            />
          </Routes>
        </UsersProvider>
      </ToastProvider>
    </>
  );
}

export default App;
