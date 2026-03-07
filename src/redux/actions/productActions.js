import workintechApi from "../../api/workintech";

export function setCategories(payload) {
  return { type: "PRODUCT_SET_CATEGORIES", payload };
}

export function setProductList(payload) {
  return { type: "PRODUCT_SET_PRODUCT_LIST", payload };
}

export function setTotal(payload) {
  return { type: "PRODUCT_SET_TOTAL", payload };
}

export function setFetchState(payload) {
  return { type: "PRODUCT_SET_FETCH_STATE", payload };
}

export function setLimit(payload) {
  return { type: "PRODUCT_SET_LIMIT", payload };
}

export function setOffset(payload) {
  return { type: "PRODUCT_SET_OFFSET", payload };
}

export function setFilter(payload) {
  return { type: "PRODUCT_SET_FILTER", payload };
}

export function setSort(payload) {
  return { type: "PRODUCT_SET_SORT", payload };
}

export function setSelectedProduct(payload) {
  return { type: "PRODUCT_SET_SELECTED_PRODUCT", payload };
}

export function setProductDetailFetchState(payload) {
  return { type: "PRODUCT_SET_PRODUCT_DETAIL_FETCH_STATE", payload };
}

export function fetchCategoriesThunk() {
  return function (dispatch, getState) {
    const state = getState();
    const categories = state.products?.categories;
    if (categories && Array.isArray(categories) && categories.length > 0) {
      return Promise.resolve();
    }
    return workintechApi
      .get("/categories")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        dispatch(setCategories(list));
      })
      .catch(() => {});
  };
}

const DEFAULT_LIMIT = 25;
const DEFAULT_OFFSET = 0;

export function fetchProductsThunk(params) {
  return function (dispatch) {
    const { categoryId, filter, sort, limit, offset } = params || {};
    const limitVal = limit != null && Number(limit) > 0 ? Number(limit) : DEFAULT_LIMIT;
    const offsetVal = offset != null && Number(offset) >= 0 ? Number(offset) : DEFAULT_OFFSET;
    dispatch(setFetchState("FETCHING"));
    const query = new URLSearchParams();
    if (categoryId != null && categoryId !== "") {
      query.set("category", String(categoryId));
    }
    if (filter != null && String(filter).trim() !== "") {
      query.set("filter", String(filter).trim());
    }
    if (sort != null && String(sort).trim() !== "") {
      query.set("sort", String(sort).trim());
    }
    query.set("limit", String(limitVal));
    query.set("offset", String(offsetVal));
    const queryString = query.toString();
    const url = `/products?${queryString}`;
    return workintechApi
      .get(url)
      .then((res) => {
        const data = res.data?.data || res.data;
        const total = data?.total ?? 0;
        const products = data?.products ?? [];
        dispatch(setTotal(total));
        dispatch(setProductList(Array.isArray(products) ? products : []));
        dispatch(setFetchState("FETCHED"));
      })
      .catch(() => {
        dispatch(setFetchState("FAILED"));
      });
  };
}

export function fetchProductByIdThunk(productId) {
  return function (dispatch) {
    if (productId == null || productId === "") {
      dispatch(setProductDetailFetchState("FAILED"));
      return Promise.resolve();
    }
    dispatch(setProductDetailFetchState("FETCHING"));
    return workintechApi
      .get(`/products/${productId}`)
      .then((res) => {
        const product = res.data?.data ?? res.data;
        dispatch(setSelectedProduct(product));
        dispatch(setProductDetailFetchState("FETCHED"));
      })
      .catch(() => {
        dispatch(setProductDetailFetchState("FAILED"));
      });
  };
}
