import express from "express";
import { Todo } from "../models/Todo.model.js";
import { User } from "../models/User.model.js";
import { validateApiKey } from "../middleware/auth.middleware.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// CREATE
router.post("/crud/create", validateApiKey, async (req, res) => {


  if (req.user.requestCount >= 4) {
    return res.status(403).json({
      success: false,
      error: "Request limit exceeded. Please recharge credits."
    });
  }
  const { value } = req.body;
  if (!value) return res.status(400).json({ error: "Missing value" });



  const txHash = uuidv4().slice(0, 6);
  const todo = await Todo.create({
    value,
    txHash,
    googleId: req.user.googleId,  
  });

  req.user.requestCount += 1;
  await req.user.save();

  res.json({ id: todo.id, status: "created successfully", txHash });
});

// READ (Get all Todos for a user)
router.get("/crud/get", validateApiKey, async (req, res) => {
  if (req.user.requestCount >= 4) {
    return res.status(403).json({
      success: false,
      error: "Request limit exceeded. Please recharge credits."
    });
  }


  const todos = await Todo.findAll({
    where: { googleId: req.user.googleId }, 
  });

  await req.user.save();

  res.json({todos: todos, credits : req.user.requestCount});
});

// UPDATE (Update a Todo by txHash)
router.put("/crud/update", validateApiKey, async (req, res) => {


  if (req.user.requestCount >= 4) {
    return res.status(403).json({
      success: false,
      error: "Request limit exceeded. Please recharge credits."
    });
  }


  const { txHash, value } = req.body;

  console.log("got update request");
  console.log("req.body", req.body);

  // Find the Todo by txHash and googleId
  const todo = await Todo.findOne({
    where: { txHash, googleId: req.user.googleId },
  });

  if (!todo) return res.status(404).json({ error: "Todo not found" });

  if (value) todo.value = value;  // Update the value if provided
  await todo.save();

  req.user.requestCount += 1;
  await req.user.save();

  res.json({ status: "updated successfully" });
});

// DELETE (Delete a Todo by txHash)
router.delete("/crud/delete", validateApiKey, async (req, res) => {


  if (req.user.requestCount >= 4) {
    return res.status(403).json({
      success: false,
      error: "Request limit exceeded. Please recharge credits."
    });
  }


  console.log("got deleete request");
  const { txHash } = req.body;

  // Find the Todo by txHash and googleId
  const todo = await Todo.findOne({
    where: { txHash, googleId: req.user.googleId },
  });

  if (!todo) return res.status(404).json({ error: "Todo not found" });

  await todo.destroy();

  req.user.requestCount += 1;
  await req.user.save();

  res.json({ status: "deleted successfully" });
});

// SIMULATE CREDIT RECHARGE
router.post("/crud/recharge", validateApiKey, async (req, res) => {

  console.log("got recharge request");

  const user = await User.findOne({ where: { googleId: req.user.googleId } });

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
