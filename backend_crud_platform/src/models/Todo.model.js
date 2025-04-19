import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import { User } from "./User.model.js";

export const Todo = sequelize.define("Todo", {
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(Todo);
Todo.belongsTo(User);
