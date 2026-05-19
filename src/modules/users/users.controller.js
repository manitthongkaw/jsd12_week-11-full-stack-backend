import { User } from "./user.model.js";

const userResponse = (doc) => {
  const user = doc.toObject();
  delete user.password;
  return user;
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json({ success:true, data:user });
  }
  catch (err) {
    return res.status(400).json({ success:false, error:err });
  }
};

export const createUsers = async (req, res) => {
  const { username, email, password, role } = req.body || {};
  if (!username || !email || !password) {
    const err = new Error("username, email and password are required");
    err.name = "ValidationError";
    err.status = 400;
    return res.status(400).json({ success:false, error:err });
  }
  try {
    const doc = await User.create({ username, email, password, role});
    return res.status(201).json({ success:true, data:userResponse(doc) });
  }
  catch (err) {
    return res.status(400).json({ success:false, error:err });
  }
};
/*
export const updateUsers = async (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "Username, email and password are required" });
  user.username = username;
  user.email = email;
  user.password = password;
  return res.status(200).json(user);
};
*/
export const updateUsers = async (req, res) => {
  const { username, email, password, role } = req.body || {};
  const updates = {};
  if (username !== undefined) updates.username = username;
  if (email !== undefined) updates.email = email;
  if (password !== undefined) updates.password = password;
  if (role !== undefined) updates.role = role;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      error: "At least one field is required to update",
    });
  }
  try {
    const doc = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.status(400).json({ success: false, error: err });
  }
}
/*
export const deleteUsers = async (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "User not found" });
  users.splice(index, 1);
  return res.status(200).json(users);
};
*/
export const deleteUsers = async (req, res) => {
  try {
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.status(400).json({ success: false, error: err });
  }
}