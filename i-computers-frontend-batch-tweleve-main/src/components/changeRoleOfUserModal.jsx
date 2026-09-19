import React, { useState } from "react";
import toast from "react-hot-toast";

import api from "../lib/api";

export default function ChangeRoleOfUserModal({
  user,
  onClose,
  onSuccess,
}) {
  const [role, setRole] = useState(
    user?.role || "customer"
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  if (!user) {
    return null;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.put("/users/role", {
        userId: user._id || user.id,
        email: user.email,
        role,
      });

      toast.success(
        "User role updated successfully."
      );

      onSuccess?.(response.data?.user);
      onClose?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update user role."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold">
          Change User Role
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          User:{" "}
          <strong>
            {user.name || user.email}
          </strong>
        </p>

        <label className="mt-5 block text-sm font-medium text-gray-700">
          Role
        </label>

        <select
          value={role}
          onChange={(event) =>
            setRole(event.target.value)
          }
          className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
        >
          <option value="customer">
            Customer
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border px-4 py-3 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting
              ? "Updating..."
              : "Save Role"}
          </button>
        </div>
      </div>
    </div>
  );
}