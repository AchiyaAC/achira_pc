import crypto from "crypto";

const CLOUDINARY_UPLOAD_URL = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME is not configured.");
  }

  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
};

function getCloudinarySignature(timestamp) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET is not configured.");
  }

  const stringToSign = `timestamp=${timestamp}`;

  return crypto
    .createHash("sha1")
    .update(`${stringToSign}${apiSecret}`)
    .digest("hex");
}

export async function uploadImageToCloudinary(file) {
  if (!file?.buffer) {
    throw new Error("No image file received.");
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (!cloudName || !apiKey || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = getCloudinarySignature(timestamp);

  const formData = new FormData();

  formData.append(
    "file",
    new Blob([file.buffer], { type: file.mimetype }),
    file.originalname
  );
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", "i-computers/products");

  const response = await fetch(CLOUDINARY_UPLOAD_URL(), {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    console.error("Cloudinary upload failed:", data);
    throw new Error(data.error?.message || "Cloudinary image upload failed.");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id || "",
  };
}
