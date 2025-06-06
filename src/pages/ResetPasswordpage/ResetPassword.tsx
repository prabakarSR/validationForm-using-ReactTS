import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { RPassword } from "../ResetPasswordpage/services";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type FormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const { id, token } = useParams<{ id: string; token: string }>();
  const navigate = useNavigate();

  const schema: ZodType<FormData> = z
    .object({
      password: z
        .string()
        .min(8, { message: "Minimum 8 characters" })
        .max(8, { message: "Minimum 8 characters" }),
      confirmPassword: z
        .string(),
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
    if (!id || !token) {
      alert("Invalid or missing reset link");
      return;
    }

    try {
      const result = await RPassword(id, token, data);
      toast.success("Password reset successfully", {
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
        alert(error.message);
      } else {
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="resetP">
      <form onSubmit={handleSubmit(submitData)}>
        <h1>Reset Password</h1>

        <div>Enter the new password :</div>
        <input type="password" {...register("password")} required />
        <br />
        {errors.password && (
          <div style={{ color: "red" }}>{errors.password.message}</div>
        )}
        <br />

        <div>Confirm Password :</div>
        <input type="password" {...register("confirmPassword")} required />
        <br />
        {errors.confirmPassword && (
          <div style={{ color: "red" }}>{errors.confirmPassword.message}</div>
        )}
        <br />
        <br />
        <button type="submit">Update</button>
      </form>
      <ToastContainer />
    </div>
  );
}
