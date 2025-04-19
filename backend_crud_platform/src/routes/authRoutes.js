import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    res.json({
      message: "Logged in",
      apiKey: user.apiKey,
      apiUrl: `${process.env.BASE_API_URL}/crud`,
      creditsRemaining: 4 - user.requestCount,
    });
  }
);

export default router;
