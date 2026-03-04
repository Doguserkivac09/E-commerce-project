import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Bandage
          </Link>
        </div>

        <button
          type="button"
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-full border border-gray-200"
          onClick={() => setOpen(!open)}
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-gray-700 hover:text-gray-900">
            Anasayfa
          </Link>
          <Link to="/shop" className="text-sm text-gray-700 hover:text-gray-900">
            Mağaza
          </Link>
          <Link to="/" className="text-sm text-gray-700 hover:text-gray-900">
            Hakkımızda
          </Link>
          <Link to="/" className="text-sm text-gray-700 hover:text-gray-900">
            İletişim
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="relative text-gray-600 hover:text-gray-900"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-[10px] text-white">
              0
            </span>
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <Link
              to="/"
              className="text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              Anasayfa
            </Link>
            <Link
              to="/shop"
              className="text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              Mağaza
            </Link>
            <Link
              to="/"
              className="text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              to="/"
              className="text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              İletişim
            </Link>
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100 mt-2">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;

