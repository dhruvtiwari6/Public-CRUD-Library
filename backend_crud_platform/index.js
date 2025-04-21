import express from "express";
import session from "express-session";  // Change this to express-session
import passport from "passport";
import dotenv from "dotenv";
import "./src/passport/googleStrategy.js";
import "./src/db/connection.js";
import authRoutes from "./src/routes/authRoutes.js";
import crudRoutes from "./src/routes/crudRoutes.js";
import { sequelize } from "./src/db/connection.js";
import cors from 'cors';

dotenv.config({
  path: './env'
});

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,  // Ensure this points to your secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,  // 1 day
    }
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.use("/auth", authRoutes);
app.use("/api", crudRoutes);



sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });


    // app.listen(process.env.PORT || 5000, () => {
    //   console.log("Server running on port", process.env.PORT || 5000);
    // });


