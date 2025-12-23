"use client";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { get_menus, get_menu_details } from "@/Api/api";
import { CardapioCategoriesSkeleton } from "@/components/Skeletons/CardapioSkeletons";

const CardapioView = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await get_menus();
        if (response?.success && Array.isArray(response.data)) {
          // Show all menus for now as requested
          const allMenus = response.data;
          setMenus(allMenus);

          // Find default menu, or pick the first one
          const defaultMenu = allMenus.find((m) => m.is_default) || allMenus[0];
          if (defaultMenu) {
            setSelectedMenu(defaultMenu);
          }
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    if (!selectedMenu) return;

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await get_menu_details(selectedMenu.slug);
        if (response?.success && response?.data?.categories) {
          setCategories(response.data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories for menu:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [selectedMenu]);

  const handleClick = (category_slug) => {
    if (category_slug && selectedMenu) {
      router.push(`/cardapio/${category_slug}?menu_id=${selectedMenu.id}`);
    } else if (category_slug) {
      router.push(`/cardapio/${category_slug}`);
    }
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };

  if (loading) {
    return <CardapioCategoriesSkeleton />;
  }

  return (
    <>
      <div className="mx-auto py-4 md:py-0 px-2 sm:px-4 mt-20 sm:mt-24"></div>

      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          <LeftSidebar />

          <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center">
            {/* Menus Section */}
            {menus.length > 0 && (
              <div className="flex flex-wrap justify-center items-center w-full px-4 md:px-6 mb-10 gap-3">
                {menus.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => handleMenuSelect(menu)}
                    className={`${
                      selectedMenu?.id === menu.id ? "bg-red-600" : "bg-gray-400"
                    } text-white font-bold text-lg px-6 py-3 rounded-md shadow hover:opacity-90 transition w-full sm:w-auto`}
                  >
                    {menu.name}
                  </button>
                ))}
              </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 w-full px-4 max-w-[1400px] mx-auto">
              {categoriesLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="flex flex-col items-center rounded transition">
                    <div className="flex flex-col items-center w-full">
                      <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-200 rounded animate-pulse">
                        <div className="w-full h-full bg-gray-300" />
                      </div>
                      <div className="mt-3 w-full h-6 bg-gray-300 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : categories.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600 font-semibold">{t("cardapio.noCategoriesAvailable")}</p>
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleClick(cat.slug)}
                    className="flex flex-col items-center rounded transition cursor-pointer"
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-100 rounded">
                        <Image
                          src={cat.image || "/cardapio/default.png"}
                          alt={cat.name}
                          width={380}
                          height={192}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="mt-3 bg-red-600 text-white font-semibold text-sm text-center w-full py-1 rounded-sm">
                        {cat.name}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <RightSidebar />
        </div>
      </div>
    </>
  );
};

export default CardapioView;
