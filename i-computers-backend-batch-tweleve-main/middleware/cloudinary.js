
import crypto from "node:crypto";

const CLOUDINARY_FOLDER = "i-computers/products";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(timestamp, folder, apiSecret) {
  // Cloudinary requires all signed upload parameters
  // (except file, api_key and signature) in alphabetical order.
  const stringToSign = `folder=${folder}&timestamp=${timestamp}`;

  return crypto
    .createHash("sha1")
    .update(stringToSign + apiSecret)
    .digest("hex");
}

export async function uploadImageToCloudinary(file) {
  if (!file?.buffer) {
    throw new Error("No image file received.");
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000);

  const signature = createSignature(
    timestamp,
    CLOUDINARY_FOLDER,
    apiSecret
  );

  const formData = new FormData();

  formData.append(
    "file",
    new Blob([file.buffer], {
      type: file.mimetype || "application/octet-stream",
    }),
    file.originalname || "product-image"
  );

  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", CLOUDINARY_FOLDER);
  formData.append("signature", signature);

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/` +
    `${encodeURIComponent(cloudName)}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.secure_url) {
    console.error(
      "Cloudinary upload failed:",
      data.error?.message || response.status
    );

    throw new Error(
      data.error?.message || "Cloudinary image upload failed."
    );
  }

  return {
    url: data.secure_url,
    publicId: data.public_id || "",
  };
}