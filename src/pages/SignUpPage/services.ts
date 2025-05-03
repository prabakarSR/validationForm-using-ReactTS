

export type SignUpData = {
  username: string;
  email: string;
  phoneNo: string;
  password: string;
  confirmPassword: string;
};

export const signUpUser = async (data: SignUpData) => {
  try {
    const response = await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Signup failed");
    }

    return result;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};
