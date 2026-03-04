import ProductCard from "../components/ProductCard";

const products = [
  {
    id: 1,
    category: "Kadın",
    title: "Oversize gömlek",
    price: "59.00",
    oldPrice: "79.00",
    image:
      "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    category: "Erkek",
    title: "Basic kapüşonlu sweat",
    price: "69.00",
    oldPrice: "89.00",
    image:
      "https://images.pexels.com/photos/7697491/pexels-photo-7697491.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    category: "Kadın",
    title: "Yüksek bel pantolon",
    price: "99.00",
    oldPrice: "129.00",
    image:
      "https://images.pexels.com/photos/7671168/pexels-photo-7671168.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    category: "Unisex",
    title: "Basic beyaz tişört",
    price: "39.00",
    oldPrice: "49.00",
    image:
      "https://images.pexels.com/photos/10041218/pexels-photo-10041218.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

function Shop() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-xs text-emerald-600 font-medium">Mağaza</p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Tüm Ürünler
        </h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-xl">
          Basic parçalar, rahat üstler ve günlük kombinler. Aşağıdan
          öne çıkan ürünlere göz atabilirsin.
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

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs md:text-sm text-gray-500">
            <span>Sırala: Öne çıkanlar</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
            >
              <ProductCard
                id={product.id}
                category={product.category}
                title={product.title}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.image}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Shop;

