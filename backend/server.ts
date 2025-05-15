import express, { RequestHandler } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import User from "./models/user";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import images from "./models/images";

const app = express();
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());


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

// Secret key for signing JWTs
const JWT_SECRET = "your_secret_key";

// If you're defining LoginRequestBody interface somewhere:
interface LoginRequestBody {
  username: string;
  password: string;
}

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

      const token = jwt.sign(
        { username: user.username, id: user._id },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ message: "Login successful!", token });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to login" });
      return;
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

      res.status(200).json({
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });


// Define the user payload type
export interface UserPayload {
  username: string;
  id: string;
}

// Extend the Request type to include our user
export interface CustomRequest extends Request {
  user?: UserPayload;
}

export function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }

    // Type guard to confirm decoded is the right type
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "username" in decoded
    ) {
      req.user = decoded as UserPayload;
      next();
    } else {
      res.status(403).json({ error: "Invalid token payload" });
      return;
    }
  });
}


app.post(
  "/upload-image",
  authenticateToken,
  upload.single("image"),
  async (req: CustomRequest, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).send({ status: "error", message: "No file uploaded." });
        return;
      }

      const username = req.user?.username;
      if (!username) {
        res
          .status(400)
          .send({ status: "error", message: "Invalid user token." });
        return;
      }

      const newImage = new images({
        image: req.file.filename,
        uploadedBy: username,
      });

      await newImage.save();

      res.send({ status: "ok", message: "Image uploaded successfully" });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).send({ status: "error", error });
    }
  }
);


app.get(
  "/get-images",
  authenticateToken,
  async (req: CustomRequest, res: Response) => {
    try {
      const username = req.user?.username;
      if (!username) {
        res.status(400).send({ status: "error", message: "Invalid user token." });
        return;
      }

      const imageList = await images.find({ uploadedBy: username });

      res.send({ status: "ok", data: imageList });
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).send({ status: "error", error });
    }
  }
);



app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
