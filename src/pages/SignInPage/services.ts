export type LoginRequestData = {
  username: string;
  password: string;
};

export const loginUser = async (data: LoginRequestData) => {
  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to login");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Login request failed");
  }
};
