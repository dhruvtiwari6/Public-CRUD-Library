import { User } from "../models/User.model.js";

export const validateApiKey = async (req, res, next) => {
  console.log("Headers received:", req.headers);
  let apiKey = req.headers["Authorization"] || req.headers["authorization"];

  if(!apiKey) {
    console.log("API Key not found in headers");
    return res.status(401).json({ error: `API Key is required`}); 
  }

  apiKey = apiKey.split(" ")[1]


  const user = await User.findOne({ where: { apiKey } });
  console.log("User found::::", user);
  if (!user) return res.status(403).json({ error: "Invalid API Key" });

  
  // if (req.user.requestCount >= 4) {
  //   return res.status(403).json({
  //     success: false,
  //     error: "Request limit exceeded. Please recharge credits."
  //   });
  // }

  console.log("passed api key validation");
  req.user = user;
  next();
};
