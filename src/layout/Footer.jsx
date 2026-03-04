import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold">Bandage</h2>
          <p className="text-xs text-gray-500 mt-1">
            Basit bir e-ticaret demo arayüzü.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm text-gray-600">
          <div className="flex gap-4">
            <Link to="/" className="hover:text-gray-900">
              Anasayfa
            </Link>
            <Link to="/shop" className="hover:text-gray-900">
              Mağaza
            </Link>
            <Link to="/" className="hover:text-gray-900">
              Hakkımızda
            </Link>
            <Link to="/" className="hover:text-gray-900">
              İletişim
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Bandage. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

