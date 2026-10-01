"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@heroui/react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { get_menu_items, get_restaurant_categories, get_menus } from "@/Api/api";
import { CardapioItemsSkeleton } from "@/components/Skeletons/CardapioSkeletons";
import MenuItemModal from "@/components/Modals/MenuItemModal";

const ITEMS_PER_PAGE = 15;

const CardapioItemsView = () => {
  const router = useRouter();
  const { isReady, query } = router;
  const { slug, menu_id } = query;
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [hoveredCard, setHoveredCard] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [resolvedMenuId, setResolvedMenuId] = useState(menu_id || null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Synchronization and Buffer Refs
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const nextBufferRef = useRef(null);
  const prefetchPromiseRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // Resolve Menu ID
  useEffect(() => {
    if (!isReady) return;

    if (menu_id) {
      setResolvedMenuId(menu_id);
      return;
    }

    const resolveDefaultMenu = async () => {
      try {
        const menusRes = await get_menus();
        if (menusRes?.success && Array.isArray(menusRes.data) && menusRes.data.length > 0) {
          const defaultMenu = menusRes.data.find((m) => m.is_default) || menusRes.data[0];
          setResolvedMenuId(defaultMenu.id);
        } else {
          setResolvedMenuId(1);
        }
      } catch (err) {
        console.error("Error resolving menu ID:", err);
        setResolvedMenuId(1);
      }
    };

    resolveDefaultMenu();
  }, [isReady, menu_id]);

  // Background Prefetcher for subsequent page
  const prefetchNextPage = useCallback(async (targetPage, activeCategorySlug, activeMenuId) => {
    if (!hasMoreRef.current || !activeCategorySlug || !activeMenuId) return;

    try {
      const promise = get_menu_items({
        category_slug: activeCategorySlug,
        menu_id: activeMenuId,
        page: targetPage,
        per_page: ITEMS_PER_PAGE,
      });

      prefetchPromiseRef.current = promise;
      const res = await promise;

      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        const meta = res.meta;
        const moreAvailable = meta
          ? meta.current_page < meta.last_page && Boolean(meta.next_page_url)
          : res.data.length === ITEMS_PER_PAGE;

        nextBufferRef.current = {
          page: targetPage,
          data: res.data,
          hasMore: moreAvailable,
        };
      } else {
        nextBufferRef.current = {
          page: targetPage,
          data: [],
          hasMore: false,
        };
      }
    } catch (err) {
      console.error("Background prefetch error:", err);
      nextBufferRef.current = null;
    } finally {
      prefetchPromiseRef.current = null;
    }
  }, []);

  // Initial Load (Parallel Fetch)
  useEffect(() => {
    if (!isReady || !slug || !resolvedMenuId) return;

    let isMounted = true;
    nextBufferRef.current = null;
    prefetchPromiseRef.current = null;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setMenuItems([]);
        setPage(1);
        pageRef.current = 1;
        setHasMore(true);
        hasMoreRef.current = true;

        const [menuResponse, categoriesResponse] = await Promise.all([
          get_menu_items({
            category_slug: slug,
            menu_id: resolvedMenuId,
            page: 1,
            per_page: ITEMS_PER_PAGE,
          }),
          get_restaurant_categories(),
        ]);

        if (!isMounted) return;

        let resolvedCategory = null;
        if (categoriesResponse?.success && categoriesResponse?.data?.children) {
          const allActive = categoriesResponse.data.children.filter(
            (cat) => cat.status === "active"
          );
          setCategories(allActive);
          resolvedCategory = allActive.find((cat) => cat.slug === slug);
        }

        if (menuResponse?.success && Array.isArray(menuResponse.data)) {
          const items = menuResponse.data;
          setMenuItems(items);

          if (!resolvedCategory && items.length > 0 && items[0].category) {
            resolvedCategory = items[0].category;
          }
          setCategory(resolvedCategory || { name: slug });

          const meta = menuResponse.meta;
          const moreAvailable = meta
            ? meta.current_page < meta.last_page && Boolean(meta.next_page_url)
            : items.length === ITEMS_PER_PAGE;

          setHasMore(moreAvailable);
          hasMoreRef.current = moreAvailable;

          if (moreAvailable) {
            prefetchNextPage(2, slug, resolvedMenuId);
          }
        } else {
          setCategory(resolvedCategory);
          setMenuItems([]);
          setHasMore(false);
          hasMoreRef.current = false;
        }
      } catch (error) {
        console.error("Error during initial cardapio load:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [isReady, slug, resolvedMenuId, prefetchNextPage]);

  // Append next batch (uses buffer or fetches immediately)
  const loadNextBatch = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreRef.current || !slug || !resolvedMenuId) {
      return;
    }

    const targetPage = pageRef.current + 1;

    // Fast-path: Buffer is ready
    if (nextBufferRef.current && nextBufferRef.current.page === targetPage) {
      const buffer = nextBufferRef.current;
      nextBufferRef.current = null;

      if (buffer.data && buffer.data.length > 0) {
        setMenuItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = buffer.data.filter((item) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });

        setPage(targetPage);
        pageRef.current = targetPage;
        setHasMore(buffer.hasMore);
        hasMoreRef.current = buffer.hasMore;

        if (buffer.hasMore) {
          prefetchNextPage(targetPage + 1, slug, resolvedMenuId);
        }
        return;
      } else {
        setHasMore(false);
        hasMoreRef.current = false;
        return;
      }
    }

    // Network path: Fetch or await active prefetch
    try {
      isFetchingRef.current = true;
      setLoadingMore(true);

      let res;
      if (prefetchPromiseRef.current) {
        res = await prefetchPromiseRef.current;
      } else {
        res = await get_menu_items({
          category_slug: slug,
          menu_id: resolvedMenuId,
          page: targetPage,
          per_page: ITEMS_PER_PAGE,
        });
      }

      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        const newItems = res.data;
        setMenuItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = newItems.filter((item) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });

        setPage(targetPage);
        pageRef.current = targetPage;

        const meta = res.meta;
        const moreAvailable = meta
          ? meta.current_page < meta.last_page && Boolean(meta.next_page_url)
          : newItems.length === ITEMS_PER_PAGE;

        setHasMore(moreAvailable);
        hasMoreRef.current = moreAvailable;

        if (moreAvailable) {
          prefetchNextPage(targetPage + 1, slug, resolvedMenuId);
        }
      } else {
        setHasMore(false);
        hasMoreRef.current = false;
      }
    } catch (error) {
      console.error("Error loading next batch:", error);
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  }, [slug, resolvedMenuId, prefetchNextPage]);

  // Callback Ref for Sentinel: Attaches Immediately When DOM Node Mounts
  const sentinelCallbackRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
              loadNextBatch();
            }
          },
          {
            root: null,
            rootMargin: "700px",
            threshold: 0,
          }
        );
        observerRef.current.observe(node);
      }
    },
    [loadNextBatch]
  );

  // Passive Window Scroll Listener Fallback (Double Guarantee)
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMoreRef.current || isFetchingRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 700) {
        loadNextBatch();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadNextBatch]);

  const handleQuickView = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleCategoryChange = (newSlug) => {
    if (newSlug === slug) return;
    router.push(`/cardapio/${newSlug}${resolvedMenuId ? `?menu_id=${resolvedMenuId}` : ""}`);
  };

  if (loading) {
    return <CardapioItemsSkeleton />;
  }

  if (!category && menuItems.length === 0) {
    return (
      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen mt-20 sm:mt-20 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          <div className="lg:col-span-2 order-3 lg:order-1">
            <LeftSidebar />
          </div>
          <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col items-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 order-1 lg:order-2 rounded-2xl shadow-xl">
            <div className="w-full px-4 md:px-6 max-w-[1400px] mx-auto text-center py-12">
              <p className="text-white text-xl font-medium mb-4">
                {t("cardapio.categoryNotFound")}
              </p>
              <Link
                href="/cardapio"
                className="inline-block bg-white text-red-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
              >
                ← {t("cardapio.title") || "Voltar ao Cardápio"}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 order-2 lg:order-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${category?.name || slug} - ${t("cardapio.title")} | Casa Viana`}</title>
        <meta
          name="description"
          content={`Cardápio de ${category?.name || slug} na Casa Viana.`}
        />
      </Head>

      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen mt-20 sm:mt-20 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          {/* Left Sidebar */}
        <div className="lg:col-span-2 order-3 lg:order-1">
          <LeftSidebar />
        </div>

        {/* Center Content Area */}
        <div className="lg:col-span-8 py-6 px-4 md:px-8 flex flex-col items-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 order-1 lg:order-2 rounded-2xl shadow-xl min-h-[85vh]">
          <div className="w-full max-w-[1400px] mx-auto">
            {/* Header: Title and Back Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-white/20 pb-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/cardapio"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition flex items-center justify-center w-9 h-9"
                  title="Voltar ao Cardápio"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide uppercase">
                  {category?.name || slug}
                </h1>
              </div>

              {menuItems.length > 0 && (
                <span className="text-xs md:text-sm bg-black/30 text-white/90 px-3 py-1 rounded-full border border-white/10 font-medium">
                  {menuItems.length} {t("cardapio.title") || "itens"}
                </span>
              )}
            </div>

            {/* Quick Category Switcher Tabs */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                {categories.map((cat) => {
                  const isActive = cat.slug === slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition shadow-sm ${
                        isActive
                          ? "bg-white text-red-600 shadow-md scale-105"
                          : "bg-black/25 text-white hover:bg-black/40"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {menuItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 text-white/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <p className="text-white text-lg font-medium">
                  {t("cardapio.noItemsFound")}
                </p>
              </div>
            ) : (
              <>
                {/* Main Grid - Smooth Card Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {menuItems.map((item, idx) => (
                    <CardapioItemCard
                      key={item.id}
                      item={item}
                      idx={idx}
                      hoveredCard={hoveredCard}
                      setHoveredCard={setHoveredCard}
                      onQuickView={handleQuickView}
                      t={t}
                    />
                  ))}
                </div>

                {/* Pre-trigger Sentinel: connected via Callback Ref to attach immediately */}
                <div ref={sentinelCallbackRef} className="h-6 w-full pointer-events-none" />

                {/* Subtle Non-intrusive Background Indicator */}
                {loadingMore && (
                  <div className="flex justify-center items-center py-4 w-full">
                    <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-sm px-5 py-2 rounded-full text-white/90 text-xs font-medium border border-white/10 animate-pulse">
                      <div className="w-3.5 h-3.5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                      <span>{t("cardapio.loadingMore")}</span>
                    </div>
                  </div>
                )}

                {/* End of Feed Indicator */}
                {!hasMore && menuItems.length > 0 && (
                  <div className="text-center py-8 text-white/90 text-sm">
                    <div className="inline-flex items-center gap-2 bg-black/30 px-6 py-2.5 rounded-full border border-white/10 shadow-sm backdrop-blur-sm">
                      <span className="text-amber-300">✦</span>
                      <span>{t("cardapio.endOfMenu")}</span>
                      <span className="text-amber-300">✦</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-2 order-2 lg:order-3">
          <RightSidebar />
        </div>
      </div>

      {/* Quick View Modal */}
      <MenuItemModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedItem={selectedItem}
      />
    </div>
    </>
  );
};

const CardapioItemCard = ({ item, idx, hoveredCard, setHoveredCard, onQuickView, t }) => {
  const defaultFallback = "/cardapio/default.png";
  const [imgSrc, setImgSrc] = useState(item.image || item.images?.[0] || defaultFallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(item.image || item.images?.[0] || defaultFallback);
    setHasError(false);
  }, [item.image, item.images]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(defaultFallback);
    }
  };

  return (
    <div
      className="relative overflow-hidden transition-all duration-300 cursor-pointer group rounded-xl shadow-lg bg-black/20 backdrop-blur-sm border border-white/10 hover:shadow-2xl hover:-translate-y-1 transform-gpu"
      onMouseEnter={() => setHoveredCard(item.id)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={() => onQuickView(item)}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-900">
        <Image
          src={imgSrc}
          alt={item.name}
          width={400}
          height={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={idx < 6 ? "eager" : "lazy"}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top badges: Prep Time & Price */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10 pointer-events-none">
          {item.prep_time ? (
            <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
              ⏱ {item.prep_time} min
            </span>
          ) : <span />}
          <span className="bg-red-600/90 backdrop-blur-md text-white text-xs md:text-sm px-2.5 py-1 rounded-full font-bold shadow">
            {item.formatted_price}
          </span>
        </div>
      </div>

      {/* Item Details Overlay on Hover */}
      <div
        className={`absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black/75 px-4 transition-opacity duration-300 ${
          hoveredCard === item.id ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <h3 className="font-bold text-base md:text-lg mb-1">
          {item.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-200 line-clamp-3 mb-2">
          {item.short_description || item.description || ""}
        </p>
        <p className="text-base font-extrabold text-amber-300">
          {item.formatted_price}
        </p>
      </div>

      {/* Always Visible Bottom Bar with item name */}
      <div className="p-3 bg-neutral-900/80 backdrop-blur-sm border-t border-white/5 flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm truncate pr-2">
          {item.name}
        </h3>
        <button
          type="button"
          className="text-xs bg-white/20 hover:bg-white text-white hover:text-neutral-900 px-2.5 py-1 rounded transition font-medium whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(item);
          }}
        >
          {t("cardapio.quickView")} 👁
        </button>
      </div>
    </div>
  );
};

export default CardapioItemsView;
