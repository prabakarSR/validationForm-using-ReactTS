import "./SignUpPage.css";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../SignUpPage/services";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormData = {
  username: string;
  email: string;
  phoneNo: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const schema: ZodType<FormData> = z
    .object({
      username: z
        .string()
        .min(3, { message: "Username must contain at least 3 characters" })
        .max(30)
        .transform((val) => val.replace(/\s/g, "")),
      email: z
        .string()
        .email()
        .transform((val) => val.replace(/\s/g, "")),
      phoneNo: z
        .string()
        .regex(/^\d{10}$/, { message: "Phone is invalid" })
        .length(10),
      password: z
        .string()
        .min(8, { message: "Minimum 8 characters" })
        .max(8)
        .transform((val) => val.replace(/\s/g, "")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password is mismatch",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const submitData = async (data: FormData) => {
    try {
      const result = await signUpUser(data); // call service here
      toast.success("Signup successful", {
        onClose: () => navigate("/"),
        closeButton: false,
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="signUpdiv">
      <form onSubmit={handleSubmit(submitData)}>
        <h1 style={{ marginLeft: "95px" }}>Sign Up</h1>
        <label>Username :</label>
        <br />
        <input type="text" {...register("username")} required />
        <br />
        {errors.username && (
          <div style={{ color: "red" }}>{errors.username.message}</div>
        )}
        <br />
        <label>Email :</label>
        <br />
        <input type="email" {...register("email")} required />
        <br />
        {errors.email && (
          <div style={{ color: "red" }}>{errors.email.message}</div>
        )}
        <br />
        <label>Phone No :</label>
        <br />
        <input type="text" {...register("phoneNo")} required />
        <br />
        {errors.phoneNo && (
          <div style={{ color: "red" }}>{errors.phoneNo.message}</div>
        )}
        <br />
        <label>Password :</label>
        <br />
        <input type="password" {...register("password")} required />
        <br />
        {errors.password && (
          <div style={{ color: "red" }}>{errors.password.message}</div>
        )}
        <br />
        <label>Confirm password :</label>
        <br />
        <input type="password" {...register("confirmPassword")} required />
        <br />
        {errors.confirmPassword && (
          <div style={{ color: "red" }}>{errors.confirmPassword.message}</div>
        )}
        <br />
        <div className="error" style={{ color: "red" }}>
          {error}
        </div>
        <br />
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
}
