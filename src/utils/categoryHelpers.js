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
