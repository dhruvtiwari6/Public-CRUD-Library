import express from "express";
import session from "cookie-session";
import passport from "passport";
import dotenv from "dotenv";
import "./passport/googleStrategy.js";
import "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import crudRoutes from "./routes/crudRoutes.js";
import { User } from "./models/User.model.js";
import { Todo } from "./models/Todo.model.js";
import { sequelize } from "./db/connection.js";

dotenv.config({
    path: './env'
});

const app = express();
app.use(express.json());

app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/", crudRoutes);

// ✅ Sync the models before starting server
sequelize
  .sync({ alter: true }) // use { force: true } only during development
  .then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
