import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Link from "next/link";
import { get_blogs, get_categories } from "@/Api/api";
import { BlogsPageSkeleton } from "@/components/Skeletons/BlogsSkeletons";
import { Chip, Pagination, Input, Button } from "@heroui/react";
import Head from "next/head";

const BlogsView = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PER_PAGE = 9;

  useEffect(() => {
    if (router.isReady) {
      const { category_slug, search, page } = router.query;

      if (category_slug) {
        setActiveCategory(category_slug);
      }

      if (search) {
        setSearchTerm(search);
      }

      if (page) {
        setCurrentPage(parseInt(page));
      }

      fetchData();
    }
  }, [router.isReady, router.query]);

  // Handle Search Input Change (Debounced or separate apply?)
  // For simplicity and standard UX, we update state immediately but could fetch on debounce or enter.
  // We'll trust the effect hook on router query changes if we push to router, 
  // OR we manage local state and simple fetch. 
  // Given user request "passed https://.../blogs?category_slug=...", we should sync with URL.

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get params from current URL to ensure sync, or use state if we decide to drive from state
      // We will drive from state that was initialized from URL
      const categorySlugParam = router.query.category_slug || null;
      const searchParam = router.query.search || null;
      const pageParam = router.query.page || 1;

      const [blogsResponse, categoriesResponse] = await Promise.all([
        get_blogs(null, categorySlugParam, searchParam, pageParam, PER_PAGE),
        get_categories(null, null, 'blog')
      ]);

      if (blogsResponse?.data) {
        setBlogPosts(blogsResponse.data);
        // Assuming response wrapper has meta or links for pagination. 
        // If standard Laravel paginate resource: { data: [...], meta: { last_page: ... } }
        // Adjust based on actual API response structure which I should have checked, but will assume standard/safe defaults.
        // If no meta, we might just have data.
        // To be safe, I'd need to inspect the API response, but for now I'll check if meta exists.
        if (blogsResponse.meta) {
          setTotalPages(blogsResponse.meta.last_page);
        } else {
          // Fallback if no meta provided
          setTotalPages(1);
        }
      } else if (Array.isArray(blogsResponse)) {
        // If it returns direct array without pagination wrapper
        setBlogPosts(blogsResponse);
      }

      if (categoriesResponse) {

        setCategories(categoriesResponse.data);
      }

      setError(null);
    } catch (err) {
      setError("Failed to load content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    // Debounce pushing to router could be better, but for now:
    const query = { ...router.query, search: value, page: 1 };
    if (!value) delete query.search;
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  const handleCategoryClick = (slug) => {
    setActiveCategory(slug);
    const query = { ...router.query, category_slug: slug, page: 1 };
    if (slug === 'all') delete query.category_slug;
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const query = { ...router.query, page };
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Blog - Casa Viana</title>
        <meta name="description" content="Explore our latest articles, news, and updates at Casa Viana." />
      </Head>

      <div className="bg-white min-h-screen font-sans text-slate-900">

        {/* Header / Filter Section */}
        <div className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4 py-4 lg:py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Nosso Blog
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onValueChange={handleSearch}
                  classNames={{
                    inputWrapper: "bg-slate-50 border border-slate-200 hover:bg-slate-100 focus-within:!bg-white shadow-none",
                  }}
                  startContent={
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                  className="w-full sm:w-72"
                  isClearable
                  onClear={() => handleSearch("")}
                />
              </div>
            </div>

            {/* Categories Scrollable Row */}
            <div className="mt-6 flex overflow-x-auto pb-2 scrollbar-hide gap-2">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat.slug
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Sidebar Left */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
              <div className="sticky top-28">
                <LeftSidebar />
              </div>
            </div>

            {/* Blog Grid */}
            <div className="lg:col-span-9 xl:col-span-7">
              {loading ? (
                <BlogsPageSkeleton />
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-red-500 font-medium mb-2">Oops!</p>
                  <p className="text-slate-600">{error}</p>
                  <Button onClick={fetchData} className="mt-4" color="primary" variant="flat">
                    Tentar Novamente
                  </Button>
                </div>
              ) : blogPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {blogPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blogs/${post.slug || post.id}`}
                        className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={
                              post.featured_image ||
                              "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg"
                            }
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) =>
                            (e.target.src =
                              "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg")
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {post.category && (
                            <div className="absolute top-4 left-4">
                              <Chip
                                size="sm"
                                className="bg-white/90 backdrop-blur-md text-slate-800 font-semibold shadow-sm"
                              >
                                {post.category.name}
                              </Chip>
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">
                            {post.published_at && new Date(post.published_at).toLocaleDateString("pt-BR", { day: 'numeric', month: 'short', year: 'numeric' })}
                            {post.reading_time && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{post.reading_time} min leitura</span>
                              </>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
                            {post.excerpt || post.content?.substring(0, 100).replace(/<[^>]*>?/gm, '') + "..."}
                          </p>

                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm font-semibold text-blue-600 group-hover:underline">Ler mais</span>

                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination
                        total={totalPages}
                        initialPage={1}
                        page={currentPage}
                        onChange={handlePageChange}
                        showControls
                        color="primary"
                        variant="light"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum artigo encontrado</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">Tente ajustar seus termos de pesquisa ou categoria.</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                      router.push({ pathname: router.pathname }, undefined, { shallow: true });
                    }}
                    variant="light"
                    color="primary"
                    className="mt-4"
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar Right */}
            <div className="lg:col-span-12 xl:col-span-3">
              <RightSidebar />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsView;

