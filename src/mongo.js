import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoDb = new URL(`mongodb+srv://${process.env.DB_ADDRESS}`);
mongoDb.pathname = process.env.DB_NAME;
mongoDb.username = process.env.DB_USER;
mongoDb.password = process.env.DB_PW;

await mongoose
  .connect(mongoDb.href, {
    ssl: true,
    family: 4,
  })
  .catch(console.error);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: Number, unique: true, required: true },
});

export const User = mongoose.model("users", userSchema);
