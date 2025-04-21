import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import { Todo } from "./Todo.model.js";  // Make sure Todo model is imported

export const User = sequelize.define("User", {
  googleId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  apiKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  requestCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rechargeUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// User has many Todos
User.hasMany(Todo, { foreignKey: "googleId", sourceKey: "googleId" });
Todo.belongsTo(User, { foreignKey: "googleId", targetKey: "googleId" });
