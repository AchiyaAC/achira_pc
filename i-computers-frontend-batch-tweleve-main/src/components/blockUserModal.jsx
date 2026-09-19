import React, { useState } from "react";
import toast from "react-hot-toast";

import api from "../lib/api";

export default function BlockUserModal({
  user,
  onClose,
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  if (!user) {
    return null;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.put("/users/status", {
        userId: user._id || user.id,
        email: user.email,
        isBlocked: !user.isBlocked,
      });

      toast.success(
        user.isBlocked
          ? "User unblocked successfully."
          : "User blocked successfully."
      );

      onSuccess?.(response.data?.user);
      onClose?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update user status."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900">
          {user.isBlocked
            ? "Unblock User"
            : "Block User"}
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Are you sure you want to{" "}
          {user.isBlocked
            ? "unblock"
            : "block"}{" "}
          <strong>
            {user.name || user.email}
          </strong>
          ?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 rounded-lg px-4 py-3 font-semibold text-white ${
              user.isBlocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } disabled:bg-gray-400`}
          >
            {isSubmitting
              ? "Updating..."
              : user.isBlocked
              ? "Unblock"
              : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
}