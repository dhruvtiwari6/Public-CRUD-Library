import express from "express";
import { Todo } from "../models/Todo.model.js";
import { validateApiKey } from "../middleware/auth.middleware.js";

const router = express.Router();

// CREATE
router.post("/crud/create", validateApiKey, async (req, res) => {
  const { value, txHash } = req.body;
  if (!value) return res.status(400).json({ error: "Missing value" });

  const todo = await Todo.create({
    value,
    txHash,
    UserId: req.user.id,
  });

  req.user.requestCount += 1;
  await req.user.save();

  res.json({ id: todo.id, status: "created successfully" });
});

// READ
router.get("/crud/get/:id", validateApiKey, async (req, res) => {
  const todo = await Todo.findOne({
    where: { id: req.params.id, UserId: req.user.id },
  });

  if (!todo) return res.status(404).json({ error: "Not found" });

  req.user.requestCount += 1;
  await req.user.save();

  res.json(todo);
});

// UPDATE
router.put("/crud/update/:id", validateApiKey, async (req, res) => {
  const { value, txHash } = req.body;

  const todo = await Todo.findOne({
    where: { id: req.params.id, UserId: req.user.id },
  });

  if (!todo) return res.status(404).json({ error: "Not found" });

  if (value) todo.value = value;
  if (txHash) todo.txHash = txHash;
  await todo.save();

  req.user.requestCount += 1;
  await req.user.save();

  res.json({ status: "updated successfully" });
});

// DELETE
router.delete("/crud/delete/:id", validateApiKey, async (req, res) => {
  const todo = await Todo.findOne({
    where: { id: req.params.id, UserId: req.user.id },
  });

  if (!todo) return res.status(404).json({ error: "Not found" });

  await todo.destroy();

  req.user.requestCount += 1;
  await req.user.save();

  res.json({ status: "deleted successfully" });
});

// SIMULATE CREDIT RECHARGE
router.post("/crud/recharge", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.rechargeUsed) {
    return res.json({ message: "Credits exhausted. Cannot recharge again." });
  }

  user.requestCount = 0;
  user.rechargeUsed = true;
  await user.save();

  res.json({ message: "Credits recharged. You now have 4 more requests." });
});

export default router;
