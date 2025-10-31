"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const Homepage = () => {
  // Separate state for each Swiper instance
  const [thumbsSwiper1, setThumbsSwiper1] = React.useState(null);
  const [thumbsSwiper2, setThumbsSwiper2] = React.useState(null);
  const [thumbsSwiper3, setThumbsSwiper3] = React.useState(null);

  const eventImages = [
    { src: "/images/event1.jpg", alt: "Event 1" },
    { src: "/images/event2.png", alt: "Event 2" },
  ];

  const destaqueItems = [
    "Loja do Cabelo",
    "Dipanda Plazza",
    "...",
    "...",
    "..."
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
    "/images/swiper_center1.png",
    "/images/swiper_center2.jpeg",
    "/images/swiper_center3.jpeg",
    "/images/swiper_center4.jpeg",
    "/images/swiper_center5.jpeg",
    "/images/swiper_center6.jpeg",
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

  return (
    <>
      <div className="mx-auto py-8 px-4 grid grid-cols-12 gap-4">
        {/* LEFT SIDE - EVENTOS EM DESTAQUES */}
        <div className="col-span-3">
          <h2 className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl text-center font-bold py-2 px-4 rounded-md mb-4">
            EVENTOS EM DESTAQUES
          </h2>
          <div className="flex gap-4">
            {eventImages.map((ev, i) => (
              <div key={i} className="relative w-full h-[230px]">
                <Image
                  src={ev.src}
                  alt={ev.alt}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE SECTION - DESTAQUES */}
        <div className="col-span-5">
          <h2 className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl text-center font-bold py-2 px-4 rounded-md mb-4">
            DESTAQUES
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {destaqueItems.map((item, i) => (
              <button
                key={i}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md py-3 px-4 text-sm transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - SLIDER 1 */}
        <div className="col-span-4">
          {/* Main Slider */}
          <Swiper
            spaceBetween={10}
            navigation={true}
            modules={[Navigation, Thumbs]}
            thumbs={{ swiper: thumbsSwiper1 }}
            className="mainSwiper rounded-md overflow-hidden"
          >
            {sliderImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-[220px]">
                  <Image
                    src={img}
                    alt={`slide-${i}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    ESPAÇOS
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}
          <Swiper
            onSwiper={setThumbsSwiper1}
            spaceBetween={10}
            slidesPerView={6}
            watchSlidesProgress
            modules={[Thumbs]}
            className="thumbSwiper mt-3"
          >
            {sliderImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-[70px] cursor-pointer">
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

      <div className="mx-auto py-8 px-4 grid grid-cols-12 gap-6">
        {/* LEFT SIDE - TRENDING / COMMENTS / LATEST */}
        <div className="col-span-2 space-y-4">
          {/* Ad image */}
          <div className="">
            <Image
              src="/images/images_cms.png"
              alt="Advertisement"
              width={160}
              height={200}
              className="rounded-md"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-300">
            {["Trending", "Comments", "Latest"].map((tab) => (
              <button
                key={tab}
                className="flex-1 text-center py-2 text-sm font-semibold border-b-2 border-transparent hover:border-red-600 hover:text-red-600 transition-colors"
              >
                {tab}
              </button>
            ))}
          </div>

          {/* News items */}
          <div className="space-y-3">
            {[
              {
                title: "Restaurante",
                date: "NOVEMBRO 6, 2024",
                img: "/images/swiper3.png",
              },
              {
                title: "KIKOLÂNDIA",
                date: "NOVEMBRO 5, 2024",
                img: "/images/img_jkr.png",
              },
              {
                title: "Sala Vitória",
                date: "NOVEMBRO 6, 2024",
                img: "/images/swiper2.png",
              },
              {
                title: "Casamento Sonhos",
                date: "NOVEMBRO 18, 2024",
                img: "/images/swiper_center1.png",
              },
            ].map((news, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative w-16 h-16">
                  <Image
                    src={news.img}
                    alt={news.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight text-gray-900">
                    {news.title}
                  </p>
                  <p className="text-xs text-gray-500">{news.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER - MAIN SWIPER 2 + THUMBNAILS */}
        <div className="col-span-8">
          {/* Main Slider */}
          <Swiper
            spaceBetween={10}
            navigation={true}
            modules={[Navigation, Thumbs]}
            thumbs={{ swiper: thumbsSwiper2 }}
            className="mainSwiper overflow-hidden"
          >
            {sliderCenterImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-[600px]">
                  <Image
                    src={img}
                    alt={`slide-${i}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    CASAMENTO
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}
          <Swiper
            onSwiper={setThumbsSwiper2}
            spaceBetween={10}
            slidesPerView={6}
            watchSlidesProgress
            modules={[Thumbs]}
            className="thumbSwiper mt-3"
          >
            {sliderCenterImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-[80px] cursor-pointer">
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

        {/* RIGHT SIDE - DIRECTORY */}
        <div className="col-span-2">
          <div className="sticky top-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Directório</h2>
            <div className="flex flex-col gap-2">
              {[
                "Aqui Acontece",
                "Lá Fora",
                "Destinos",
                "Em Forma",
                "Clube da Cultura",
                "O Nosso SPORTING",
              ].map((item, i) => (
                <button
                  key={i}
                  className="flex justify-between items-center bg-red-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  {item} <span className="text-white font-bold">●</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Banner */}
        <div className="mb-8">
          <Image
            src="/images/cms-image2.jpg"
            alt="Tigra Banner"
            width={1920}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Main Image Slider */}
        <div>
          {/* Main Slider 3 */}
          <Swiper
            spaceBetween={10}
            navigation={true}
            modules={[Navigation, Thumbs]}
            thumbs={{ swiper: thumbsSwiper3 }}
            className="mainSwiper rounded-md overflow-hidden"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-[400px]">
                  <Image
                    src={img}
                    alt={`slide-${i}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    CASAMENTO
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}
          <Swiper
            onSwiper={setThumbsSwiper3}
            spaceBetween={10}
            slidesPerView={6}
            watchSlidesProgress
            modules={[Thumbs]}
            className="thumbSwiper mt-3"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-[80px] cursor-pointer">
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

        {/* Banner */}
        <div className="mt-8">
          <Image
            src="/images/saf.png"
            alt="Tigra Banner"
            width={1920}
            height={400}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </div>

      {/* Main Image Slider hotel */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Main Slider 3 */}
        <Swiper
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper3 }}
          className="mainSwiper overflow-hidden"
        >
          {hotelImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[400px]">
                <Image
                  src={img}
                  alt={`slide-${i}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  CASAMENTO
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnails */}
        <Swiper
          onSwiper={setThumbsSwiper3}
          spaceBetween={10}
          slidesPerView={6}
          watchSlidesProgress
          modules={[Thumbs]}
          className="thumbSwiper mt-3"
        >
          {hotelImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[80px] cursor-pointer">
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

      {/* Main Image Slider singer */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Main Slider 3 */}
        <Swiper
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper3 }}
          className="mainSwiper overflow-hidden"
        >
          {singerImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[400px]">
                <Image
                  src={img}
                  alt={`slide-${i}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  CASAMENTO
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnails */}
        <Swiper
          onSwiper={setThumbsSwiper3}
          spaceBetween={10}
          slidesPerView={6}
          watchSlidesProgress
          modules={[Thumbs]}
          className="thumbSwiper mt-3"
        >
          {singerImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[80px] cursor-pointer">
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
    </>
  );
};

export default Homepage;
