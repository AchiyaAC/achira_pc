import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../lib/api";
import Header from "../components/header";
import ProductCard from "../components/productCard";
import LoadingAnimation from "../components/loadingAnimation";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log("Loading products...");

        const response = await api.get("/products");

        console.log("Products API response:", response.data);

        if (!isMounted) return;

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.products || [];

        setProducts(data);
      } catch (error) {
        console.error("Products loading error:", error);

        if (!isMounted) return;

        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to load products.";

        setError(message);
        setProducts([]);

        toast.error(message);
      } finally {
        if (isMounted) {
          console.log("Products loading finished.");
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ==================== HERO ==================== */}

      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Welcome to i-Computers
            </p>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Quality Computer Components at Great Prices
            </h1>

            <p className="mt-5 max-w-xl text-gray-300">
              Find computer components and accessories
              for your next PC build or upgrade.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Shop Products
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-gray-500 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-gray-900"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="hidden justify-center md:flex">
            <div className="flex h-72 w-72 items-center justify-center rounded-full bg-blue-600/20">
              <div className="flex h-56 w-56 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10">
                <span className="text-7xl">💻</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCTS ==================== */}

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Check out our latest products.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            View All →
          </Link>
        </div>

        {/* LOADING */}

        {isLoading && (
          <div className="flex min-h-[250px] items-center justify-center">
            <LoadingAnimation />
          </div>
        )}

        {/* ERROR */}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="text-4xl">⚠️</div>

            <h3 className="mt-3 text-lg font-bold text-red-700">
              Unable to load products
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* NO PRODUCTS */}

        {!isLoading &&
          !error &&
          featuredProducts.length === 0 && (
            <div className="rounded-2xl border bg-white p-10 text-center">
              <div className="text-5xl">📦</div>

              <h3 className="mt-4 text-lg font-bold text-gray-800">
                No Products Available
              </h3>

              <p className="mt-2 text-gray-500">
                There are no products available right now.
              </p>

              <Link
                to="/products"
                className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                View Products
              </Link>
            </div>
          )}

        {/* PRODUCTS */}

        {!isLoading &&
          !error &&
          featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={
                    product.productId ||
                    product._id ||
                    product.id
                  }
                  product={product}
                />
              ))}
            </div>
          )}
      </section>

      {/* ==================== FEATURES ==================== */}

      <section className="border-y bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl p-4">
            <div className="text-3xl">🚚</div>

            <h3 className="mt-3 font-bold">
              Fast Delivery
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Get your order delivered quickly.
            </p>
          </div>

          <div className="rounded-xl p-4">
            <div className="text-3xl">💳</div>

            <h3 className="mt-3 font-bold">
              Easy Ordering
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Simple and convenient checkout.
            </p>
          </div>

          <div className="rounded-xl p-4">
            <div className="text-3xl">🛡️</div>

            <h3 className="mt-3 font-bold">
              Secure Account
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your account information is protected.
            </p>
          </div>

          <div className="rounded-xl p-4">
            <div className="text-3xl">💻</div>

            <h3 className="mt-3 font-bold">
              PC Components
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Components for your next PC build.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}

      <footer className="bg-slate-900 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} i-Computers. All rights reserved.
      </footer>
    </div>
  );
}