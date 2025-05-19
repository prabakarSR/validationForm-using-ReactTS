import { useEffect, useState } from "react";
import { getImages, uploadI, deleteImage } from "../HomePage/services";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ImageData = {
  _id: string;
  image: string;
};

export default function HomePage() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<ImageData[]>([]);
  const [fileError, setFileError] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found. Please log in.");
      navigate("/");
    } else {
      fetchImages();
    }
  }, [navigate]);

  const fetchImages = async () => {
    try {
      const result = await getImages();
      console.log(result);
      setAllImages(result.data);
    } catch (error) {
      console.error("Failed to fetch images", error);
    }
  };

  const submitImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image first", {
        closeButton: false,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found. Please log in.");
      navigate("/");
      return;
    }
      const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const result = await uploadI(formData);
      console.log(result);
      toast.success("Image uploaded successfully", {
        closeButton: false,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setImageFile(null);
      setImagePreview(null);
      fetchImages();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Upload failed:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        setFileError(true);
        setImagePreview(null)
        return;
      } else {
        setFileError(false);
      }

      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmDelete) return;

    try {
      await deleteImage(id);
      toast.success("Image deleted successfully", {
        closeButton: false,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      fetchImages(); // refresh image list after delete
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Delete failed:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "right" }}>
        <span
          style={{ color: "black", fontSize: "45px", marginRight: "645px" }}
        >
          Home Page
        </span>{" "}
        <button
          style={{ width: "80px", marginTop: "6px" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <br />
      <br />
      <br />
      <form onSubmit={submitImage}>
        <br />
        <div className="homePagediv">
          <div>
            <span style={{ fontSize: "20px", color: "black" }}>
              1. Select the image to upload :
            </span>
            <br />
            <span style={{ color: "black" }}>
              (File size should be 2MB or less)
            </span>
            <br />
            <br />
            <input
              type="file"
              accept="image/*, application/pdf"
              onChange={onInputChange}
              required
            />
            {fileError ? (
              <div style={{ color: "red" }}>
                Image size should be 2MB or less
              </div>
            ) : null}
            {imagePreview && (
              <div>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "200px", marginTop: "20px" }}
                />
                <br />
              </div>
            )}
            <br />
            <br />
            <div style={{ marginLeft: "20px" }}>
              <button style={{ width: "200px" }} type="submit">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
      <br />
      <br />
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Uploaded Images
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginLeft: "0px",
        }}
      >
        {allImages.map((img) => (
          <div
            style={{
              height: "300px",
              width: "300px",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems:'center'
            }}
            key={img._id}
          >
            <img
              src={`http://localhost:4000/uploads/${img.image}`}
              alt=""
              style={{ width: "200px", height: "200px" }}
            />
            <br />
            <div>
              <button
                style={{
                  width: "100px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                }}
                onClick={() => handleDelete(img._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
