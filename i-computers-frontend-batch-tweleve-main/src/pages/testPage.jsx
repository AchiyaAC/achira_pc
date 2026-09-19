import { useState } from "react";
import uploadMedia from "../lib/uploadMedia";
import LoadingAnimation from "../components/loadingAnimation";

export default function TestPage() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleTestUpload() {
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadMedia(file);
      setUploadedUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 flex flex-col gap-4 max-w-md mx-auto">
      {loading && <LoadingAnimation />}
      <h1 className="text-2xl font-bold">Image Upload Test Page</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded-md"
      />
      <button
        onClick={handleTestUpload}
        className="bg-accent text-white py-2 px-4 rounded-md"
      >
        Upload File
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-semibold">Result:</p>
          <img src={uploadedUrl} alt="Uploaded" className="w-48 h-48 object-cover rounded-md mt-2" />
          <p className="text-xs break-all mt-2 text-gray-500">{uploadedUrl}</p>
        </div>
      )}
    </div>
  );
}