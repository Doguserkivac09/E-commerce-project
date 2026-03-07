import workintechApi, {
  setAuthToken,
  clearAuthToken,
} from "../../api/workintech";

export function setUser(payload) {
  return { type: "CLIENT_SET_USER", payload };
}

export function setAddressList(payload) {
  return { type: "CLIENT_SET_ADDRESS_LIST", payload };
}

export function setCreditCards(payload) {
  return { type: "CLIENT_SET_CREDIT_CARDS", payload };
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
