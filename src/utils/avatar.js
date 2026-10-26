const AVATAR_COLORS = [
  "#00a884",
  "#53bdeb",
  "#ff7a59",
  "#a78bfa",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export function getAvatarColor(id = "") {
  let hash = 0;
  for (const char of String(id)) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// Uploaded photos are saved as data URLs. Older data pointed every user at
// the same bundled image path, which we treat as "no custom photo".
export function hasCustomPhoto(src) {
  return (
    typeof src === "string" &&
    (src.startsWith("data:") ||
      src.startsWith("blob:") ||
      src.startsWith("http"))
  );
}
