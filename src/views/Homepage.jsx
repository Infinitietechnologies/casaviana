"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Link from "next/link";
import { get_events } from "@/Api/api";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebar from "@/components/LeftSidebar";

const Homepage = () => {
  // Separate state for each Swiper instance
  const [thumbsSwiper1, setThumbsSwiper1] = useState(null);
  const [thumbsSwiper2, setThumbsSwiper2] = useState(null);
  const [thumbsSwiper3, setThumbsSwiper3] = useState(null);
  const [thumbsSwiper4, setThumbsSwiper4] = useState(null);
  const [thumbsSwiper5, setThumbsSwiper5] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSubmenu = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const eventImagesFallback = [
    {
      src: "/images/Imagem WhatsApp 2025-10-31 às 11.05.57_e8acca07.jpg",
      alt: "Event 1",
      slug: "/events/calema-no-clube-s/",
    },
    {
      src: "/images/Imagem WhatsApp 2025-10-31 às 11.06.20_11115bdf.jpg",
      alt: "Event 2",
      slug: "/events/calema-no-clube-s/",
    },
  ];

  const [eventImages, setEventImages] = useState(eventImagesFallback);

  React.useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      try {
        const res = await get_events(null, null, 1, 2);
        if (!mounted) return;
        if (res?.success && Array.isArray(res.data)) {
          const items = res.data.map((e) => ({
            src:
              e.banner_image ||
              (e.images && e.images[0]) ||
              "/images/event2.png",
            alt: e.title || "Event",
            slug: `/events/${e.slug}`,
          }));
          if (items.length > 0) setEventImages(items);
        }
      } catch (err) {
        // keep fallback
      }
    };

    fetchEvents();
    return () => {
      mounted = false;
    };
  }, []);

  const destaqueItems = [
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
  ];

  const sliderImages = [
    "/images/swiper1.jpeg",
    "/images/swiper2.png",
    "/images/swiper3.png",
    "/images/swiper4.jpeg",
    "/images/swiper5.jpg",
    "/images/swiper6.png",
    "/images/swiper7.jpg",
  ];

  const sliderCenterImages = [
    "/images/hotel_swiper1.jpg",
    "/images/hotel_swiper2.jpeg",
    "/images/hotel_swiper3.jpeg",
    "/images/hotel_swiper4.jpeg",
    "/images/hotel_swiper5.jpeg",
    "/images/hotel_swiper6.jpeg",
  ];

  const images = [
    "/images/beverages1.jpeg",
    "/images/beverages2.jpeg",
    "/images/beverages3.png",
    "/images/beverages4.jpeg",
    "/images/beverages5.jpeg",
    "/images/beverages6.jpeg",
    "/images/beverages7.jpeg",
    "/images/beverages8.jpeg",
    "/images/beverages9.jpeg",
    "/images/beverages10.jpeg",
  ];

  const hotelImages = [
    "/images/hotel_swiper1.jpg",
    "/images/hotel_swiper2.jpeg",
    "/images/hotel_swiper3.jpeg",
    "/images/hotel_swiper4.jpeg",
    "/images/hotel_swiper5.jpeg",
    "/images/hotel_swiper6.jpeg",
    "/images/hotel_swiper7.jpeg",
  ];

  const singerImages = [
    "/images/singer_swiper1.jpeg",
    "/images/singer_swiper2.png",
    "/images/singer_swiper3.jpeg",
    "/images/singer_swiper4.jpeg",
    "/images/singer_swiper5.jpeg",
    "/images/singer_swiper6.jpeg",
    "/images/singer_swiper7.png",
  ];

  const menuItems = [
    {
      name: "Aqui Acontece",
      sub: ["Casamento", "Aniversários", "Eventos Empresariais"],
    },
    {
      name: "Lá Fora",
      sub: ["Concertos", "Famosos", "Lançamentos", "Night Life"],
    },
    {
      name: "Destinos",
      sub: ["Praias", "Resorts", "Restaurantes"],
    },
    {
      name: "Em Forma",
      sub: ["Ginásios", "Saúde", "Alimentação"],
    },
    {
      name: "Clube da Cultura",
      sub: [
        "Cinemateca",
        "Teatro",
        "Karaoke",
        "Dança",
        "Cerâmica",
        "Pintura",
        "Escultura",
        "Literatura",
      ],
    },
    { name: "O Nosso SPORTING" },
  ];

  return (
    <>
      <div className="mx-auto py-4 md:py-8 px-2 sm:px-4 mt-20 sm:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-3">
            <h2 className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-base sm:text-lg md:text-xl text-center font-bold py-2 px-4 rounded-md mb-4">
              EVENTOS EM DESTAQUES
            </h2>
            <div className="flex justify-center gap-2 sm:gap-3">
              {eventImages.map((ev, i) => (
                <div
                  key={i}
                  className="relative w-[48%] sm:w-[45%] md:w-[48%] h-[240px] sm:h-[260px] md:h-[300px]"
                >
                  <Link href={ev.slug || "/events"}>
                    <Image
                      src={ev.src}
                      alt={ev.alt}
                      fill
                      className="object-cover rounded-md"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-base sm:text-lg md:text-xl text-center font-bold py-2 px-4 rounded-md mb-4">
              DESTAQUES
            </h2>
            <Link href="https://centraldipanda.ao/loja-do-cabelo/">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
                {destaqueItems.map((item, i) => (
                  <button
                    key={i}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Link>
          </div>

          <div className="lg:col-span-4">
            <Swiper
              spaceBetween={10}
              navigation={true}
              modules={[Navigation, Thumbs]}
              thumbs={{
                swiper:
                  thumbsSwiper1 && !thumbsSwiper1.destroyed
                    ? thumbsSwiper1
                    : null,
              }}
              className="mainSwiper rounded-md overflow-hidden"
            >
              {sliderImages.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[260px]">
                    <Image
                      src={img}
                      alt={`slide-${i}`}
                      fill
                      className="object-cover rounded-md"
                    />
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      ESPAÇOS
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper1}
              spaceBetween={8}
              slidesPerView={4}
              breakpoints={{
                640: { slidesPerView: 5 },
                768: { slidesPerView: 6 },
              }}
              watchSlidesProgress
              modules={[Thumbs]}
              className="thumbSwiper mt-2 sm:mt-3"
            >
              {sliderImages.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-[50px] sm:h-[60px] md:h-[80px] cursor-pointer">
                    <Image
                      src={img}
                      alt={`thumb-${i}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Main content grid - Caps total width and distributes columns evenly */}
      <div className=" mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          {/* LEFT SIDE - TRENDING / COMMENTS / LATEST */}
          <LeftSidebar />

          {/* CENTER - All main content */}
          <div className="lg:col-span-8 py-4 md:py-6 gap-6">
            {/* Original top center content */}
            <div className="w-full gap-4 grid grid-cols-1 md:gap-6 relative overflow-hidden">
              {/* Main Slider */}
              <div className="w-full">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  navigation={true}
                  modules={[Navigation, Thumbs]}
                  thumbs={{
                    swiper:
                      thumbsSwiper2 && !thumbsSwiper2.destroyed
                        ? thumbsSwiper2
                        : null,
                  }}
                  className="mainSwiper overflow-hidden rounded-md"
                >
                  {sliderCenterImages.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                        <Image
                          src={img}
                          alt={`slide-${i}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-red-600 text-white text-xs px-2 py-1">
                          CASAMENTO
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnails */}
              <div className="w-full">
                <Swiper
                  onSwiper={setThumbsSwiper2}
                  spaceBetween={8}
                  slidesPerView={3}
                  breakpoints={{
                    480: { slidesPerView: 4 },
                    640: { slidesPerView: 5 },
                    768: { slidesPerView: 6 },
                  }}
                  watchSlidesProgress
                  modules={[Thumbs]}
                  className="thumbSwiper mt-2 sm:mt-3"
                >
                  {sliderCenterImages.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative w-full h-[60px] sm:h-[70px] md:h-[110px] cursor-pointer">
                        <Image
                          src={img}
                          alt={`thumb-${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Red Banner */}
              <div className="mb-3 sm:mb-4 mt-2 sm:mt-3 w-full">
                <Image
                  src="/images/cms-image2.jpg"
                  alt="Tigra Banner"
                  width={1920}
                  height={400}
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
            </div>

            {/* BANNER AND BEVERAGE SLIDER */}
            <div className="max-w-full pt-2 md:pt-3 pb-4 md:pb-6 w-full">
              {/* Banner */}
              <div className="mb-0">
                {/* <Image
                  src="/images/cms-image2.jpg"
                  alt="Tigra Banner"
                  width={1920}
                  height={400}
                  className="w-full h-auto object-cover rounded-md"
                /> */}
              </div>

              {/* Main Image Slider */}
              <div className="w-full">
                {/* Main Slider 3 */}
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  navigation={true}
                  modules={[Navigation, Thumbs]}
                  thumbs={{
                    swiper:
                      thumbsSwiper3 && !thumbsSwiper3.destroyed
                        ? thumbsSwiper3
                        : null,
                  }}
                  className="mainSwiper rounded-md overflow-hidden"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                        <Image
                          src={img}
                          alt={`slide-${i}`}
                          fill
                          className="object-cover rounded-md"
                        />
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          CASAMENTO
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Thumbnails */}
                <Swiper
                  onSwiper={setThumbsSwiper3}
                  spaceBetween={8}
                  slidesPerView={3}
                  breakpoints={{
                    480: { slidesPerView: 4 },
                    640: { slidesPerView: 5 },
                    768: { slidesPerView: 6 },
                  }}
                  watchSlidesProgress
                  modules={[Thumbs]}
                  className="thumbSwiper mt-2 sm:mt-3"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative w-full h-[60px] sm:h-[70px] md:h-[110px] cursor-pointer">
                        <Image
                          src={img}
                          alt={`thumb-${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Banner */}
              <div className="mt-6 sm:mt-8 w-full">
                <Image
                  src="/images/saf.png"
                  alt="Tigra Banner"
                  width={1920}
                  height={400}
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
            </div>

            {/* HOTEL SLIDER */}
            <div className="max-w-full py-4 md:py-8 w-full">
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation, Thumbs]}
                thumbs={{
                  swiper:
                    thumbsSwiper4 && !thumbsSwiper4.destroyed
                      ? thumbsSwiper4
                      : null,
                }}
                className="mainSwiper overflow-hidden rounded-md"
              >
                {hotelImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                      <Image
                        src={img}
                        alt={`slide-${i}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        CASAMENTO
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper4}
                spaceBetween={8}
                slidesPerView={3}
                breakpoints={{
                  480: { slidesPerView: 4 },
                  640: { slidesPerView: 5 },
                  768: { slidesPerView: 6 },
                }}
                watchSlidesProgress
                modules={[Thumbs]}
                className="thumbSwiper mt-2 sm:mt-3"
              >
                {hotelImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-[60px] sm:h-[70px] md:h-[110px] cursor-pointer">
                      <Image
                        src={img}
                        alt={`thumb-${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* SINGER SLIDER */}
            <div className="max-w-full py-4 md:py-8 w-full">
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation, Thumbs]}
                thumbs={{
                  swiper:
                    thumbsSwiper5 && !thumbsSwiper5.destroyed
                      ? thumbsSwiper5
                      : null,
                }}
                className="mainSwiper overflow-hidden rounded-md"
              >
                {singerImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                      <Image
                        src={img}
                        alt={`slide-${i}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        CASAMENTO
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper5}
                spaceBetween={8}
                slidesPerView={3}
                breakpoints={{
                  480: { slidesPerView: 4 },
                  640: { slidesPerView: 5 },
                  768: { slidesPerView: 6 },
                }}
                watchSlidesProgress
                modules={[Thumbs]}
                className="thumbSwiper mt-2 sm:mt-3"
              >
                {singerImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-[60px] sm:h-[70px] md:h-[110px] cursor-pointer">
                      <Image
                        src={img}
                        alt={`thumb-${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* RIGHT SIDE - DIRECTORY */}
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Homepage;
