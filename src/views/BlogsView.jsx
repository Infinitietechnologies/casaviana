import React, { useState, useEffect } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Link from "next/link";
import { get_blogs } from "@/Api/api";

import { BlogsPageSkeleton } from "@/components/Skeletons/BlogsSkeletons";

const BlogsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await get_blogs();
      if (response?.data) {
        setBlogPosts(response.data);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load blogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = blogPosts.filter((post) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Search Bar */}
      <div className="border-b border-slate-200 sticky top-0 z-10 bg-white">
        <div className="mx-auto px-4 py-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto px-4 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <LeftSidebar />

          {/* Blog List */}
          <div className="lg:col-span-8 py-6">
            {loading ? (
              <BlogsPageSkeleton />
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : filteredPosts.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug || post.id}`}
                    className="group block rounded-md overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <img
                      src={
                        post.featured_image ||
                        "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg"
                      }
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                      onError={(e) =>
                        (e.target.src =
                          "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg")
                      }
                    />

                    <div className="p-6 flex flex-col flex-grow">
                      {post.category && (
                        <Chip className="text-xs font-medium text-red-600 bg-red-50 mb-3">
                          {post.category.name}
                        </Chip>
                      )}

                      <Link href={`/blogs/${post.slug}`}>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 hover:text-red-600 transition-colors">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {post.excerpt || "No excerpt available."}
                      </p>

                      <div className="flex items-center text-sm text-slate-500 mt-auto">
                        {post.published_at && (
                          <span>
                            {new Date(post.published_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        )}
                        {post.reading_time && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{post.reading_time} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-600">
                Nenhum artigo encontrado.
              </p>
            )}
          </div>

          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default BlogsView;
