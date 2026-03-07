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
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const categoriesRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.client?.user);
  const categories = useSelector((state) => state.products?.categories || []);
  const cart = useSelector((state) => state.shoppingCart?.cart || []);
  const isLoggedIn = user && (user.email || user.name);

  useEffect(() => {
    function handleClickOutside(e) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(e.target)) {
        setCartDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
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
          <div className="relative flex items-center gap-0.5" ref={cartDropdownRef}>
              <Link
                to="/cart"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm">Sepetim</span>
                {cart.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-orange-500 text-[10px] font-medium text-white">
                    {cart.length}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="p-1 text-gray-500 hover:text-gray-900"
                aria-label="Sepet özeti"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            {cartDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-96 max-h-[80vh] bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
                <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-900">
                  Sepetim ({cart.length} Ürün)
                </div>
                <div className="overflow-y-auto flex-1 p-2">
                  {cart.length === 0 ? (
                    <p className="text-sm text-gray-500 py-6 text-center">
                      Sepetiniz boş
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {cart.map((item, index) => {
                        const p = item.product || {};
                        const price =
                          p.price != null
                            ? Number(p.price).toLocaleString("tr-TR", {
                                minimumFractionDigits: 2,
                              })
                            : "—";
                        return (
                          <li
                            key={`${p.id}-${index}`}
                            className="flex gap-3 p-2 rounded-lg hover:bg-gray-50"
                          >
                            <div className="w-14 h-14 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden">
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
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {p.name || "Ürün"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Beden: Tek Ebat Adet: {item.count}
                              </p>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {price} TL
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="p-3 border-t border-gray-100 flex gap-2">
                    <Link
                      to="/cart"
                      onClick={() => setCartDropdownOpen(false)}
                      className="flex-1 py-2 text-center text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Sepete Git
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setCartDropdownOpen(false)}
                      className="flex-1 py-2 text-center text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Siparişi Tamamla
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <img
                  src={gravatarUrl(user.email)}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <span className="text-sm max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Siparişlerim
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış yap
                  </button>
                </div>
              )}
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
              <div className="pt-2 border-t border-gray-100 mt-2 flex flex-col gap-1">
                <Link
                  to="/orders"
                  className="text-sm text-gray-700 py-2"
                  onClick={() => setOpen(false)}
                >
                  Siparişlerim
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-gray-600 text-left py-2"
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
              <Link
                to="/cart"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;

