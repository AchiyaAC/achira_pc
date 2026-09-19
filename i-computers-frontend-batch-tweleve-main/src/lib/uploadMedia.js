import api from "./api";

// Upload an image using the backend upload endpoint.
//
// NOTE:
// This requires the backend to have:
// POST /api/uploads
//
// If you are uploading product images,
// use the AdminAddProductForm / AdminEditProductForm
// directly because those already send FormData to /products.

export default async function uploadMedia(file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  if (!(file instanceof File)) {
    throw new Error("Invalid file.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be less than 5MB.");
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/uploads",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return (
    response.data?.url ||
    response.data?.image ||
    response.data?.file ||
    null
  );
}