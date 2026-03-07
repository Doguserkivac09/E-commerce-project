export function setCart(payload) {
  return { type: "SHOPPING_CART_SET_CART", payload };
}

/**
 * Add product to cart. If same product (by id) already in cart, increment count.
 * @param {Object} product - { id, name?, title?, price?, image?, images?, ... }
 * @param {number} quantity - default 1
 */
export function addToCart(product, quantity = 1) {
  return { type: "SHOPPING_CART_ADD_TO_CART", payload: { product, quantity } };
}

/** Set quantity for cart item by product id. If count <= 0, item is removed. */
export function setCartItemCount(productId, count) {
  return { type: "SHOPPING_CART_SET_ITEM_COUNT", payload: { productId: String(productId), count } };
}

/** Remove item from cart by product id */
export function removeFromCart(productId) {
  return { type: "SHOPPING_CART_REMOVE", payload: { productId: String(productId) } };
}

/** Toggle or set checked state for cart item (for order selection) */
export function setCartItemChecked(productId, checked) {
  return { type: "SHOPPING_CART_SET_ITEM_CHECKED", payload: { productId: String(productId), checked } };
}

export function setPayment(payload) {
  return { type: "SHOPPING_CART_SET_PAYMENT", payload };
}

export function setAddress(payload) {
  return { type: "SHOPPING_CART_SET_ADDRESS", payload };
}
