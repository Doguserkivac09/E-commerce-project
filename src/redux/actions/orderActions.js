import workintechApi from "../../api/workintech";
import { setCart } from "./shoppingCartActions";

/**
 * Create order via POST /order. On success, clears the shopping cart.
 * @param {Object} payload - { address_id, order_date, card_no, card_name, card_expire_month, card_expire_year, card_ccv, price, products }
 * @returns {Promise}
 */
export function createOrderThunk(payload) {
  return function (dispatch) {
    return workintechApi
      .post("/order", payload)
      .then(() => {
        dispatch(setCart([]));
      });
  };
}
