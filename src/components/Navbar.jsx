import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-gray-800">
          SimpleShop
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Home
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

