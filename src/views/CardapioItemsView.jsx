"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@heroui/react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import { get_menu_items, get_restaurant_categories } from "@/Api/api";
import { CardapioItemsSkeleton } from "@/components/Skeletons/CardapioSkeletons";
import MenuItemModal from "@/components/Modals/MenuItemModal";

const CardapioItemsView = () => {
  const router = useRouter();
  const { slug, menu_id } = router.query;
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // First, get all categories to find the one matching the slug
        const categoriesResponse = await get_restaurant_categories();
        if (categoriesResponse?.success && categoriesResponse?.data?.children) {
          const foundCategory = categoriesResponse.data.children.find(
            (cat) => cat.slug === slug && cat.status === "active"
          );

          if (foundCategory) {
            setCategory(foundCategory);
            // Now fetch menu items for this category and optionally this menu
            const menuResponse = await get_menu_items(foundCategory.id, menu_id);
            if (menuResponse?.success && menuResponse?.data) {
              setMenuItems(menuResponse.data);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, menu_id]);

  const handleQuickView = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  if (loading) {
    return <CardapioItemsSkeleton />;
  }

  if (!category) {
    return (
      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen mt-20 sm:mt-20 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          <LeftSidebar />
          <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600">
            <div className="w-full px-4 md:px-6 max-w-[1400px] mx-auto">
              <div className="text-center py-8">
                <p className="text-white text-lg">
                  {t("cardapio.categoryNotFound")}
                </p>
              </div>
            </div>
          </div>
          <RightSidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen mt-20 sm:mt-20 mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
        <LeftSidebar />

        <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600">
          <div className="w-full px-4 md:px-6 max-w-[1400px] mx-auto">
            {/* Empty State */}
            {menuItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white text-lg">
                  {t("cardapio.noItemsFound")}
                </p>
              </div>
            ) : (
              <>
                {/* Main Grid - Large cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative overflow-hidden transition-all duration-500 cursor-pointer group rounded-lg"
                      onMouseEnter={() => setHoveredCard(item.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handleQuickView(item)}
                    >
                      <div className="relative">
                        <Image
                          src={
                            item.image ||
                            item.images?.[0] ||
                            "/cardapio/default.png"
                          }
                          alt={item.name}
                          width={400}
                          height={400}
                          className="w-full h-auto object-cover transition-transform duration-500"
                        />
                      </div>

                      <div
                        className={`absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black/50 px-2 transition-opacity duration-500 ${
                          hoveredCard === item.id ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <h3 className="font-semibold text-sm md:text-base">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-200">
                          {item.short_description || item.description || ""}
                        </p>
                        <p className="text-sm font-bold mt-1">
                          {item.formatted_price}
                        </p>
                        {item.prep_time && (
                          <p className="text-xs text-gray-300 mt-1">
                            {item.prep_time} min
                          </p>
                        )}
                      </div>

                      {/* Quick View Bar */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-center text-sm font-medium py-2 transition-transform duration-500 cursor-pointer ${
                          hoveredCard === item.id
                            ? "translate-y-0"
                            : "translate-y-full"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickView(item);
                        }}
                      >
                        {t("cardapio.quickView")} 👁
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Quick View Modal */}
      <MenuItemModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default CardapioItemsView;
