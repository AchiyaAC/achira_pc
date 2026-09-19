const DEFAULT_BACKEND_API = "http://localhost:5000/api";

export function getBackendOrigin() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_API;
  return apiUrl.replace(/\/api\/?$/, "");
}

export function getImageUrl(image) {
  if (!image) {
    return "https://placehold.co/600x500?text=No+Image";
  }

  const value = String(image).trim();

  // Cloudinary / any absolute image URL.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Legacy local images from the old version.
  const cleanName = value
    .replace(/^\/?uploads[\\/]/i, "")
    .replace(/^\/+/, "");

  return `${getBackendOrigin()}/uploads/${cleanName}`;
}
