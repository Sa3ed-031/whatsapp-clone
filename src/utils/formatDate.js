// Dates are stored as ISO strings (new Date().toISOString()).
// Older saved data used a "YYYY/M/D" string built with getDay() (the weekday),
// so those values can't be trusted and are rendered as empty.
function toDate(value) {
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    return isNaN(date) ? null : date;
  }
  return null;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// "8:35 PM"
export function formatTime(value) {
  const date = toDate(value);
  return date
    ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "";
}

// "10/05/2025"
export function formatDate(value) {
  const date = toDate(value);
  return date
    ? date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "";
}

// Chat list: "8:35 PM" today, "Yesterday", otherwise "10/05/2025"
export function formatChatListDate(value) {
  const date = toDate(value);
  if (!date) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return formatTime(date.getTime());
  if (isSameDay(date, yesterday)) return "Yesterday";
  return formatDate(date.getTime());
}
