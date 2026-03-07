const initialState = {
  cart: [],
  payment: {},
  address: {},
};

function normalizeProduct(product) {
  if (!product || product.id == null) return null;
  const id = String(product.id);
  const name = product.name ?? product.title ?? "";
  const price = product.price != null ? product.price : null;
  const image =
    product.images?.[0]?.url ??
    product.image ??
    product.imageUrl ??
    product.thumbnail ??
    "";
  return { ...product, id, name, price, image };
}

function shoppingCartReducer(state = initialState, action) {
  switch (action.type) {
    case "SHOPPING_CART_ADD_TO_CART": {
      const { product, quantity = 1 } = action.payload || {};
      const normalized = normalizeProduct(product);
      if (!normalized) return state;
      const id = normalized.id;
      const existing = state.cart.find(
        (item) => item.product && String(item.product.id) === id
      );
      let newCart;
      if (existing) {
        newCart = state.cart.map((item) =>
          item.product && String(item.product.id) === id
            ? { ...item, count: item.count + quantity }
            : item
        );
      } else {
        newCart = [
          ...state.cart,
          { count: quantity, checked: true, product: normalized },
        ];
      }
      return { ...state, cart: newCart };
    }
    case "SHOPPING_CART_SET_ITEM_COUNT": {
      const { productId, count } = action.payload || {};
      if (productId == null) return state;
      const num = Number(count);
      if (num <= 0) {
        const newCart = state.cart.filter(
          (item) => item.product && String(item.product.id) !== productId
        );
        return { ...state, cart: newCart };
      }
      const newCart = state.cart.map((item) =>
        item.product && String(item.product.id) === productId
          ? { ...item, count: num }
          : item
      );
      return { ...state, cart: newCart };
    }
    case "SHOPPING_CART_REMOVE": {
      const { productId } = action.payload || {};
      if (productId == null) return state;
      const newCart = state.cart.filter(
        (item) => item.product && String(item.product.id) !== productId
      );
      return { ...state, cart: newCart };
    }
    case "SHOPPING_CART_SET_ITEM_CHECKED": {
      const { productId, checked } = action.payload || {};
      if (productId == null) return state;
      const newCart = state.cart.map((item) =>
        item.product && String(item.product.id) === productId
          ? { ...item, checked: !!checked }
          : item
      );
      return { ...state, cart: newCart };
    }
    case "SHOPPING_CART_SET_CART":
      return { ...state, cart: action.payload };
    case "SHOPPING_CART_SET_PAYMENT":
      return { ...state, payment: action.payload };
    case "SHOPPING_CART_SET_ADDRESS":
      return { ...state, address: action.payload };
    default:
      return state;
  }
}

export default shoppingCartReducer;
