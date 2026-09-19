import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  addToCart,
  getProductId,
} from "../lib/cart";

import { formatPrice } from "../lib/price-format";
import { getImageUrl } from "../lib/imageUrl";

export default function ProductCard({
  product,
}) {
  if (!product) {
    return null;
  }

  const productId = getProductId(product);

  const image =
    product.images?.[0] ||
    product.image ||
    "";

  const stock = Number(product.quantity) || 0;

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    addToCart(product, 1);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <Link
        to={`/product/${productId}`}
        className="flex h-52 items-center justify-center bg-gray-50 p-5"
      >
        <img
          src={getImageUrl(image)}
          alt={product.name || "Product"}
          className="h-full max-w-full object-contain"
          onError={(event) => {
            event.currentTarget.src =
              "https://via.placeholder.com/500x400?text=No+Image";
          }}
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-600">
          {product.category || "Computer"}
        </p>

        <Link
          to={`/product/${productId}`}
          className="line-clamp-2 min-h-12 text-sm font-semibold text-gray-800 hover:text-blue-600"
        >
          {product.name || "Unnamed Product"}
        </Link>

        <div className="mt-4">
          <p className="text-xs text-gray-400">
            Price
          </p>

          <p className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="mt-2">
          {stock > 0 ? (
            <p className="text-xs text-green-600">
              In Stock ({stock})
            </p>
          ) : (
            <p className="text-xs font-medium text-red-500">
              Out of Stock
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Link
            to={`/product/${productId}`}
            className="rounded-lg border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
          >
            Details
          </Link>

          <button
            type="button"
            disabled={stock <= 0}
            onClick={handleAddToCart}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}