import { Router } from "express";
import { notes } from "../../fakeData/fakeNotes.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json(notes);
});

router.post("/", (req, res) => {
  const { name, msg } = req.body || {};
  if (!name || !msg) return res.status(400).json({ error: "Name and msg are required" });
  const nextId = String( (notes.reduce((max, n) => Math.max(max, Number(n.id)), 0) || 0) + 1 );
  const newNote = { id:nextId, name, msg };
  notes.push(newNote);
  return res.status(201).json(newNote);
});
router.put("/:id", (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  const { name, msg } = req.body;
  if (!name || !msg) return res.status(400).json({ error: "Name and msg are required" });
  note.name = name;
  note.msg = msg;
  return res.status(200).json(note);
});

router.delete("/:id", (req, res) => {
  const index = notes.findIndex((n) => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Note not found" });
  notes.splice(index, 1);
  return res.status(200).json(notes);
});