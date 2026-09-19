import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../lib/api";
import Header from "../components/header";
import LoadingAnimation from "../components/loadingAnimation";

import UserContext from "../context/userContext";

export default function SettingsPage() {
  const {
    user,
    setUser,
  } = useContext(UserContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response =
          await api.get("/users/profile");

        const profile =
          response.data?.user ||
          response.data;

        const fullName =
          profile?.name ||
          user?.name ||
          "";

        const nameParts =
          fullName.trim().split(" ");

        setForm({
          firstName:
            nameParts.shift() || "",
          lastName:
            nameParts.join(" "),
          email:
            profile?.email ||
            user?.email ||
            "",
        });
      } catch (error) {
        console.error(error);

        const fullName =
          user?.name || "";

        const nameParts =
          fullName.trim().split(" ");

        setForm({
          firstName:
            nameParts.shift() || "",
          lastName:
            nameParts.join(" "),
          email:
            user?.email || "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSaving(true);

    try {
      const response =
        await api.put("/users/profile", {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          name:
            `${form.firstName} ${form.lastName}`.trim(),
        });

      const updatedUser =
        response.data?.user ||
        response.data;

      setUser(updatedUser);

      toast.success(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingAnimation />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-blue-600"
          >
            ← Back to Store
          </Link>

          <h1 className="mt-3 text-3xl font-bold">
            Account Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account information.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Profile Information
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>

                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border bg-gray-100 p-3 text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-400">
                Email address cannot be changed here.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}