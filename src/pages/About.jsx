function About() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-xs text-emerald-600 font-medium">Hakkımızda</p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Bandage Hakkında
        </h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-xl">
          Bandage, basit ve temiz bir alışveriş deneyimi hedefleyen örnek bir
          e-ticaret arayüzüdür. Bu proje, tasarım pratiği ve frontend
          geliştirme çalışmaları için hazırlanmıştır.
        </p>
      </section>

      <section className="flex flex-col md:flex-row gap-6 md:items-start">
        <div className="flex-1 flex flex-col gap-4 text-xs md:text-sm text-gray-600">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Vizyon
            </h2>
            <p className="mt-2">
              Kullanıcının aradığı ürünü hızlıca bulabildiği, sade ama modern
              bir arayüz oluşturmak. Figma tasarım kitlerinden esinlenerek,
              pratik ve yeniden kullanılabilir bileşenler ortaya koymak.
            </p>
          </div>
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Odak Noktalarımız
            </h2>
            <ul className="mt-2 flex flex-col gap-1 list-disc list-inside">
              <li>Mobil öncelikli, responsive tasarım</li>
              <li>Basit state yönetimi ve okunabilir kod</li>
              <li>Gerçekçi ama demo niteliğinde ürün ve sayfalar</li>
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-5">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">
            Proje Notları
          </h2>
          <p className="text-xs md:text-sm text-gray-600">
            Bu uygulama; React, React Router, Redux, TailwindCSS ve basit bir
            API entegrasyonu ile hazırlanmış bir demo projedir. Gerçek ödeme
            altyapısı veya yönetim paneli bulunmamaktadır.
          </p>
          <p className="text-xs md:text-sm text-gray-600">
            Amaç, tasarım kitinde görülen sayfaları temel alarak, junior seviye
            bir frontend projesinde karşılaşılabilecek yapı ve bileşenleri
            denemektir.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;

