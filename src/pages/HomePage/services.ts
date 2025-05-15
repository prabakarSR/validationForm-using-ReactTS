export const uploadI = async (formData: FormData) => {
  const token = localStorage.getItem("token"); // Get token from localStorage

  try {
    const response = await fetch("http://localhost:4000/upload-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Attach token
        // Don't set 'Content-Type' when using FormData — browser will handle it
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to upload image");
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Upload image request failed");
  }
};

export const getImages = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please log in.");

    const response = await fetch("http://localhost:4000/get-images", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch images");

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Get images request failed");
  }
};
