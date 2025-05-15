import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignInPage.css";
import { loginUser } from "../SignInPage/services";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignInPage() {
  const navigate = useNavigate();

 
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await loginUser({ username, password });
      localStorage.setItem("token", result.token);
      console.log("Token saved to localStorage");
      toast.success("Login successfully", {
        onClose: () => navigate("/homePage"),
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      console.log(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
        setError(error.message);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="signIndiv">
      <form onSubmit={handleSubmit}>
        <h1 style={{ display: "flex", justifyContent: "center" }}>Sign In</h1>

        <label>Username :</label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
          required
        />
        <br />
        <br />

        <label>Password :</label>
        <br />
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
            required
          />
        </div>
        <Link className="forgot" to="/forgot-password">
          <span className="forgot">Forgot password?</span>
        </Link>
        <div
          style={{
            color: "red",
            display: "flex",
            justifyContent: "center",
            marginTop: "4px",
          }}
        >
          {error}
        </div>
        <br />
        <button type="submit">Submit</button>
        <br />
        <br />

        <span style={{ color: "black" }}>Don't have an account?</span>
        <Link className="link" to="/signUpPage">
          <span style={{ color: "blue" }}> Signup</span>
        </Link>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
        transition={Bounce}
        closeButton={false}
      />
    </div>
  );
}
