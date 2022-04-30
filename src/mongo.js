import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = new URL(`mongodb+srv://${process.env.DB_ADDRESS}`);
mongoUrl.pathname = process.env.DB_NAME;
mongoUrl.username = process.env.DB_USER;
mongoUrl.password = process.env.DB_PW;

await mongoose
  .connect(mongoUrl.href, {
    ssl: true,
    family: 4,
  })
  .catch(console.error);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  encodedPassword: String,
});

export const isValidObjectId = mongoose.isValidObjectId;
export const User = mongoose.model("users", userSchema);
export const findUserByUsername = async (username) =>
  User.findOne({ username: username }).catch(console.error);
