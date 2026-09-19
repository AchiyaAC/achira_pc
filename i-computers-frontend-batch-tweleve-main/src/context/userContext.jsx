import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/users/me");
      setUser(data?.user || null);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getCurrentUser(); }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      if (!data?.success || !data?.token) throw new Error(data?.message || "Login failed.");
      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Welcome back!");
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed.";
      toast.error(message);
      return { success: false, message };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const { data } = await api.post("/users/google-login", { credential });
      if (!data?.success || !data?.token) throw new Error(data?.message || "Google login failed.");
      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Google login successful!");
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Google login failed.";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/users/register", { name, email, password });
      if (!data?.success) throw new Error(data?.message || "Registration failed.");
      toast.success("Account created successfully!");
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Registration failed.";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully.");
  };

  const updateUser = async (userData) => {
    try {
      const { data } = await api.put("/users/profile", userData);
      setUser(data.user);
      toast.success("Profile updated.");
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed.";
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    login,
    googleLogin,
    register,
    logout,
    updateUser,
    getCurrentUser,
  }), [user, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}

export default UserContext;
