import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import {
  setCartItemCount,
  removeFromCart,
  setCartItemChecked,
} from "../redux/actions/shoppingCartActions";

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.shoppingCart?.cart || []);

  const selectedTotal = cart.reduce((sum, item) => {
    if (!item.checked || !item.product) return sum;
    const price = Number(item.product.price);
    if (Number.isNaN(price)) return sum;
    return sum + price * item.count;
  }, 0);

  const selectedCount = cart.filter((item) => item.checked).length;

  const handleQuantityChange = (productId, delta) => {
    const item = cart.find(
      (i) => i.product && String(i.product.id) === String(productId)
    );
    if (!item) return;
    const next = Math.max(0, item.count + delta);
    if (next === 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(setCartItemCount(productId, next));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Sepetim (0 Ürün)
        </h1>
        <p className="text-gray-500 py-8">
          Sepetiniz boş.{" "}
          <Link to="/shop" className="text-emerald-600 hover:underline">
            Alışverişe başla
          </Link>
        </p>
      </div>
    );
  }

  const SHIPPING_PRICE = 29.99;
  const FREE_SHIPPING_THRESHOLD = 150;
  const shippingTotal = selectedTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
  const shippingDiscount = selectedTotal >= FREE_SHIPPING_THRESHOLD ? SHIPPING_PRICE : 0;
  const grandTotal = selectedTotal + shippingTotal - shippingDiscount;

  const formatPrice = (n) =>
    Number(n).toLocaleString("tr-TR", { minimumFractionDigits: 2 });

  return (
    <div className="max-w-6xl mx-auto p-4 md:py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Sepetim ({cart.length} Ürün)
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table header - visible on larger screens */}
        <div className="hidden md:flex gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="w-28 flex-shrink-0">Seçim / Ürün</div>
          <div className="flex-1 min-w-0">Ürün adı</div>
          <div className="w-28 flex-shrink-0 text-center">Adet</div>
          <div className="w-24 flex-shrink-0 text-right">Fiyat</div>
          <div className="w-10 flex-shrink-0" />
        </div>

        <ul className="divide-y divide-gray-200">
          {cart.map((item, index) => {
            const p = item.product || {};
            const productId = p.id;
            const priceNum = p.price != null ? Number(p.price) : 0;
            const lineTotal = priceNum * item.count;
            const priceStr =
              p.price != null
                ? Number(p.price).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                  })
                : "—";
            const lineTotalStr = Number(lineTotal).toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
            });

            return (
              <li
                key={`${productId}-${index}`}
                className="flex flex-col md:flex-row md:items-center gap-3 px-4 py-4 hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-3 flex-shrink-0 md:w-28">
                  <input
                    type="checkbox"
                    checked={!!item.checked}
                    onChange={(e) =>
                      dispatch(setCartItemChecked(productId, e.target.checked))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    aria-label={`${p.name || "Ürün"} seç`}
                  />
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-100 overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        —
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-2">
                    {p.name || "Ürün"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Beden: Tek Ebat
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 md:w-28 justify-center md:justify-center">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(productId, -1)}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium"
                    aria-label="Azalt"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">
                    {item.count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(productId, 1)}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium"
                    aria-label="Artır"
                  >
                    +
                  </button>
                </div>
                <div className="flex-shrink-0 md:w-24 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {lineTotalStr} TL
                  </p>
                  {item.count > 1 && (
                    <p className="text-xs text-gray-500">
                      {priceStr} TL × {item.count}
                    </p>
                  )}
                </div>
                <div className="flex justify-end md:w-10">
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(productId))}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    aria-label="Ürünü kaldır"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
        </div>

        {/* Order Summary - right side */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-4 flex flex-col gap-3">
            <Link
              to="/checkout"
              className="w-full py-3 px-4 rounded-lg bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors text-center block"
            >
              Sepeti Onayla &gt;
            </Link>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Sipariş Özeti
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Ürünün Toplamı</dt>
                  <dd className="font-medium text-gray-900">
                    {formatPrice(selectedTotal)} TL
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Kargo Toplam</dt>
                  <dd className="font-medium text-gray-900">
                    {formatPrice(selectedCount > 0 ? SHIPPING_PRICE : 0)} TL
                  </dd>
                </div>
                {shippingDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <dt>
                      {FREE_SHIPPING_THRESHOLD} TL ve Üzeri Kargo Bedava
                    </dt>
                    <dd className="font-medium">
                      -{formatPrice(shippingDiscount)} TL
                    </dd>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <dt className="font-semibold text-gray-900">Toplam</dt>
                  <dd className="font-semibold text-gray-900">
                    {formatPrice(selectedCount > 0 ? grandTotal : 0)} TL
                  </dd>
                </div>
              </dl>
              <p className="text-xs text-gray-500 mt-3">
                + İndirim kodu girişi sonraki adımda eklenecektir.
              </p>
            </div>
            <Link
              to="/checkout"
              className="w-full py-3 px-4 rounded-lg bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors text-center block"
            >
              Sepeti Onayla &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
