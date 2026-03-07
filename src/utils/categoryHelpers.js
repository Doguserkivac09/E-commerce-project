export function slugifyCategoryName(name) {
  if (!name || typeof name !== "string") return "";
  const tr = name
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
  return tr
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getCategoryLink(category) {
  if (!category || category.id == null) return "/shop";
  const gender = (category.gender || "kadin").toLowerCase();
  const slug =
    category.slug || slugifyCategoryName(category.name) || String(category.id);
  return `/shop/${gender}/${slug}/${category.id}`;
}

export function slugifyProductName(name) {
  if (!name || typeof name !== "string") return "urun";
  return slugifyCategoryName(name) || "urun";
}

/**
 * Build product detail URL: /shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId
 * @param {Object} product - { id, name, category?, category_id? }
 * @param {Object} urlParams - optional { gender, categoryName, categoryId } when already on a category page
 */
export function getProductDetailLink(product, urlParams) {
  if (!product || product.id == null) return "/shop";
  const slug = slugifyProductName(product.name || "");
  const id = String(product.id);
  if (urlParams && urlParams.gender != null && urlParams.categoryId != null) {
    const gender = String(urlParams.gender).toLowerCase();
    const categoryName =
      urlParams.categoryName != null
        ? encodeURIComponent(String(urlParams.categoryName))
        : "kategori";
    const categoryId = String(urlParams.categoryId);
    return `/shop/${gender}/${categoryName}/${categoryId}/${slug}/${id}`;
  }
  const cat = product.category;
  if (cat && cat.id != null) {
    const gender = (cat.gender || "kadin").toLowerCase();
    const categoryName =
      cat.slug || slugifyCategoryName(cat.name) || String(cat.id);
    const categoryId = String(cat.id);
    return `/shop/${gender}/${categoryName}/${categoryId}/${slug}/${id}`;
  }
  const categoryId = product.category_id != null ? String(product.category_id) : "0";
  return `/shop/kadin/kategori/${categoryId}/${slug}/${id}`;
}
