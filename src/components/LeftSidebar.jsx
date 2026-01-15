"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LeftSidebarSkeleton } from "./Skeletons/CommonSkeletons";
import { get_advertisements, get_random_menu_items } from "@/Api/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const LeftSidebar = () => {
  const pathname = usePathname();

  const [items, setItems] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRandomMenuItems = async () => {
    setLoading(true);
    try {
      const res = await get_random_menu_items();

      if (res?.success && Array.isArray(res.data)) {
        setItems(res.data);
        try {
          localStorage.setItem("randomMenuItems", JSON.stringify(res.data));
        } catch {}
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching random menu items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const res = await get_advertisements();

      if (res?.success && Array.isArray(res.data)) {
        setAds(res.data);
        try {
          localStorage.setItem("homeAdvertisements", JSON.stringify(res.data));
        } catch {}
      }
    } catch (err) {
      console.error("Error fetching advertisements:", err);
    }
  };

  useEffect(() => {
    if (pathname === "/") {
      fetchRandomMenuItems();
      fetchAdvertisements();
    } else {
      try {
        const cachedItems = localStorage.getItem("randomMenuItems");
        if (cachedItems) {
          const parsedItems = JSON.parse(cachedItems);
          if (Array.isArray(parsedItems)) setItems(parsedItems);
        }

        const cachedAds = localStorage.getItem("homeAdvertisements");
        if (cachedAds) {
          const parsedAds = JSON.parse(cachedAds);
          if (Array.isArray(parsedAds)) setAds(parsedAds);
        }
      } catch {}
    }
  }, [pathname]);

  if (loading) return <LeftSidebarSkeleton />;

  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-2 sm:p-4 space-y-6">

      {ads.length > 0 && (
        <div className="w-full overflow-hidden rounded-md">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop
            slidesPerView={1}
          >
            {ads.map((ad) => (
              <SwiperSlide key={ad.id}>
                <Image
                  src={ad.image_url}
                  alt={ad.title || "Advertisement"}
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Cardapios Destaques
      </h3>

      <div className="space-y-2">
        {items.slice(0, 5).map((news, i) => (
          <Link
            href={
              news.category?.slug
                ? {
                    pathname: `/cardapio/${news.category.slug}`,
                    query: news.menus?.[0]?.id ? { menu_id: news.menus[0].id } : {},
                  }
                : "#"
            }
            key={news.id ?? i}
            className="flex items-center gap-3 p-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 overflow-hidden rounded-md flex-shrink-0">
              <Image
                src={
                  news.image ??
                  news.images?.[0] ??
                  "/images/swiper3.png"
                }
                alt={news.name ?? "Menu Item"}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {news.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {news.category?.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default LeftSidebar;
