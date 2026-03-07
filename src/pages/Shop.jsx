import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import {
  fetchProductsThunk,
  setFilter,
  setSort,
  setOffset,
} from "../redux/actions/productActions";
import ProductCard from "../components/ProductCard";
import { getProductDetailLink } from "../utils/categoryHelpers";

function mapProductToCard(product) {
  return {
    id: product.id,
    title: product.title ?? product.name ?? "",
    category: product.category?.name ?? product.category ?? "",
    price:
      product.price != null
        ? String(product.price)
        : product.listPrice != null
        ? String(product.listPrice)
        : "",
    oldPrice:
      product.oldPrice != null
        ? String(product.oldPrice)
        : product.discountPrice != null
        ? String(product.discountPrice)
        : undefined,
    image: product.image ?? product.imageUrl ?? product.thumbnail ?? "",
  };
}

function Shop() {
  const dispatch = useDispatch();
  const { gender, categoryName, categoryId } = useParams();
  const categories = useSelector((state) => state.products?.categories || []);
  const productList = useSelector((state) => state.products?.productList || []);
  const fetchState = useSelector((state) => state.products?.fetchState || "NOT_FETCHED");
  const filter = useSelector((state) => state.products?.filter ?? "");
  const sort = useSelector((state) => state.products?.sort ?? "");
  const limit = useSelector((state) => state.products?.limit ?? 25);
  const offset = useSelector((state) => state.products?.offset ?? 0);
  const total = useSelector((state) => state.products?.total ?? 0);
  const [filterInput, setFilterInput] = useState(filter);

  const category = categories.find(
    (c) => String(c.id) === String(categoryId)
  );
  const title = category
    ? category.name
    : categoryName
    ? decodeURIComponent(categoryName)
    : "Tüm Ürünler";

  // Reset to page 1 when category, filter, or sort change
  useEffect(() => {
    dispatch(setOffset(0));
  }, [dispatch, categoryId, filter, sort]);

  useEffect(() => {
    dispatch(
      fetchProductsThunk({
        categoryId: categoryId || undefined,
        filter: filter || undefined,
        sort: sort || undefined,
        limit,
        offset,
      })
    );
  }, [dispatch, categoryId, filter, sort, limit, offset]);

  const handleApplyFilter = () => {
    dispatch(setFilter(filterInput));
    dispatch(setOffset(0));
    dispatch(
      fetchProductsThunk({
        categoryId: categoryId || undefined,
        filter: filterInput || undefined,
        sort: sort || undefined,
        limit,
        offset: 0,
      })
    );
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    dispatch(setSort(value));
    dispatch(setOffset(0));
    dispatch(
      fetchProductsThunk({
        categoryId: categoryId || undefined,
        filter: filter || undefined,
        sort: value || undefined,
        limit,
        offset: 0,
      })
    );
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(
    totalPages,
    Math.floor(offset / limit) + 1
  );

  const goToPage = (page) => {
    const pageNum = Math.max(1, Math.min(totalPages, page));
    dispatch(setOffset((pageNum - 1) * limit));
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-xs text-emerald-600 font-medium">Mağaza</p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-xl">
          {categoryId
            ? `${title} kategorisindeki ürünler.`
            : "Basic parçalar, rahat üstler ve günlük kombinler. Aşağıdan öne çıkan ürünlere göz atabilirsin."}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs md:text-sm px-4 py-2 rounded-full border border-gray-300 text-gray-700"
            >
              Tüm ürünler
            </button>
            <button
              type="button"
              className="text-xs md:text-sm px-4 py-2 rounded-full border border-gray-200 text-gray-500"
            >
              Yeni gelenler
            </button>
            <button
              type="button"
              className="text-xs md:text-sm px-4 py-2 rounded-full border border-gray-200 text-gray-500"
            >
              İndirimdekiler
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyFilter()}
                placeholder="Filtre (örn. siyah)"
                className="text-xs md:text-sm px-3 py-2 border border-gray-300 rounded-md w-40 md:w-48 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleApplyFilter}
                className="text-xs md:text-sm px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Filtrele
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort" className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                Sırala:
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={handleSortChange}
                className="text-xs md:text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Öne çıkanlar</option>
                <option value="price:asc">Fiyat (artan)</option>
                <option value="price:desc">Fiyat (azalan)</option>
                <option value="rating:asc">Puan (artan)</option>
                <option value="rating:desc">Puan (azalan)</option>
              </select>
            </div>
          </div>
        </div>

        {fetchState === "FETCHING" && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        )}

        {(fetchState === "FETCHED" || fetchState === "NOT_FETCHED") && (
          <>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
              {productList.map((product) => {
                const card = mapProductToCard(product);
                const detailLink = getProductDetailLink(product, categoryId ? { gender, categoryName, categoryId } : undefined);
                return (
                  <div
                    key={product.id}
                    className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
                  >
                    <ProductCard
                      id={card.id}
                      category={card.category}
                      title={card.title}
                      price={card.price}
                      oldPrice={card.oldPrice}
                      image={card.image}
                      to={detailLink}
                    />
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <nav
                className="flex flex-wrap items-center justify-center gap-2 pt-6"
                aria-label="Ürün sayfaları"
              >
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 text-sm rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Önceki
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    if (Math.abs(p - currentPage) <= 1) return true;
                    return false;
                  })
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && arr[i - 1] !== p - 1) {
                      acc.push("ellipsis");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => goToPage(item)}
                        className={`min-w-[2.25rem] py-1.5 text-sm rounded border ${
                          item === currentPage
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 text-sm rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sonraki
                </button>
              </nav>
            )}
          </>
        )}

        {fetchState === "FAILED" && (
          <p className="text-sm text-gray-500 py-8 text-center">
            Ürünler yüklenemedi. Lütfen tekrar deneyin.
          </p>
        )}
      </section>
    </div>
  );
}

export default Shop;

