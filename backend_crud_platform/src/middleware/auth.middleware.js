import { User } from "../models/User.model.js";

export const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return res.status(401).json({ error: "API Key missing" });

  const user = await User.findOne({ where: { apiKey } });
  if (!user) return res.status(403).json({ error: "Invalid API Key" });

  if (user.requestCount >= 4)
    return res.status(403).json({ error: "Request limit exceeded. Please recharge credits." });

  req.user = user;
  next();
};
