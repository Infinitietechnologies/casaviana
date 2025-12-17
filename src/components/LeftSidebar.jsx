"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import api from "../Api/interceptor";

const LeftSidebar = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrendingEvents = async () => {
    setLoading(true);
    try {
      let params = { 
        per_page: 10, 
        sort_by: "trending_score",
        sort_order: "desc" 
      };

      const res = await api.get("/events", { params });
      const data = res?.data?.data ?? res?.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching trending events:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingEvents();
  }, []);

  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-2 sm:p-4 space-y-6">
      <div className="w-full overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <Image
          src="/images/images_cms.png"
          alt="Advertisement"
          width={600}
          height={400}
          className="w-full h-auto object-contain"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">Trending</h3>

      <div className="space-y-2">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        {!loading &&
          items?.slice(0, 4).map((news, i) => (
            <div
              key={news.id ?? i}
              className="flex items-center gap-3 p-1 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="w-16 h-16 overflow-hidden rounded-md border border-gray-200 flex-shrink-0">
                <Image
                  src={
                    news.banner_image ??
                    news.images?.[0] ??
                    "/images/swiper3.png"
                  }
                  alt={news.title ?? "Event"}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {news.title}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                  >
                    <path d="M10 2a8 8 0 1 0 8 8A8.01 8.01 0 0 0 10 2Zm.75 8.25V5.75a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 .22.53l3 3a.75.75 0 1 0 1.06-1.06Z" />
                  </svg>
                  {news.event_date ? news.event_date : news.created_at}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="w-full overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <Image
          src="/images/dogq.jpg"
          alt="Advertisement"
          width={600}
          height={400}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default LeftSidebar;
