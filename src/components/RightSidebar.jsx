"use client";
import Image from "next/image";
import { RightSidebarSkeleton } from "./Skeletons/CommonSkeletons";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import api from "../Api/interceptor";
import { get_blogs, get_categories } from "@/Api/api";

const RightSidebar = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();
  const pathname = usePathname();


  const toggleSubmenu = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleSectionClick = (parentSlug, childSlug = null) => {
    // If it's a child category (subcategory), use that slug
    // If it's a parent category, use the parent slug
    const targetSlug = childSlug || parentSlug;
    router.push(`/blogs?category_slug=${targetSlug}`);
  };





  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [blogsLoading, setBlogsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const fetchFeaturedBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await get_blogs(
        null,
        null,
      );

      const data = res?.data ?? [];

      const featuredBlogs = data.filter(
        (blog) => blog.is_featured || blog.featured
      );

      const finalBlogs = featuredBlogs.length ? featuredBlogs : data;
      setBlogs(finalBlogs);
      try {
        localStorage.setItem("featuredBlogs", JSON.stringify(finalBlogs));
      } catch { }
    } catch (err) {
      console.error("Error fetching featured blogs:", err);
      setBlogs([]);
    } finally {
      setBlogsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await get_categories(null, null, 'blog');
      const data = res?.data ?? [];

      // store first 5 with children only to state
      const topCategories = data
        .filter(cat => cat.is_root);

      setCategories(topCategories);
      try {
        localStorage.setItem("categories", JSON.stringify(data));
      } catch { }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    console.log(pathname);

    if (blogs != null && categories != null) {
      fetchFeaturedBlogs();
      fetchCategories();
    } else {
      try {
        const cached = localStorage.getItem("featuredBlogs");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) setBlogs(parsed);
        }
      } catch { }
    }
  }, [pathname]);

  if (categoriesLoading) return <RightSidebarSkeleton />;

  return (
    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start p-4 bg-white z-20 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">
        {t("sidebar.right.directory_title")}
      </h2>

      <div className="flex flex-col gap-2">
        {categories.map((category, i) => (
          <div
            key={category.id || i}
            className="relative group"
            onMouseEnter={() => setOpenIndex(i)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            <button
              onClick={() => handleSectionClick(category.slug)}
              className="flex justify-between items-center bg-red-600 text-white font-semibold 
                px-3 sm:px-4 py-2 rounded-md hover:bg-red-700 transition-colors 
                text-lg sm:text-md w-full text-left truncate"
            >
              {category.name}
              {category.children && category.children.length > 0 && (
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

            {category.children && category.children.length > 0 && openIndex === i && (
              <div
                className="hidden lg:block absolute left-[-210px] top-0 bg-[#8c181a] text-white 
                rounded-md p-2 w-52 z-50"
              >
                {category.children.map((child, j) => (
                  <div
                    key={child.id || j}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionClick(category.slug, child.slug);
                    }}
                    className="px-3 py-2 hover:bg-red-800 rounded-md cursor-pointer text-sm whitespace-nowrap"
                  >
                    {child.name}
                  </div>
                ))}
              </div>
            )}

            {category.children && category.children.length > 0 && openIndex === i && (
              <div className="lg:hidden bg-[#8c181a] text-white rounded-md p-2 mt-1 z-20">
                {category.children.map((child, j) => (
                  <div
                    key={child.id || j}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionClick(category.slug, child.slug);
                    }}
                    className="px-3 py-2 hover:bg-red-800 rounded-md cursor-pointer text-sm"
                  >
                    {child.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
        {t("sidebar.right.recent_posts_title")}
      </h3>

      <div className="space-y-2">
        {blogs.length === 0 && (
          <p className="text-sm text-gray-500">{t("sidebar.right.no_blogs")}</p>
        )}

        {blogs.slice(0, 4).map((blog, i) => (
          <div
            key={blog.id ?? i}
            className="flex items-center gap-3 p-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
            onClick={() => router.push(`/blogs/${blog.slug}`)}
          >
            <div className="w-16 h-16 overflow-hidden rounded-md border border-gray-200 flex-shrink-0 bg-gray-100">
              <Image
                src={blog.featured_image ?? "/images/swiper3.png"}
                alt={blog.title}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {blog.title}
              </p>
              <p className="text-xs text-gray-500 truncate">{blog.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
