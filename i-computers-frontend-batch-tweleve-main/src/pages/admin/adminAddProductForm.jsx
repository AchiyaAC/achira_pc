import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiBox,
  FiCheck,
  FiChevronDown,
  FiDollarSign,
  FiImage,
  FiInfo,
  FiPackage,
  FiPlus,
  FiTag,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import api from "../../lib/api";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const categories = [
  "Laptops",
  "Desktop Computers",
  "Monitors",
  "Graphics Cards",
  "Processors",
  "Motherboards",
  "RAM",
  "Storage",
  "Power Supplies",
  "Computer Cases",
  "Keyboards",
  "Mice",
  "Headsets",
  "Networking",
  "Accessories",
];

const initialForm = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  description: "",
};

function AdminAddProductForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const setSelectedImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(file);
    setPreview(imageUrl);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files?.[0]);
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      setSelectedImage(file);
    }
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();

    const price = Number(formData.price);
    const quantity = Number(formData.quantity);

    if (!name) {
      return "Product name is required.";
    }

    if (name.length < 2) {
      return "Product name must contain at least 2 characters.";
    }

    if (!category) {
      return "Please select a category.";
    }

    if (
      formData.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return "Please enter a valid price.";
    }

    if (
      formData.quantity === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return "Please enter a valid stock quantity.";
    }

    if (description.length > 2000) {
      return "Description cannot exceed 2000 characters.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("category", formData.category.trim());
      data.append("price", String(Number(formData.price)));
      data.append("quantity", String(Number(formData.quantity)));
      data.append("description", formData.description.trim());

      if (image) {
        data.append("image", image);
      }

      await api.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("Add Product Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const price = Number(formData.price);
  const quantity = Number(formData.quantity);

  const validPrice =
    formData.price !== "" &&
    Number.isFinite(price) &&
    price >= 0;

  const validQuantity =
    formData.quantity !== "" &&
    Number.isInteger(quantity) &&
    quantity >= 0;

  const getStockStatus = () => {
    if (!validQuantity) {
      return {
        text: "Not set",
        className: "stock-neutral",
      };
    }

    if (quantity === 0) {
      return {
        text: "Out of stock",
        className: "stock-danger",
      };
    }

    if (quantity <= 5) {
      return {
        text: "Low stock",
        className: "stock-warning",
      };
    }

    return {
      text: "In stock",
      className: "stock-success",
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="admin-product-page">

      {/* ================= HEADER ================= */}

      <div className="admin-product-top">

        <div className="admin-product-heading">

          <Link
            to="/admin/products"
            className="admin-product-back"
          >
            <FiArrowLeft size={16} />
            Back to Products
          </Link>

          <div className="admin-product-title-wrapper">

            <div className="admin-product-title-icon">
              <FiPlus size={22} />
            </div>

            <div>
              <span className="admin-product-eyebrow">
                PRODUCT MANAGEMENT
              </span>

              <h1>Add New Product</h1>

              <p>
                Add a new product to your i-Computers store.
              </p>
            </div>

          </div>

        </div>

        <div className="admin-product-top-actions">

          <button
            type="button"
            className="admin-product-cancel"
            onClick={() => navigate("/admin/products")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-product-form"
            className="admin-product-publish"
            disabled={loading}
          >
            {loading ? (
              <span className="admin-product-spinner" />
            ) : (
              <FiCheck size={17} />
            )}

            {loading ? "Publishing..." : "Publish Product"}
          </button>

        </div>

      </div>

      {/* ================= FORM ================= */}

      <form
        id="add-product-form"
        onSubmit={handleSubmit}
        className="admin-product-layout"
      >

        {/* ================= LEFT ================= */}

        <main className="admin-product-main">

          {/* BASIC INFORMATION */}

          <section className="admin-product-card">

            <div className="admin-product-card-header">

              <div className="admin-product-card-icon">
                <FiInfo />
              </div>

              <div>
                <h2>Basic Information</h2>

                <p>
                  Add the main information about your product.
                </p>
              </div>

            </div>

            {/* PRODUCT NAME */}

            <div className="admin-product-field">

              <label htmlFor="product-name">
                Product Name
                <span>*</span>
              </label>

              <div className="admin-product-input-wrapper">

                <FiBox />

                <input
                  id="product-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: ASUS TUF Gaming A15"
                  maxLength={120}
                  autoFocus
                  required
                />

              </div>

              <div className="admin-product-helper">
                {formData.name.length}/120 characters
              </div>

            </div>

            {/* CATEGORY + STOCK */}

            <div className="admin-product-two-column">

              {/* CATEGORY */}

              <div className="admin-product-field">

                <label htmlFor="product-category">
                  Category
                  <span>*</span>
                </label>

                <div className="admin-product-input-wrapper">

                  <FiTag />

                  <input
                    id="product-category"
                    name="category"
                    list="product-category-list"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Select category"
                    required
                  />

                  <FiChevronDown className="admin-input-right-icon" />

                </div>

                <datalist id="product-category-list">
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    />
                  ))}
                </datalist>

              </div>

              {/* STOCK */}

              <div className="admin-product-field">

                <label htmlFor="product-quantity">
                  Stock Quantity
                  <span>*</span>
                </label>

                <div className="admin-product-input-wrapper">

                  <FiPackage />

                  <input
                    id="product-quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Example: 25"
                    required
                  />

                </div>

                <div className="admin-product-helper">
                  Number of available units.
                </div>

              </div>

            </div>

            {/* PRICE */}

            <div className="admin-product-field">

              <label htmlFor="product-price">
                Product Price
                <span>*</span>
              </label>

              <div className="admin-product-price-wrapper">

                <div className="admin-product-currency">
                  LKR
                </div>

                <div className="admin-product-input-wrapper price-input">

                  <FiDollarSign />

                  <input
                    id="product-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Example: 249999.00"
                    required
                  />

                </div>

              </div>

              <div className="admin-product-helper">
                Enter the selling price in Sri Lankan Rupees.
              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="admin-product-field">

              <div className="admin-product-label-row">

                <label htmlFor="product-description">
                  Product Description
                </label>

                <span>
                  {formData.description.length}/2000
                </span>

              </div>

              <textarea
                id="product-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the product, important specifications, warranty information and other details customers should know..."
                maxLength={2000}
                rows={8}
              />

            </div>

          </section>

          {/* ================= IMAGE ================= */}

          <section className="admin-product-card">

            <div className="admin-product-card-header">

              <div className="admin-product-card-icon">
                <FiImage />
              </div>

              <div>
                <h2>Product Image</h2>

                <p>
                  Upload a clear and high-quality product image.
                </p>
              </div>

            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="admin-product-file-input"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={handleImageChange}
            />

            {!preview ? (

              <button
                type="button"
                className={`admin-product-upload ${
                  dragging
                    ? "admin-product-upload-dragging"
                    : ""
                }`}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragging(false);
                }}
                onDrop={handleDrop}
              >

                <div className="admin-product-upload-icon">
                  <FiUploadCloud />
                </div>

                <strong>
                  Drag & Drop Product Image
                </strong>

                <span>
                  or click here to browse your computer
                </span>

                <small>
                  PNG, JPG, JPEG, WEBP or GIF · Maximum 5MB
                </small>

              </button>

            ) : (

              <div className="admin-product-image-box">

                <div className="admin-product-image-preview">

                  <img
                    src={preview}
                    alt="Product preview"
                  />

                </div>

                <div className="admin-product-image-bottom">

                  <div className="admin-product-file-info">

                    <strong>
                      {image?.name}
                    </strong>

                    <span>
                      {image
                        ? `${(
                            image.size /
                            1024 /
                            1024
                          ).toFixed(2)} MB`
                        : ""}
                    </span>

                  </div>

                  <div className="admin-product-image-actions">

                    <button
                      type="button"
                      className="admin-product-replace"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <FiImage />
                      Replace
                    </button>

                    <button
                      type="button"
                      className="admin-product-remove"
                      onClick={removeImage}
                    >
                      <FiX />
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            )}

          </section>

        </main>

        {/* ================= RIGHT ================= */}

        <aside className="admin-product-sidebar">

          {/* PUBLISH CARD */}

          <section className="admin-product-card admin-product-summary">

            <div className="admin-product-card-header">

              <div className="admin-product-card-icon success">
                <FiCheck />
              </div>

              <div>
                <h2>Product Summary</h2>

                <p>
                  Check your product before publishing.
                </p>
              </div>

            </div>

            <div className="admin-product-summary-list">

              <div>
                <span>Product</span>

                <strong>
                  {formData.name || "Not added"}
                </strong>
              </div>

              <div>
                <span>Category</span>

                <strong>
                  {formData.category || "Not selected"}
                </strong>
              </div>

              <div>
                <span>Price</span>

                <strong>
                  {validPrice
                    ? `LKR ${price.toLocaleString(
                        "en-LK",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}`
                    : "Not set"}
                </strong>
              </div>

              <div>
                <span>Stock</span>

                <strong
                  className={`admin-product-stock ${stockStatus.className}`}
                >
                  {stockStatus.text}

                  {validQuantity &&
                    quantity > 0 && (
                      <small>
                        {quantity} units
                      </small>
                    )}
                </strong>
              </div>

              <div>
                <span>Image</span>

                <strong>
                  {image
                    ? "Uploaded"
                    : "No image"}
                </strong>
              </div>

            </div>

            <button
              type="submit"
              className="admin-product-add-button"
              disabled={loading}
            >
              {loading ? (
                <span className="admin-product-spinner" />
              ) : (
                <FiPlus />
              )}

              {loading
                ? "Adding Product..."
                : "Add Product"}
            </button>

            <div className="admin-product-publish-note">
              <FiCheck />

              <span>
                Your product will be added to the
                store after publishing.
              </span>
            </div>

          </section>

          {/* TIPS */}

          <section className="admin-product-tip">

            <div className="admin-product-tip-icon">
              💡
            </div>

            <div>

              <strong>
                Product tip
              </strong>

              <p>
                Use the exact model name and add
                useful specifications. A clear
                product image can also help
                customers understand the product.
              </p>

            </div>

          </section>

          {/* CHECKLIST */}

          <section className="admin-product-card admin-product-checklist">

            <h3>
              Publishing Checklist
            </h3>

            <div className="admin-check-item">
              <span
                className={
                  formData.name.trim()
                    ? "checked"
                    : ""
                }
              >
                <FiCheck />
              </span>

              <p>Product name</p>
            </div>

            <div className="admin-check-item">
              <span
                className={
                  formData.category.trim()
                    ? "checked"
                    : ""
                }
              >
                <FiCheck />
              </span>

              <p>Category selected</p>
            </div>

            <div className="admin-check-item">
              <span
                className={
                  validPrice
                    ? "checked"
                    : ""
                }
              >
                <FiCheck />
              </span>

              <p>Price added</p>
            </div>

            <div className="admin-check-item">
              <span
                className={
                  validQuantity
                    ? "checked"
                    : ""
                }
              >
                <FiCheck />
              </span>

              <p>Stock quantity</p>
            </div>

            <div className="admin-check-item">
              <span
                className={
                  image
                    ? "checked"
                    : ""
                }
              >
                <FiCheck />
              </span>

              <p>Product image</p>
            </div>

          </section>

        </aside>

      </form>
    </div>
  );
}

export default AdminAddProductForm;