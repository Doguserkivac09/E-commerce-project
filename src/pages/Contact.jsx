function Contact() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-xs text-emerald-600 font-medium">İletişim</p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Bize Ulaşın
        </h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-xl">
          Sipariş, ürün ya da genel konularla ilgili sorularınız için
          aşağıdaki formu doldurabilir ya da e-posta gönderebilirsiniz.
        </p>
      </section>

      <section className="flex flex-col md:flex-row gap-8 md:items-start">
        <div className="flex-1 flex flex-col gap-4 text-sm text-gray-600">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Mağaza Bilgileri
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Hafta içi 09:00 - 18:00 saatleri arasında destek veriyoruz.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs md:text-sm">
            <p>
              E-posta:{" "}
              <span className="font-medium text-gray-900">
                support@bandage.shop
              </span>
            </p>
            <p>
              Telefon:{" "}
              <span className="font-medium text-gray-900">
                0 (212) 000 00 00
              </span>
            </p>
            <p>
              Adres:{" "}
              <span className="font-medium text-gray-900">
                İstanbul, Türkiye
              </span>
            </p>
          </div>
        </div>

        <form className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-xs md:text-sm">
            <label className="text-gray-700" htmlFor="name">
              Ad Soyad
            </label>
            <input
              id="name"
              type="text"
              placeholder="Adınızı ve soyadınızı yazın"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-col gap-1 text-xs md:text-sm">
            <label className="text-gray-700" htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              placeholder="ornek@mail.com"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-col gap-1 text-xs md:text-sm">
            <label className="text-gray-700" htmlFor="message">
              Mesajınız
            </label>
            <textarea
              id="message"
              rows="4"
              placeholder="Kısa bir mesaj yazın..."
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-emerald-500 resize-none"
            />
          </div>
          <button
            type="button"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-gray-900 text-white text-xs md:text-sm font-medium py-2.5 px-6"
          >
            Gönder
          </button>
        </form>
      </section>
    </div>
  );
}

export default Contact;

