import { useState } from "react";
import { resetPassword } from "../ForgotPasswordPage/services";
import "../ForgotPasswordPage/ForgotPassword.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function ForgotPassword() {

    const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(false);


    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
        try {
          const result = await resetPassword({ email });
          toast.success("Email sent successfully", {
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
          setError("");
          console.log(result);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Login failed:", error.message);
            setError("Invalid email");
          } else {
            console.error("Unknown error:", error);
          }
        } finally {
          setLoading(false); // hide loader after alert is closed
        }
    }

  return (
    <div className="forgotP">
      <form action="" onSubmit={handleSend}>
        <h1>Forgot password</h1>
        <br />
        <div>Enter the email to send link :</div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email"
          type="email"
          required
        />
        <br />
        <span style={{ color: "red" }}>{error}</span>
        <br />
        <br />
        <button>Send</button>
        <br />
        <br />
        {loading && <div className="loader"></div>}
      </form>
       <ToastContainer/>
    </div>
  );
}
