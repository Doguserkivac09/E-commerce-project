import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    label: "Yaz 2026",
    title: "Yeni Koleksiyon",
    description: "Yeni sezon parçaları ve basic ürünleri keşfet.",
    cta: "Şimdi Keşfet",
    color: "bg-emerald-500",
    image:
      "https://images.pexels.com/photos/6311579/pexels-photo-6311579.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    label: "Vita Classic",
    title: "Vita Klasik Ürünler",
    description: "Her güne uygun hafif ve rahat kombinler.",
    cta: "Koleksiyona Göz At",
    color: "bg-sky-500",
    image:
      "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div
                className={`${slide.color} text-white px-6 py-10 md:px-12 md:py-16 flex flex-col md:flex-row items-center gap-8`}
              >
                <div className="flex-1 flex flex-col gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                    {slide.label}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-emerald-50 max-w-md">
                    {slide.description}
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center justify-center rounded-full bg-white text-emerald-700 text-xs font-medium py-2.5 px-5"
                  >
                    {slide.cta}
                  </button>
                </div>

                <div className="flex-1 flex justify-center">
                  <div className="w-40 h-52 md:w-56 md:h-72 rounded-[32px] overflow-hidden bg-emerald-200/40 border border-emerald-100 flex items-center justify-center">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 md:px-4 pointer-events-none">
        <button
          type="button"
          onClick={scrollPrev}
          className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 text-gray-700 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 text-gray-700 shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default HeroSlider;

