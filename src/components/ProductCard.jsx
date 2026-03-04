import { Link } from "react-router-dom";

function ProductCard({
  id,
  image,
  category,
  title,
  price,
  oldPrice,
}) {
  const cardContent = (
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="relative overflow-hidden rounded-t-xl">
        <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">
              Görsel yakında eklenecek
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">
          {category}
        </p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-emerald-600">
            ${price}
          </span>
          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${oldPrice}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
        </div>

        <button
          type="button"
          className="mt-3 inline-flex items-center justify-center rounded-full border border-gray-900 text-gray-900 text-xs font-medium py-2 px-4 hover:bg-gray-900 hover:text-white transition-colors"
        >
          Sepete ekle
        </button>
      </div>
    </div>
  );

  if (!id) {
    return cardContent;
  }

  return (
    <Link to={`/product/${id}`} className="block">
      {cardContent}
    </Link>
  );
}

export default ProductCard;

