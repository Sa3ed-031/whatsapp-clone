import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function MyToast({ toast }) {
  return (
    <div>
      <Snackbar open={toast.open} autoHideDuration={6000}>
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
