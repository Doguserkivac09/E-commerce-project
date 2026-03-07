import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { fetchOrdersThunk } from "../redux/actions/clientActions";

function formatPrice(n) {
  return Number(n).toLocaleString("tr-TR", { minimumFractionDigits: 2 });
}

function formatDate(str) {
  if (!str) return "—";
  try {
    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? str : d.toLocaleString("tr-TR");
  } catch {
    return str;
  }
}

function OrderRow({ order, isOpen, onToggle }) {
  const orderId = order.id ?? order.order_id ?? "—";
  const orderDate = order.order_date ?? order.createdAt ?? order.date ?? "—";
  const price = order.price ?? order.total ?? order.amount ?? 0;
  const products = order.products ?? order.items ?? [];
  const address = order.address ?? order.shipping_address;

  return (
    <>
      <tr
        className="border-b border-gray-200 hover:bg-gray-50/50 cursor-pointer"
        onClick={onToggle}
      >
        <td className="py-3 px-4 w-8">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </td>
        <td className="py-3 px-4 text-sm font-medium text-gray-900">{orderId}</td>
        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(orderDate)}</td>
        <td className="py-3 px-4 text-sm text-gray-900">{formatPrice(price)} TL</td>
      </tr>
      {isOpen && (
        <tr className="bg-gray-50">
          <td colSpan={4} className="py-4 px-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
              <h4 className="text-sm font-semibold text-gray-900">Sipariş Detayı</h4>
              {address && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Adres</p>
                  <p className="text-sm text-gray-700">
                    {typeof address === "string"
                      ? address
                      : [address.neighborhood, address.district, address.city]
                          .filter(Boolean)
                          .join(", ") || address.title || "—"}
                  </p>
                </div>
              )}
              {products.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Ürünler</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-200">
                        <th className="py-2 pr-2">Ürün / Detay</th>
                        <th className="py-2 pr-2 text-right">Adet</th>
                        <th className="py-2 text-right">Birim Fiyat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, idx) => {
                        const productId = item.product_id ?? item.product?.id ?? item.id;
                        const name = item.product?.name ?? item.name ?? `Ürün #${productId}`;
                        const detail = item.detail ?? item.variant ?? "—";
                        const count = item.count ?? item.quantity ?? 1;
                        const unitPrice = item.price ?? item.unit_price ?? 0;
                        return (
                          <tr key={`${productId}-${idx}`} className="border-b border-gray-100">
                            <td className="py-2 pr-2">
                              <span className="font-medium text-gray-900">{name}</span>
                              {detail && (
                                <span className="text-gray-500 ml-1">({detail})</span>
                              )}
                            </td>
                            <td className="py-2 pr-2 text-right">{count}</td>
                            <td className="py-2 text-right">{formatPrice(unitPrice)} TL</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-end">
                <span className="text-sm font-semibold text-gray-900">
                  Toplam: {formatPrice(price)} TL
                </span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Orders() {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.client?.orderList || []);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchOrdersThunk()).finally(() => setLoading(false));
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:py-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Siparişlerim</h1>
      {orderList.length === 0 ? (
        <p className="text-gray-500 py-8">Henüz siparişiniz bulunmuyor.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <th className="py-3 px-4 w-8" />
                <th className="py-3 px-4">Sipariş No</th>
                <th className="py-3 px-4">Tarih</th>
                <th className="py-3 px-4">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <OrderRow
                  key={order.id ?? order.order_id ?? order.order_date}
                  order={order}
                  isOpen={expandedId === (order.id ?? order.order_id)}
                  onToggle={() => toggleExpand(order.id ?? order.order_id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;
