import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { fetchProductByIdThunk } from "../redux/actions/productActions";
import { addToCart } from "../redux/actions/shoppingCartActions";

function ProductDetail() {
  const { productId, id, gender, categoryName, categoryId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products?.selectedProduct);
  const fetchState = useSelector(
    (state) => state.products?.productDetailFetchState || "NOT_FETCHED"
  );

  const pid = productId || id;

  useEffect(() => {
    if (pid) {
      dispatch(fetchProductByIdThunk(pid));
    }
  }, [dispatch, pid]);

  const backUrl =
    gender != null && categoryId != null
      ? `/shop/${gender}/${categoryName || ""}/${categoryId}`
      : "/shop";

  const handleBack = () => {
    history.push(backUrl);
  };

  if (fetchState === "FETCHING" || fetchState === "NOT_FETCHED") {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (fetchState === "FAILED" || !product) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:py-6">
        <button
          type="button"
          onClick={() => history.push("/shop")}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
        >
          ← Mağazaya dön
        </button>
        <p className="text-gray-500 py-8 text-center">
          Ürün yüklenemedi. Lütfen tekrar deneyin.
        </p>
      </div>
    );
  }

  const imageUrl =
    product.images?.[0]?.url ||
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    "";
  const price =
    product.price != null ? Number(product.price) : null;
  const rating = product.rating != null ? Number(product.rating) : null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:py-6">
      <button
        type="button"
        onClick={handleBack}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Geri
      </button>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xs md:max-w-sm rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center aspect-square">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name || "Ürün görseli"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">Görsel yok</span>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div>
            {product.category?.name && (
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
                {product.category.name}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              {product.name || "Ürün"}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-2 max-w-md">
              {product.description || "—"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {price != null && (
              <span className="text-xl font-semibold text-emerald-600">
                ${Number(price).toFixed(2)}
              </span>
            )}
          </div>

          {rating != null && (
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Puan:</span>
              <span className="text-sm font-medium">{Number(rating).toFixed(1)}</span>
            </div>
          )}

          {product.stock != null && (
            <p className="text-xs text-gray-500">
              Stok: {product.stock} adet
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => dispatch(addToCart(product))}
              className="flex-1 md:flex-none md:px-6 py-2.5 text-xs font-medium rounded-full bg-gray-900 text-white hover:bg-gray-800"
            >
              Sepete ekle
            </button>
            <button
              type="button"
              className="px-4 py-2.5 text-xs font-medium rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Favorilere ekle
            </button>
          </div>

          <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
            <p>• Kargo: 2-4 iş günü içinde gönderim</p>
            <p>• 14 gün içinde ücretsiz iade</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
