import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignInPage.css";
import { loginUser } from "../SignInPage/services";

export default function SignInPage() {
  const navigate = useNavigate();

 
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await loginUser({ username, password });
      alert("Login successful!");
      console.log(result);
      navigate("/homePage");
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
    <div>
      <form onSubmit={handleSubmit}>
        <h1 style={{ display: "flex", justifyContent: "center" }}>Sign In</h1>

        <label>Username :</label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <div
          style={{ color: "red", display: "flex", justifyContent: "center" }}
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
    </div>
  );
}
