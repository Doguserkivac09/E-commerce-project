export function setCart(payload) {
  return { type: "SHOPPING_CART_SET_CART", payload };
}

export function setPayment(payload) {
  return { type: "SHOPPING_CART_SET_PAYMENT", payload };
}

export function setAddress(payload) {
  return { type: "SHOPPING_CART_SET_ADDRESS", payload };
}
