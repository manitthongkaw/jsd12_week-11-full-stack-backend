import { Router } from "express";
import { users } from "../../fakeData/fakeUsers.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json(users);
});

router.post("/", (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email) return res.status(400).json({ error: "Username and email are required" });
  const nextId = String( (users.reduce((max, u) => Math.max(max, Number(u.id)), 0) || 0) + 1 );
  const newUser = { id:nextId, username, email, password };
  users.push(newUser);
  return res.status(201).json(newUser);
});

router.put("/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email andd password are required" });
  };
  user.username = username;
  user.email = email;
  user.password = password;
  return res.status(200).json(user);
});

// router.delete();