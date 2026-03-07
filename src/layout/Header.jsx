import { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Search, ShoppingCart, LogOut, ChevronDown } from "lucide-react";
import md5 from "md5";
import { setUser } from "../redux/actions/clientActions";
import { clearAuthToken } from "../api/workintech";
import { getCategoryLink } from "../utils/categoryHelpers";

function Header() {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.client?.user);
  const categories = useSelector((state) => state.products?.categories || []);
  const isLoggedIn = user && (user.email || user.name);

  useEffect(() => {
    function handleClickOutside(e) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const gravatarUrl = (email) => {
    if (!email || typeof email !== "string") return "";
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=80`;
  };

  const handleLogout = () => {
    clearAuthToken();
    dispatch(setUser({}));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    history.push("/");
  };

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
          <div className="relative" ref={categoriesRef}>
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
            >
              Mağaza
              <ChevronDown className="w-4 h-4" />
            </button>
            {categoriesOpen && categories.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
                <Link
                  to="/shop"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setCategoriesOpen(false)}
                >
                  Tüm Ürünler
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={getCategoryLink(cat)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 truncate"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/about" className="text-sm text-gray-700 hover:text-gray-900">
            Hakkımızda
          </Link>
          <Link to="/team" className="text-sm text-gray-700 hover:text-gray-900">
            Ekibimiz
          </Link>
          <Link to="/contact" className="text-sm text-gray-700 hover:text-gray-900">
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
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <img
                src={gravatarUrl(user.email)}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <span className="text-sm text-gray-700 max-w-[120px] truncate">
                {user.name || user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-900"
                title="Çıkış yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Kayıt Ol
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Giriş Yap
              </Link>
            </>
          )}
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
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-500 px-0">Mağaza</span>
              <Link
                to="/shop"
                className="text-sm text-gray-700 pl-2"
                onClick={() => setOpen(false)}
              >
                Tüm Ürünler
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={getCategoryLink(cat)}
                  className="text-sm text-gray-700 pl-2"
                  onClick={() => setOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              to="/about"
              className="text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              to="/team"
              className="text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              Ekibimiz
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              İletişim
            </Link>
            <Link
              to="/signup"
              className="text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              Kayıt Ol
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                <img
                  src={gravatarUrl(user.email)}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <span className="text-sm text-gray-700 truncate flex-1">
                  {user.name || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-gray-600"
                >
                  Çıkış yap
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm text-gray-700"
                onClick={() => setOpen(false)}
              >
                Giriş Yap
              </Link>
            )}
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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;

