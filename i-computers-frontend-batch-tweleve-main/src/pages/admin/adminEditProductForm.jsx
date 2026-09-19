import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/api";
import { getImageUrl } from "../../lib/imageUrl";
import "./adminEditProductForm.css";

const AdminEditProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // ================================
  // IMAGE URL
  // ================================
  const imageUrl = (image) => getImageUrl(image);

  // ================================
  // LOAD PRODUCT
  // ================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/products/${id}`);

        const product =
          response.data?.product ||
          response.data?.data ||
          response.data;

        if (!product) {
          toast.error("Product not found");
          navigate("/admin/products");
          return;
        }

        setFormData({
          name: product.name || "",
          category: product.category || "",
          price: product.price ?? "",
          quantity: product.quantity ?? "",
          description: product.description || "",
        });

        if (product.image) {
          setCurrentImage(imageUrl(product.image));
        }
      } catch (error) {
        console.error("Load product error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load product"
        );

        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  // ================================
  // INPUT CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // IMAGE CHANGE
  // ================================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // File type validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setNewImage(file);

    const imagePreview = URL.createObjectURL(file);
    setPreviewImage(imagePreview);
  };

  // ================================
  // REMOVE NEW IMAGE
  // ================================
  const removeNewImage = () => {
    setNewImage(null);
    setPreviewImage("");

    const input = document.getElementById("product-image");

    if (input) {
      input.value = "";
    }
  };

  // ================================
  // FORM VALIDATION
  // ================================
  const validateForm = () => {
    const name = formData.name.trim();
    const category = formData.category.trim();
    const price = Number(formData.price);
    const quantity = Number(formData.quantity);

    if (!name) {
      toast.error("Product name is required.");
      return false;
    }

    if (!category) {
      toast.error("Category is required.");
      return false;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      toast.error("Please enter a valid price.");
      return false;
    }

    if (
      formData.quantity === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      toast.error("Please enter a valid quantity.");
      return false;
    }

    return true;
  };

  // ================================
  // UPDATE PRODUCT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("category", formData.category.trim());
      data.append("price", String(Number(formData.price)));
      data.append("quantity", String(Number(formData.quantity)));
      data.append(
        "description",
        formData.description.trim()
      );

      if (newImage) {
        data.append("image", newImage);
      }

      const response = await api.put(
        `/products/${id}`,
        data
      );

      console.log("Update response:", response.data);

      toast.success("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (error) {
      console.error("Update product error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <div className="edit-product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  // ================================
  // MAIN UI
  // ================================
  return (
    <div className="edit-product-page">
      {/* PAGE HEADER */}
      <div className="edit-product-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/admin/products")}
          >
            ← Back to Products
          </button>

          <h1>Edit Product</h1>

          <p>
            Update your product information and inventory
            details.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="edit-product-container">
        {/* LEFT SIDE */}
        <div className="edit-product-main">
          <form onSubmit={handleSubmit}>
            {/* BASIC INFORMATION */}
            <div className="edit-card">
              <div className="card-header">
                <div>
                  <h2>Basic Information</h2>
                  <p>
                    Update the basic details of your product.
                  </p>
                </div>
              </div>

              <div className="form-grid">
                {/* PRODUCT NAME */}
                <div className="form-group full-width">
                  <label htmlFor="name">
                    Product Name
                    <span>*</span>
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    disabled={saving}
                  />
                </div>

                {/* CATEGORY */}
                <div className="form-group">
                  <label htmlFor="category">
                    Category
                    <span>*</span>
                  </label>

                  <input
                    id="category"
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Laptops"
                    disabled={saving}
                  />
                </div>

                {/* PRICE */}
                <div className="form-group">
                  <label htmlFor="price">
                    Price
                    <span>*</span>
                  </label>

                  <div className="input-with-prefix">
                    <span>Rs.</span>

                    <input
                      id="price"
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* QUANTITY */}
                <div className="form-group">
                  <label htmlFor="quantity">
                    Quantity
                    <span>*</span>
                  </label>

                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="1"
                    disabled={saving}
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="form-group full-width">
                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description..."
                    rows="6"
                    disabled={saving}
                  />

                  <small>
                    Add useful information about this
                    product.
                  </small>
                </div>
              </div>
            </div>

            {/* PRODUCT IMAGE */}
            <div className="edit-card">
              <div className="card-header">
                <div>
                  <h2>Product Image</h2>
                  <p>
                    Change the image displayed for this
                    product.
                  </p>
                </div>
              </div>

              {/* CURRENT IMAGE */}
              {currentImage && !previewImage && (
                <div className="current-image-section">
                  <h3>Current Image</h3>

                  <div className="current-image-wrapper">
                    <img
                      src={currentImage}
                      alt={formData.name}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* NEW IMAGE PREVIEW */}
              {previewImage && (
                <div className="new-image-section">
                  <div className="image-preview-header">
                    <h3>New Image Preview</h3>

                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={removeNewImage}
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="new-image-preview">
                    <img
                      src={previewImage}
                      alt="New product preview"
                    />
                  </div>

                  {newImage && (
                    <div className="selected-file-info">
                      <strong>{newImage.name}</strong>

                      <span>
                        {(newImage.size / 1024 / 1024).toFixed(
                          2
                        )}{" "}
                        MB
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* UPLOAD */}
              <div className="upload-section">
                <label
                  htmlFor="product-image"
                  className="upload-box"
                >
                  <div className="upload-icon">
                    ↑
                  </div>

                  <strong>
                    Click to upload a new image
                  </strong>

                  <span>
                    PNG, JPG, JPEG or WEBP
                  </span>

                  <small>Maximum file size: 5MB</small>
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  disabled={saving}
                  hidden
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/admin/products")
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="button-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    ✓ Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="edit-product-sidebar">
          {/* PRODUCT STATUS */}
          <div className="sidebar-card">
            <h3>Product Status</h3>

            <div className="status-row">
              <span>Status</span>

              <span
                className={
                  Number(formData.quantity) > 0
                    ? "status-active"
                    : "status-out"
                }
              >
                {Number(formData.quantity) > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>

            <div className="status-row">
              <span>Quantity</span>
              <strong>
                {formData.quantity || 0}
              </strong>
            </div>

            <div className="status-row">
              <span>Price</span>
              <strong>
                Rs.{" "}
                {Number(formData.price || 0).toLocaleString(
                  "en-LK",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>
          </div>

          {/* TIPS */}
          <div className="sidebar-card tips-card">
            <h3>Editing Tips</h3>

            <ul>
              <li>
                Use a clear product name.
              </li>

              <li>
                Keep the category consistent.
              </li>

              <li>
                Make sure the price is correct.
              </li>

              <li>
                Check the available quantity.
              </li>

              <li>
                Use a high-quality product image.
              </li>
            </ul>
          </div>

          {/* IMAGE INFO */}
          <div className="sidebar-card image-info-card">
            <div className="info-icon">i</div>

            <div>
              <h4>Image Guidelines</h4>

              <p>
                Use a square product image with good
                lighting for the best appearance.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminEditProductForm;