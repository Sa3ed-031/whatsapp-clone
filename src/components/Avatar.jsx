import { getAvatarColor, hasCustomPhoto } from "../utils/avatar";

// Shows the custom photo if there is one, otherwise the first letter of the
// name on a colored circle (color derived from the ID so it stays stable).
export default function Avatar({ id, name, src, size = "3rem", className }) {
  const label = name || "User";
  const style = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: "50%",
    flexShrink: 0,
  };

  if (hasCustomPhoto(src)) {
    return (
      <img
        className={className}
        src={src}
        alt={`${label}'s profile photo`}
        style={{ ...style, objectFit: "cover" }}
      />
    );
  }

  return (
    <div
      className={className}
      role="img"
      aria-label={`${label}'s avatar`}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: `calc(${size} * 0.45)`,
        textTransform: "uppercase",
        userSelect: "none",
        backgroundColor: getAvatarColor(id),
      }}
    >
      {label.trim().charAt(0) || "?"}
    </div>
  );
}
