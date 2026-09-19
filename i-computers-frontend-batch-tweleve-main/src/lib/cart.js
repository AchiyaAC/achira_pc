import toast from "react-hot-toast";

// --------------------------------------------------
// Get cart
// --------------------------------------------------
export function getCart() {
  try {
    const cart = localStorage.getItem("cart");

    if (!cart) {
      return [];
    }

    const parsedCart = JSON.parse(cart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Failed to read cart:", error);
    return [];
  }
}

// --------------------------------------------------
// Save cart
// --------------------------------------------------
export function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));

    // Notify other components/tabs
    window.dispatchEvent(new Event("cartUpdated"));

    return true;
  } catch (error) {
    console.error("Failed to save cart:", error);
    return false;
  }
}

// --------------------------------------------------
// Get product ID safely
// --------------------------------------------------
export function getProductId(product) {
  return (
    product?.productId ||
    product?._id ||
    product?.id ||
    ""
  ).toString();
}

// --------------------------------------------------
// Add product to cart
// --------------------------------------------------
export function addToCart(product, quantity = 1) {
  if (!product) {
    toast.error("Product not found.");
    return [];
  }

  const productId = getProductId(product);

  if (!productId) {
    toast.error("Invalid product.");
    return [];
  }

  const requestedQuantity = Math.max(
    1,
    Number(quantity) || 1
  );

  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) => getProductId(item) === productId
  );

  if (existingIndex !== -1) {
    const currentQuantity =
      Number(cart[existingIndex].quantity) || 0;

    const stock = Number(product.quantity);

    let newQuantity = currentQuantity + requestedQuantity;

    // Respect available stock
    if (Number.isFinite(stock) && stock >= 0) {
      newQuantity = Math.min(newQuantity, stock);
    }

    cart[existingIndex].quantity = newQuantity;

    // Update product information
    cart[existingIndex] = {
      ...cart[existingIndex],
      ...product,
      productId,
      stock: Number.isFinite(Number(product.quantity)) ? Number(product.quantity) : cart[existingIndex].stock,
      quantity: newQuantity,
    };
  } else {
    const stock = Number(product.quantity);

    let finalQuantity = requestedQuantity;

    if (Number.isFinite(stock) && stock >= 0) {
      if (stock === 0) {
        toast.error("This product is out of stock.");
        return cart;
      }

      finalQuantity = Math.min(requestedQuantity, stock);
    }

    cart.push({
      ...product,
      productId,
      stock: Number.isFinite(stock) ? stock : undefined,
      quantity: finalQuantity,
    });
  }

  saveCart(cart);

  toast.success("Added to cart!");

  return cart;
}

// --------------------------------------------------
// Remove product from cart
// --------------------------------------------------
export function removeFromCart(productId) {
  const id = String(productId);

  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => getProductId(item) !== id
  );

  saveCart(updatedCart);

  toast.success("Removed from cart!");

  return updatedCart;
}

// --------------------------------------------------
// Update quantity
// --------------------------------------------------
export function updateCartQuantity(productId, quantity) {
  const id = String(productId);

  const cart = getCart();

  const itemIndex = cart.findIndex(
    (item) => getProductId(item) === id
  );

  if (itemIndex === -1) {
    return cart;
  }

  let newQuantity = Math.max(
    1,
    Number(quantity) || 1
  );

  const stock = Number(cart[itemIndex].stock ?? cart[itemIndex].quantityAvailable);

  if (Number.isFinite(stock) && stock >= 0) {
    newQuantity = Math.min(newQuantity, stock);
  }

  cart[itemIndex].quantity = newQuantity;

  saveCart(cart);

  return cart;
}

// --------------------------------------------------
// Increase quantity
// --------------------------------------------------
export function increaseCartQuantity(productId) {
  const cart = getCart();

  const id = String(productId);

  const index = cart.findIndex(
    (item) => getProductId(item) === id
  );

  if (index === -1) {
    return cart;
  }

  const currentQuantity =
    Number(cart[index].quantity) || 1;

  const availableStock = Number(cart[index].stock ?? cart[index].availableQuantity ?? cart[index].quantityAvailable ?? Infinity);

  if (
    Number.isFinite(availableStock) &&
    currentQuantity >= availableStock
  ) {
    toast.error("Maximum available quantity reached.");
    return cart;
  }

  cart[index].quantity = currentQuantity + 1;

  saveCart(cart);

  return cart;
}

// --------------------------------------------------
// Decrease quantity
// --------------------------------------------------
export function decreaseCartQuantity(productId) {
  const cart = getCart();

  const id = String(productId);

  const index = cart.findIndex(
    (item) => getProductId(item) === id
  );

  if (index === -1) {
    return cart;
  }

  const currentQuantity =
    Number(cart[index].quantity) || 1;

  if (currentQuantity <= 1) {
    return cart;
  }

  cart[index].quantity = currentQuantity - 1;

  saveCart(cart);

  return cart;
}

// --------------------------------------------------
// Get cart item count
// --------------------------------------------------
export function getCartCount() {
  return getCart().reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0),
    0
  );
}

// --------------------------------------------------
// Get cart total
// --------------------------------------------------
export function getCartTotal() {
  return getCart().reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);
}

// --------------------------------------------------
// Clear cart
// --------------------------------------------------
export function clearCart() {
  localStorage.removeItem("cart");

  window.dispatchEvent(new Event("cartUpdated"));
}

// --------------------------------------------------
// Check if product is in cart
// --------------------------------------------------
export function isInCart(productId) {
  const id = String(productId);

  return getCart().some(
    (item) => getProductId(item) === id
  );
}

// --------------------------------------------------
// Get specific cart item
// --------------------------------------------------
export function getCartItem(productId) {
  const id = String(productId);

  return (
    getCart().find(
      (item) => getProductId(item) === id
    ) || null
  );
}