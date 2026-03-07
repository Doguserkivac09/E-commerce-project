import axios from "axios";

const workintechApi = axios.create({
  baseURL: "https://workintech-fe-ecommerce.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token) {
  if (token) {
    workintechApi.defaults.headers.common["Authorization"] = token;
  } else {
    delete workintechApi.defaults.headers.common["Authorization"];
  }
}

export function clearAuthToken() {
  delete workintechApi.defaults.headers.common["Authorization"];
}

export default workintechApi;
