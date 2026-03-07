import workintechApi, {
  setAuthToken,
  clearAuthToken,
} from "../../api/workintech";

const USER_ADDRESS_ENDPOINT = "/user/address";
const USER_CARD_ENDPOINT = "/user/card";

export function setUser(payload) {
  return { type: "CLIENT_SET_USER", payload };
}

export function setAddressList(payload) {
  return { type: "CLIENT_SET_ADDRESS_LIST", payload };
}

export function setCreditCards(payload) {
  return { type: "CLIENT_SET_CREDIT_CARDS", payload };
}

export function setOrderList(payload) {
  return { type: "CLIENT_SET_ORDER_LIST", payload };
}

export function setRoles(payload) {
  return { type: "CLIENT_SET_ROLES", payload };
}

export function setTheme(payload) {
  return { type: "CLIENT_SET_THEME", payload };
}

export function setLanguage(payload) {
  return { type: "CLIENT_SET_LANGUAGE", payload };
}

export function getRolesThunk() {
  return function (dispatch, getState) {
    const state = getState();
    const roles = state.client?.roles;
    if (roles && Array.isArray(roles) && roles.length > 0) {
      return;
    }
    return workintechApi
      .get("/roles")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        dispatch(setRoles(list));
      })
      .catch(() => {});
  };
}

export function loginThunk(credentials, rememberMe) {
  return function (dispatch) {
    return workintechApi
      .post("/login", credentials)
      .then((res) => {
        const data = res.data?.data || res.data;
        const user = data?.user || data;
        const token = data?.token;
        if (token) {
          setAuthToken(token);
        }
        dispatch(setUser(user || {}));
        if (rememberMe && token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user || {}));
        }
      });
  };
}

export function verifyTokenThunk() {
  return function (dispatch) {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.resolve();
    }
    setAuthToken(token);
    return workintechApi
      .get("/verify")
      .then((res) => {
        const data = res.data?.data || res.data;
        const user = data?.user || data;
        const newToken = data?.token || token;
        dispatch(setUser(user || {}));
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(user || {}));
        setAuthToken(newToken);
      })
      .catch(() => {
        clearAuthToken();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(setUser({}));
      });
  };
}

export function fetchAddressesThunk() {
  return function (dispatch) {
    return workintechApi
      .get(USER_ADDRESS_ENDPOINT)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        dispatch(setAddressList(list));
      })
      .catch(() => {
        dispatch(setAddressList([]));
      });
  };
}

/**
 * @param {Object} payload - { title, name, surname, phone, city, district, neighborhood }
 */
export function addAddressThunk(payload) {
  return function (dispatch) {
    return workintechApi
      .post(USER_ADDRESS_ENDPOINT, payload)
      .then(() => dispatch(fetchAddressesThunk()));
  };
}

/**
 * @param {Object} payload - { id, title, name, surname, phone, city, district, neighborhood }
 */
export function updateAddressThunk(payload) {
  return function (dispatch) {
    return workintechApi
      .put(USER_ADDRESS_ENDPOINT, payload)
      .then(() => dispatch(fetchAddressesThunk()));
  };
}

export function deleteAddressThunk(addressId) {
  return function (dispatch) {
    return workintechApi
      .delete(`${USER_ADDRESS_ENDPOINT}/${addressId}`)
      .then(() => dispatch(fetchAddressesThunk()));
  };
}

export function fetchCardsThunk() {
  return function (dispatch) {
    return workintechApi
      .get(USER_CARD_ENDPOINT)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        dispatch(setCreditCards(list));
      })
      .catch(() => {
        dispatch(setCreditCards([]));
      });
  };
}

/**
 * @param {Object} payload - { card_no, expire_month, expire_year, name_on_card }
 */
export function addCardThunk(payload) {
  return function (dispatch) {
    const body = {
      card_no: String(payload.card_no).replace(/\s/g, ""),
      expire_month: Number(payload.expire_month),
      expire_year: Number(payload.expire_year),
      name_on_card: String(payload.name_on_card).trim(),
    };
    return workintechApi
      .post(USER_CARD_ENDPOINT, body)
      .then(() => dispatch(fetchCardsThunk()));
  };
}

/**
 * @param {Object} payload - { id, card_no, expire_month, expire_year, name_on_card }
 */
export function updateCardThunk(payload) {
  return function (dispatch) {
    const body = {
      id: String(payload.id),
      card_no: String(payload.card_no).replace(/\s/g, ""),
      expire_month: Number(payload.expire_month),
      expire_year: Number(payload.expire_year),
      name_on_card: String(payload.name_on_card).trim(),
    };
    return workintechApi
      .put(USER_CARD_ENDPOINT, body)
      .then(() => dispatch(fetchCardsThunk()));
  };
}

export function deleteCardThunk(cardId) {
  return function (dispatch) {
    return workintechApi
      .delete(`${USER_CARD_ENDPOINT}/${cardId}`)
      .then(() => dispatch(fetchCardsThunk()));
  };
}

export function fetchOrdersThunk() {
  return function (dispatch) {
    return workintechApi
      .get("/order")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        dispatch(setOrderList(list));
      })
      .catch(() => {
        dispatch(setOrderList([]));
      });
  };
}
