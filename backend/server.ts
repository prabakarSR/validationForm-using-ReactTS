import express, { RequestHandler } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import User from "./models/user";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(bodyParser.json());

interface LoginRequestBody {
  username: string;
  password: string;
}

mongoose
  .connect("mongodb://127.0.0.1:27017/signupdb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const signupHandler: RequestHandler = async (req, res) => {
    const { username, email, phoneNo, password } = req.body;
    const emailToCheck = email.toLowerCase();
  try {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    const emailExists = await User.findOne({ email: emailToCheck });
    if (emailExists) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const phoneExists = await User.findOne({ phoneNo });
    if (phoneExists) {
      res.status(400).json({ error: "Phone number already exists" });
      return;
    }
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email: emailToCheck,
      phoneNo,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user" });
  }
};

app.post("/signup", signupHandler);

app.post("/login",async (req: Request<object, unknown, LoginRequestBody>, res: Response) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        res.status(400).json({ error: "Invalid username" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ error: "Invalid password" });
        return;
      }

      res.status(200).json({ message: "Login successful!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to login" });
    }
  }
);


app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
