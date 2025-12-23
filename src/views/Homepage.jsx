"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Link from "next/link";
import { get_events, get_content_sections } from "@/Api/api";
import RightSidebar from "@/components/RightSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import Rating from "@/components/Rating/Rating";
import { useDispatch, useSelector } from "react-redux";
import { setSections, setLoading, setError } from "@/store/contentSectionsSlice";
import { SectionSwiperSkeleton, TopSliderSkeleton } from "@/components/Skeletons/SwiperSkeletons";

const Homepage = () => {
  const dispatch = useDispatch();
  const { sections, loading: sectionsLoading } = useSelector((state) => state.contentSections);
  
  // States for dynamic thumbnails - using an object to track them by section ID
  const [thumbsSwipers, setThumbsSwipers] = useState({});
  const [thumbsSwiper1, setThumbsSwiper1] = useState(null);

  const updateThumbsSwiper = (sectionId, swiper) => {
    setThumbsSwipers(prev => ({ ...prev, [sectionId]: swiper }));
  };

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
    
    const fetchContentSections = async () => {
      if (sections.length > 0) return;
      
      dispatch(setLoading(true));
      try {
        const res = await get_content_sections();
        if (res?.success && Array.isArray(res.data)) {
          dispatch(setSections(res.data));
        }
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchContentSections();

    // Handle scroll to hash on mount or when sections load
    if (sections.length > 0 && typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }

    return () => {
      mounted = false;
    };
  }, [dispatch, sections.length]);

  const topSection = sections?.[0];
  const otherSections = sections?.slice(1);

  const destaqueItems = Array.from({ length: 10 }).map((_, i) => "...");

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
            {sectionsLoading ? (
              <TopSliderSkeleton />
            ) : topSection ? (
              <>
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
                  {topSection.items?.map((item) => (
                    <SwiperSlide key={item.id} id={item.slug}>
                      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[260px]">
                        <Image
                          src={item.image || "/cardapio/default.png"}
                          alt={item.title || "Top Slide"}
                          fill
                          className="object-cover rounded-md"
                        />
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          {item.title || "ESPAÇOS"}
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
                  {topSection.items?.map((item) => (
                    <SwiperSlide key={`thumb-${item.id}`}>
                      <div className="relative w-full h-[50px] sm:h-[60px] md:h-[80px] cursor-pointer">
                        <Image
                          src={item.image || "/cardapio/default.png"}
                          alt={`thumb-${item.title}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            ) : null}
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
            {/* Dynamic Content Sections */}
            {sectionsLoading ? (
               <div className="w-full space-y-10">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SectionSwiperSkeleton key={i} />
                  ))}
               </div>
            ) : (
              otherSections?.map((section) => (
                <div key={section.id} id={section.slug} className="w-full mb-10">
                  {section.display_title && (
                    <h2 className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-base sm:text-lg md:text-xl text-center font-bold py-2 px-4 rounded-md mb-6">
                      {section.display_title}
                    </h2>
                  )}
                  
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
                            thumbsSwipers[section.id] && !thumbsSwipers[section.id].destroyed
                              ? thumbsSwipers[section.id]
                              : null,
                        }}
                        className="mainSwiper overflow-hidden rounded-md"
                      >
                        {section.items?.map((item) => (
                          <SwiperSlide key={item.id} id={item.slug}>
                            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                              <Image
                                src={item.image || "/cardapio/default.png"}
                                alt={item.title || "Section Item"}
                                fill
                                className="object-cover rounded-md"
                              />
                              {item.title && (
                                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                  {item.title}
                                </div>
                              )}
                              {item.cta_url && (
                                <Link 
                                  href={item.cta_url}
                                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 text-xs px-3 py-1.5 rounded-full font-bold transition-all shadow-md"
                                >
                                  {item.cta_text || "Veja mais"}
                                </Link>
                              )}
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    {/* Thumbnails */}
                    <div className="w-full">
                      <Swiper
                        onSwiper={(swiper) => updateThumbsSwiper(section.id, swiper)}
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
                        {section.items?.map((item) => (
                          <SwiperSlide key={`thumb-${item.id}`}>
                            <div className="relative w-full h-[50px] sm:h-[70px] md:h-[100px] cursor-pointer">
                              <Image
                                src={item.image || "/cardapio/default.png"}
                                alt={`thumb-${item.title}`}
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
              ))
            )}
          </div>

          {/* RIGHT SIDE - DIRECTORY */}
          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default Homepage;
