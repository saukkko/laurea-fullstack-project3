import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Construct the MongoDB URL from environment variables
const mongoUrl = new URL(`mongodb+srv://${process.env.DB_ADDRESS}`);
mongoUrl.pathname = process.env.DB_NAME;
mongoUrl.username = process.env.DB_USER;
mongoUrl.password = process.env.DB_PW;

// Open the database connection
await mongoose
  .connect(mongoUrl.href, {
    ssl: true, // Force ssl (TLS) encryption
    family: 4, // Force IPv4 (had issues on my pc when not set)
  })
  .catch(console.error); // Catch errors and print to server console

// Define schema for the users
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  encodedPassword: String,
});

export const isValidObjectId = mongoose.isValidObjectId; // this is called at router.param("id")
export const User = mongoose.model("users", userSchema); // Export our user schema

// Simple helper function to search user by username
export const findUserByUsername = async (username) =>
  User.findOne({ username: username }).catch(console.error);
