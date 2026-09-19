import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import api from "../lib/api";
import Header from "../components/header";
import LoadingAnimation from "../components/loadingAnimation";
import ImageSlideShow from "../components/imageSlideShow";

import {
  addToCart,
} from "../lib/cart";

import {
  formatPrice,
} from "../lib/price-format";

export default function ProductOverview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [quantity, setQuantity] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          `/products/${id}`
        );

        const data =
          response.data?.product ||
          response.data;

        setProduct(data);
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            "Product not found."
        );

        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingAnimation />
      </>
    );
  }

  if (!product) {
    return null;
  }

  const stock =
    Number(product.quantity) || 0;

  const images =
    product.images?.length
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error(
        "This product is out of stock."
      );
      return;
    }

    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (stock <= 0) {
      toast.error(
        "This product is out of stock."
      );
      return;
    }

    addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="hover:text-blue-600"
          >
            Products
          </Link>

          <span>/</span>

          <span className="truncate text-gray-800">
            {product.name}
          </span>
        </div>

        <div className="grid gap-10 rounded-2xl border bg-white p-6 shadow-sm lg:grid-cols-2">
          {/* Images */}
          <ImageSlideShow images={images} />

          {/* Product info */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              {product.category ||
                "Computer Component"}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div className="mt-5">
              <span className="text-3xl font-extrabold text-blue-600">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Stock */}
            <div className="mt-4">
              {stock > 0 ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  In Stock — {stock} available
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-8 border-t pt-6">
              <h2 className="font-bold text-gray-900">
                Description
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Quantity */}
            {stock > 0 && (
              <div className="mt-8">
                <label className="mb-2 block text-sm font-semibold">
                  Quantity
                </label>

                <div className="flex w-fit items-center overflow-hidden rounded-lg border">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.max(1, value - 1)
                      )
                    }
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="min-w-12 border-x px-4 py-2 text-center">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(
                          stock,
                          value + 1
                        )
                      )
                    }
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
              <button
                type="button"
                disabled={stock <= 0}
                onClick={handleAddToCart}
                className="rounded-xl border-2 border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
              >
                Add to Cart
              </button>

              <button
                type="button"
                disabled={stock <= 0}
                onClick={handleBuyNow}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}