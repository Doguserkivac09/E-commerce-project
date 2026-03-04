import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto p-4 md:py-6">
      <div className="mb-4 text-xs text-gray-500">
        <span className="cursor-pointer hover:text-gray-700">Anasayfa</span>
        <span className="mx-1">/</span>
        <span className="cursor-pointer hover:text-gray-700">Mağaza</span>
        <span className="mx-1">/</span>
        <span className="text-gray-700">Ürün #{id}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xs md:max-w-sm rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Ürün görseli"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
              Yeni sezon
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              Hafif triko kazak #{id}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-2 max-w-md">
              Günlük kullanıma uygun, rahat kesimli basic bir kazak. Kat kat
              giyime ve sade kombinlere uyum sağlar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-emerald-600">
              $49.00
            </span>
            <span className="text-sm text-gray-400 line-through">
              $69.00
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-700">
              Beden
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 text-xs rounded-full border border-gray-300 text-gray-700"
              >
                S
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs rounded-full border border-gray-900 text-gray-900"
              >
                M
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs rounded-full border border-gray-300 text-gray-700"
              >
                L
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs rounded-full border border-gray-300 text-gray-700"
              >
                XL
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex-1 md:flex-none md:px-6 py-2.5 text-xs font-medium rounded-full bg-gray-900 text-white"
            >
              Sepete ekle
            </button>
            <button
              type="button"
              className="px-4 py-2.5 text-xs font-medium rounded-full border border-gray-300 text-gray-700"
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

