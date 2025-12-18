"use client";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { get_restaurant_categories } from "@/Api/api";
import { CardapioCategoriesSkeleton } from "@/components/Skeletons/CardapioSkeletons";

const CardapioView = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await get_restaurant_categories();
        if (response?.success && response?.data?.children) {
          // Filter only active categories and map to the required format
          const activeCategories = response.data.children
            .filter((cat) => cat.status === "active")
            .map((cat) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
              image: cat.image_url || "/cardapio/default.png",
            }));
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (slug) => {
    if (slug) {
      router.push(`/cardapio/${slug}`);
    }
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
            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 md:px-6 mb-10 gap-3 sm:gap-0">
              <Link href="/cardapio">
                <button className="bg-red-600 text-white font-bold text-lg px-6 py-3 rounded-md shadow hover:bg-red-700 transition w-full sm:w-auto">
                  {t("cardapio.casaViana")}
                </button>
              </Link>
              <Link href="/dipanda-plaza">
                <span className="bg-gray-400 text-white font-bold text-lg px-6 py-3 rounded-md shadow hover:bg-gray-500 transition w-full sm:w-auto">
                  {t("cardapio.dipandaPlaza")}
                </span>
              </Link>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 w-full px-4 max-w-[1400px] mx-auto">
              {categories.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">{t("cardapio.noCategoriesAvailable")}</p>
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleClick(cat.slug)}
                    className="flex flex-col items-center rounded transition cursor-pointer"
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center">
                        <Image
                          src={cat.image}
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
