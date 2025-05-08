import express, { RequestHandler } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import User from "./models/user";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(bodyParser.json());

interface LoginRequestBody {
  username: string;
  password: string;
}

interface ResetPassword {
  password: string;
}

interface ResetPasswordParams {
  id: string;
  token: string;
}

interface ForgotPassword {
  email: string;
  //subject: string;
  //text: string;
  //to: string;
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

app.post(
  "/login",
  async (req: Request<object, unknown, LoginRequestBody>, res: Response) => {
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

app.post(
  "/forgotPassword",
  async (req: Request<object, unknown, ForgotPassword>, res: Response) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        res.status(400).json({ error: "Invalid Email" });
        return;
      }

      const token = jwt.sign({ id: user._id }, "jwt-secret-key", {
        expiresIn: "1d",
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "p66903601@gmail.com",
          pass: "uvyh sbfj jquk gmmj",
        },
      });

      const mailOptions = {
        from: "p66903601@gmail.com",
        to: email,
        subject: "Reset your password",
        text: `Click the following link to reset your password: http://localhost:5173/reset-password/${user._id}/${token}`,
      };

      const info = await transporter.sendMail(mailOptions);

      res
        .status(200)
        .json({
          message: "Password reset email sent successfully",
          emailResponse: info.response,
        });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process forgot password" });
      return;
    }
  }
);

app.post(
  "/reset-password/:id/:token",
  async (
    req: Request<ResetPasswordParams, unknown, ResetPassword>,
    res: Response
  ) => {
    const { id, token } = req.params;
    const { password } = req.body;

    jwt.verify(token, "jwt-secret-key", (err) => {
      if (err) {
        res.json({ Status: "Error with token" });
      } else {
        bcrypt
          .hash(password, 10)
          .then((hash) => {
            User.findByIdAndUpdate({ _id: id }, { password: hash })
              .then(() => res.send({ Status: "Success" }))
              .catch((err) => res.send({ Status: err }));
          })
          .catch((err) => res.send({ Status: err }));
      }
    });
  }
);

app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
