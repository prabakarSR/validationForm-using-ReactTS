export type ForgotPassword = {
    email : string
}

export const resetPassword = async (data: ForgotPassword) => {
     try {
       const response = await fetch("http://localhost:4000/forgotPassword", {
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