import { v4 as uuidv4 } from "uuid";

export const DEFAULT_STATUS = "Hey there! I'm using ChatApp.";

// Demo accounts seeded on first visit. Passwords are stored as SHA-256 hashes
// in utils/hashPassword.js: ahmad123, lina123, omar123, sara123.
export const initialUsers = [
  {
    userId: uuidv4(),
    userName: "Ahmad",
    userNumber: "0933000001",
    passwordHash:
      "306098fa01257f8e4809cbdfca258d8c22c7fb12937cc2616ef06aa20fd8008e",
    userStatus: DEFAULT_STATUS,
    userProfile: "",
    userChats: [],
  },
  {
    userId: uuidv4(),
    userName: "Lina",
    userNumber: "0933000002",
    passwordHash:
      "ec66a94298e85eda53c99fb9c8fca473ee8a6ed2a5a4c90d8d44906f86695c07",
    userStatus: DEFAULT_STATUS,
    userProfile: "",
    userChats: [],
  },
  {
    userId: uuidv4(),
    userName: "Omar",
    userNumber: "0933000003",
    passwordHash:
      "56318228b3a39a2af341c080cc2d8b1d7e088ed24bd28d6cc9b34a8711253434",
    userStatus: DEFAULT_STATUS,
    userProfile: "",
    userChats: [],
  },
  {
    userId: uuidv4(),
    userName: "Sara",
    userNumber: "0933000004",
    passwordHash:
      "926b4b8a00cfab44b758450fa6bf188d4bf8541c2fd6b3d9b93d152d43a99f64",
    userStatus: DEFAULT_STATUS,
    userProfile: "",
    userChats: [],
  },
];
