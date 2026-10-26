import { createContext, useContext, useState } from "react";
import MyToast from "../components/MyToast";

export let ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // severity: "success" | "info" | "warning" | "error"
  function showToast(message, severity = "success") {
    setToast({ open: true, message: message, severity: severity });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2000);
  }

  function showComingSoon() {
    showToast("Coming soon", "info");
  }

  return (
    <ToastContext.Provider value={{ showToast, showComingSoon }}>
      <MyToast toast={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
