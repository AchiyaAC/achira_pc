import React, { useState } from "react";
import toast from "react-hot-toast";

import api from "../lib/api";

export default function DeleteProductModal({
  product,
  onClose,
  onSuccess,
}) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  if (!product) {
    return null;
  }

  const productId =
    product.productId ||
    product._id ||
    product.id;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await api.delete(
        `/products/${productId}`
      );

      toast.success(
        "Product deleted successfully."
      );

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
          🗑️
        </div>

        <h2 className="mt-4 text-xl font-bold">
          Delete Product
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Are you sure you want to delete{" "}
          <strong>
            {product.name || "this product"}
          </strong>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-lg border px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}