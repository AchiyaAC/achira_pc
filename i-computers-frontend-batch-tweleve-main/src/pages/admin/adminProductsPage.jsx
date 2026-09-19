import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/api";
import { getImageUrl } from "../../lib/imageUrl";
import { formatPrice } from "../../lib/price-format";
import DeleteProductModal from "../../components/deleteProductModal";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteProduct, setDeleteProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data.products || [];

      setProducts(list);
    } catch (error) {
      console.error("Fetch products error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(value) ||
        product.category?.toLowerCase().includes(value)
      );
    });
  }, [products, search]);

  const handleDeleteSuccess = (deletedId) => {
    setProducts((previous) =>
      previous.filter((product) => {
        const id =
          product.productId ||
          product._id ||
          product.id;

        return id !== deletedId;
      })
    );

    setDeleteProduct(null);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p>Manage all products in your store.</p>
        </div>

        <Link
          to="/admin/products/add"
          className="admin-primary-button"
        >
          + Add Product
        </Link>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span>
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="admin-empty-state">
          <h2>No products found</h2>

          <p>
            {search
              ? "Try another search."
              : "No products have been added yet."}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const productId =
                  product.productId ||
                  product._id ||
                  product.id;

                const image =
                  product.image ||
                  product.images?.[0];

                const quantity =
                  Number(product.quantity) || 0;

                return (
                  <tr key={productId}>
                    <td>
                      <img
                        src={getImageUrl(image)}
                        alt={product.name}
                        className="admin-product-image"
                      />
                    </td>

                    <td>
                      <strong>
                        {product.name}
                      </strong>
                    </td>

                    <td>
                      {product.category || "N/A"}
                    </td>

                    <td>
                      {formatPrice(product.price)}
                    </td>

                    <td>
                      <span
                        className={
                          quantity <= 0
                            ? "stock-out"
                            : quantity <= 5
                            ? "stock-low"
                            : "stock-ok"
                        }
                      >
                        {quantity}
                      </span>
                    </td>

                    <td>
                      <div className="admin-action-buttons">
                        <Link
                          to={`/admin/products/edit/${productId}`}
                          className="edit-button"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            setDeleteProduct(product)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

export default AdminProductsPage;