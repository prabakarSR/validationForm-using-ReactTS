export type RPassword = {
  password: string;
  confirmPassword: string;
};

export const RPassword = async (id: string, token: string, data: RPassword) => {
  try {
    const response = await fetch(
      `http://localhost:4000/reset-password/${id}/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Password reset failed");
    }

    return result;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};
