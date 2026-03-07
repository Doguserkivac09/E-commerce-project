const initialState = {
  cart: [],
  payment: {},
  address: {},
};

function shoppingCartReducer(state = initialState, action) {
  switch (action.type) {
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
