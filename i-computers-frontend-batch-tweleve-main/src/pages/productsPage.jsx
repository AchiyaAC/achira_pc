import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../lib/api";
import Header from "../components/header";
import ProductCard from "../components/productCard";
import LoadingAnimation from "../components/loadingAnimation";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.products || [];

        setProducts(data);
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load products."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !searchText ||
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {isLoading && <LoadingAnimation />}

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            All Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Browse our complete collection of computer components.
          </p>
        </div>

        {/* Search + Category */}
        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_220px]">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Count */}
        <div className="mb-5 text-sm text-gray-500">
          Showing{" "}
          <strong className="text-gray-800">
            {filteredProducts.length}
          </strong>{" "}
          product
          {filteredProducts.length !== 1
            ? "s"
            : ""}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <div className="text-5xl">🔍</div>

            <h2 className="mt-4 text-xl font-bold">
              No Products Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={
                  product.productId ||
                  product._id
                }
                product={product}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}