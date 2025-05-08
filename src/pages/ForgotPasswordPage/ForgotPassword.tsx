import { useState } from "react";
import { resetPassword } from "../ForgotPasswordPage/services";


export default function ForgotPassword() {

    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string | null>(null);


    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
              const result = await resetPassword({ email });
            alert(`we sent OTP to this email ${email}`);
            setError("");
              console.log(result);
            } catch (error: unknown) {
              if (error instanceof Error) {
                  console.error("Login failed:", error.message);
                  setError("Invalid email");
                } else {
                  console.error("Unknown error:", error);
              }
            }
    }

  return (
    <div>
      <form action="" onSubmit={handleSend}>
        <h1>Forgot password</h1>
        <div>Enter the email to send OTP :</div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email"
          type="email"
          required
              />
              <br />
        <span style={{color:"red"}} >{error}</span>
        <br />
        <br />
        <button>Send</button>
      </form>
    </div>
  );
}
