import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";

export const Todo = sequelize.define("Todo", {
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, 
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
