import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import { fetchCategoriesThunk } from "../redux/actions/productActions";
import { addToCart } from "../redux/actions/shoppingCartActions";
import { getCategoryLink } from "../utils/categoryHelpers";

const editorPicks = [
  { id: 1, label: "ERKEK" },
  { id: 2, label: "KADIN" },
  { id: 3, label: "AKSESUAR" },
  { id: 4, label: "ÇOCUK" },
];

const bestsellers = [
  {
    id: 1,
    category: "Kadın",
    title: "Hafif triko kazak",
    price: "49.00",
    oldPrice: "69.00",
    image:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    category: "Erkek",
    title: "Klasik bej kaban",
    price: "89.00",
    oldPrice: "119.00",
    image:
      "https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    category: "Kadın",
    title: "Yumuşak pamuk tişört",
    price: "29.00",
    oldPrice: "39.00",
    image:
      "https://images.pexels.com/photos/5886047/pexels-photo-5886047.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    category: "Unisex",
    title: "Renk bloklu sweatshirt",
    price: "59.00",
    oldPrice: "79.00",
    image:
      "https://images.pexels.com/photos/7671248/pexels-photo-7671248.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const posts = [
  {
    id: 1,
    tag: "Moda",
    title: "Günlük kapsül gardırop nasıl kurulur?",
    image:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    tag: "Yaşam",
    title: "Günlük rutini değiştiren küçük alışkanlıklar",
    image:
      "https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    tag: "İpucu",
    title: "Basic parçalarla kolay kombin fikirleri",
    image:
      "https://images.pexels.com/photos/3738089/pexels-photo-3738089.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const PLACEHOLDER_IMAGES = [
  "https://images.pexels.com/photos/7671246/pexels-photo-7671246.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/3738089/pexels-photo-3738089.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/7671247/pexels-photo-7671247.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=400",
];

function Home() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.products?.categories || []);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategoriesThunk());
    }
  }, [dispatch, categories.length]);

  const top5ByRating = [...categories]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      <HeroSlider />

      {top5ByRating.length > 0 && (
        <section className="flex flex-col gap-5">
          <div className="flex flex-col items-center text-center gap-1">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Kategoriler
            </p>
            <h2 className="text-lg md:text-xl font-semibold">
              En Çok Tercih Edilen Kategoriler
            </h2>
            <p className="text-xs text-gray-500 max-w-md">
              Rating değerine göre öne çıkan kategoriler.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {top5ByRating.map((cat, index) => (
              <Link
                key={cat.id}
                to={getCategoryLink(cat)}
                className="flex flex-col w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(20%-1rem)] max-w-[200px]"
              >
                <div className="rounded-2xl overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                  <img
                    src={
                      cat.image ||
                      cat.img ||
                      PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900 text-center truncate">
                  {cat.name}
                </p>
                {cat.rating != null && (
                  <p className="text-xs text-gray-500 text-center">
                    ★ {Number(cat.rating).toFixed(1)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-1">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Editörün Seçimi
          </p>
          <h2 className="text-lg md:text-xl font-semibold">
            Öne Çıkan Kategoriler
          </h2>
          <p className="text-xs text-gray-500 max-w-md">
            Rahatlık ve şıklık arasındaki dengeyi yakalamaya çalışan kombinler.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-5">
          <div className="flex-1 h-56 md:h-64 rounded-2xl overflow-hidden flex items-end p-4 relative">
            <img
              src="https://images.pexels.com/photos/7671246/pexels-photo-7671246.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Men collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative">
              <div className="bg-white px-6 py-2 text-xs font-semibold tracking-wide">
                ERKEK
              </div>
            </div>
          </div>
          <div className="flex-1 h-56 md:h-64 rounded-2xl overflow-hidden flex items-end p-4 relative">
            <img
              src="https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Women collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative">
              <div className="bg-white px-6 py-2 text-xs font-semibold tracking-wide">
                KADIN
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-row md:flex-col gap-3 md:gap-5">
            {editorPicks.slice(2).map((item) => (
              <div
                key={item.id}
                className="flex-1 h-28 md:h-32 rounded-2xl overflow-hidden flex items-end p-4 relative"
              >
                <img
                  src={
                    item.label === "AKSESUAR"
                      ? "https://images.pexels.com/photos/3738089/pexels-photo-3738089.jpeg?auto=compress&cs=tinysrgb&w=600"
                      : "https://images.pexels.com/photos/7671247/pexels-photo-7671247.jpeg?auto=compress&cs=tinysrgb&w=600"
                  }
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative">
                  <div className="bg-white px-6 py-2 text-xs font-semibold tracking-wide">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-1">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Öne Çıkan Ürünler
          </p>
          <h2 className="text-lg md:text-xl font-semibold">
            En Çok Tercih Edilenler
          </h2>
          <p className="text-xs text-gray-500 max-w-md">
            Sık kullanılan basic parçalar ve basit kombin ürünleri.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 md:overflow-visible md:flex-wrap">
          {bestsellers.map((product) => (
            <div key={product.id} className="w-48 md:w-56 flex-shrink-0">
              <ProductCard
                id={product.id}
                category={product.category}
                title={product.title}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.image}
                onAddToCart={() =>
                  dispatch(
                    addToCart({
                      id: product.id,
                      name: product.title,
                      price: product.price,
                      image: product.image,
                    })
                  )
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col items-center text-center gap-1">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Öne Çıkan Yazılar
          </p>
          <h2 className="text-lg md:text-xl font-semibold">
            Blogdan Son Yazılar
          </h2>
          <p className="text-xs text-gray-500 max-w-md">
            Figma topluluk tasarımından esinlenen örnek blog içerikleri.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  {post.tag}
                </span>
                <h3 className="text-sm font-semibold text-gray-900">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Basit bir yazı yerleşimini göstermek için eklenmiş örnek metin.
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-emerald-600"
                >
                  Devamını oku
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

