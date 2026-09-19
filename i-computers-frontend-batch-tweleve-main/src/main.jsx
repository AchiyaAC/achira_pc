import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { UserProvider } from "./context/userContext";
import "./index.css";
import "./App.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const app = <StrictMode><BrowserRouter><UserProvider><App /></UserProvider></BrowserRouter><Toaster position="top-right" toastOptions={{ duration: 3000 }} /></StrictMode>;

createRoot(document.getElementById("root")).render(
  googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider> : app
);
