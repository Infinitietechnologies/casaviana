"use client";
import Image from "next/image";
import { RightSidebarSkeleton } from "./Skeletons/CommonSkeletons";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../Api/interceptor";

const RightSidebar = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();

  const toggleSubmenu = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleRedirect = () => {
    router.push("/blogs");
  };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch directory categories
  const fetchDirectoryCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await api.get("/categories", {
        params: {
          include: "children",
          type: "directory",
        },
      });
      const data = res?.data?.data ?? res?.data ?? [];
      
      // Filter only root categories (parent_id is null)
      const rootCategories = Array.isArray(data)
        ? data.filter((category) => category.parent_id === null)
        : [];
      
      // Transform to match the existing menu structure
      const transformedCategories = rootCategories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        sub: category.children?.map((child) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
        })) || [],
      }));
      
      setMenuItems(transformedCategories);
    } catch (err) {
      console.error("Error fetching directory categories:", err);
      setMenuItems([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

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
    fetchDirectoryCategories();
    fetchTrendingEvents();
  }, []);

  if (categoriesLoading || loading) return <RightSidebarSkeleton />;

  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-4 bg-white z-20 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
        Directório
      </h2>

      <div className="flex flex-col gap-2">
        {menuItems.map((item, i) => (
          <div
            key={item.id || i}
            className="relative group"
            onMouseEnter={() => setOpenIndex(i)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            <button
              onClick={() => toggleSubmenu(i)}
              className="flex justify-between items-center bg-red-600 text-white font-semibold 
                px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 transition-colors 
                text-xs sm:text-sm w-full text-left truncate"
            >
              {item.name}
              {item.sub && item.sub.length > 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3 h-3 ml-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.646 11.854a.5.5 0 0 0 .708 0l4.146-4.147a.5.5 0 0 0-.708-.707L7 10.793 3.207 6.999a.5.5 0 1 0-.708.707l4.147 4.148z"
                  />
                </svg>
              )}
            </button>

            {item.sub && item.sub.length > 0 && openIndex === i && (
              <div
                className="hidden lg:block absolute left-[-210px] top-0 bg-[#8c181a] text-white 
                rounded-md p-2 w-52 z-50"
              >
                {item.sub.map((subItem, j) => (
                  <div
                    key={subItem.id || j}
                    onClick={handleRedirect}
                    className="px-3 py-2 hover:bg-red-800 rounded-md cursor-pointer text-sm whitespace-nowrap"
                  >
                    {subItem.name}
                  </div>
                ))}
              </div>
            )}

            {item.sub && item.sub.length > 0 && openIndex === i && (
              <div className="lg:hidden bg-[#8c181a] text-white rounded-md p-2 mt-1 z-20">
                {item.sub.map((subItem, j) => (
                  <div
                    key={subItem.id || j}
                    onClick={handleRedirect}
                    className="px-3 py-2 hover:bg-red-800 rounded-md cursor-pointer text-sm"
                  >
                    {subItem.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>


      <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Trending</h3>

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">No items found.</p>
        )}

        {items.slice(0, 4).map((news, i) => (
          <div
            key={news.id ?? i}
            className="flex items-center gap-3 p-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
            onClick={() => {
              if (news.slug) router.push(`/events/${news.slug}`);
              else handleRedirect();
            }}
          >
            <div className="w-16 h-16 overflow-hidden rounded-md border border-gray-200 flex-shrink-0 bg-gray-100">
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
                {news.event_date ?? news.created_at}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
