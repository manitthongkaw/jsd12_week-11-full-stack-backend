import bcrypt from "bcrypt";
import { User } from "./user.model.js";

const userResponse = (doc) => {
  const user = doc.toObject();
  delete user.password;
  return user;
};

export const getUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    return res.status(200).json({ success:true, data:user });
  }
  catch (err) {
    // return res.status(400).json({ success:false, error:err });
    next(err);
  }
};
export const createUsers = async (req, res, next) => {
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
    // return res.status(400).json({ success:false, error:err });
    next(err);
  }
};
export const updateUsers = async (req, res, next) => {
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
    // return res.status(400).json({ success: false, error: err });
    // err.status = 400; ==> for send to error handing on server.js file
    next(err);
  }
}
export const deleteUsers = async (req, res, next) => {
  try {
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    // return res.status(400).json({ success: false, error: err });
    next(err);
  }
}

// Use bcrypt.hash
export const registerUsers = async (req, res, next) => {
  const { username, email, password, role } = req.body || {};
  if (!username || !email || !password) {
    const err = new Error("username, email and password are required");
    err.name = "ValidationError";
    err.status = 400;
    return res.status(400).json({ success:false, error:err });
  }
  try {
    const user = await User.findOne({email});
    if(user) return res.status(400).json({ success:false, error:"อีเมลนี้ถูกใช้งานแล้ว" });
    //const hashedPassword = await bcrypt.hash(password, 12);
    //const doc = await User.create({ username, email, password:hashedPassword, role});
    // Change bcrypt.hash to working in mongoose schema
    const newUser = new User({ username, email, password, role });
    const doc = await newUser.save();
    //const doc = await User.create({ username, email, password, role});
    return res.status(201).json({ success:true, data:"สมัครสมาชิกสำเร็จ!" });
    //return res.status(201).json({ success:true, data:userResponse(doc) });
  }
  catch (err) {
    //return res.status(400).json({ success:false, error:"อีเมลนี้ถูกใช้งานแล้ว" });
    // return res.status(400).json({ success:false, error:err });
    next(err);
  }
};
// Use bcrypt.compare
export const loginUsers = async (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    const err = new Error("email and password are required");
    err.name = "ValidationError";
    err.status = 400;
    return res.status(400).json({ success:false, error:err });
  }
  try {
    const user = await User.findOne({email}).select("+password");
    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch) {
      return res.status(201).json({ success:true, message:"เข้าสู่ระบบสำเร็จ!" });
    } else {
      return res.status(400).json({ success:false, error:"อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }
  }
  catch (err) {
    return res.status(400).json({ success:false, error:"อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    next(err);
  }
};