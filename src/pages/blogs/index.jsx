import React, { useState, useEffect } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { get_blogs } from "@/Api/api";

export default function BlogPage() {
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
      if (response && response.data) {
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
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 py-6 max-w-7xl">
          <div className="relative">
            <svg
              className="absolute left-4 top-3.5 text-slate-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Pesquisar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebars */}
      <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
          <LeftSidebar />

          {/* Center Section */}
          <div className="lg:col-span-8 py-4 md:py-6">
            {/* Blog Posts */}
            <div className="py-8">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-lg">
                    Carregando artigos...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 text-lg">{error}</p>
                </div>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post, idx) => (
                  <article
                    key={post.id}
                    className={`pb-12 ${
                      idx !== filteredPosts.length - 1
                        ? "border-b border-slate-200"
                        : ""
                    }`}
                  >
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">
                      {post.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-slate-700 mb-6 text-lg italic">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 mb-6 text-sm text-slate-600">
                      <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-slate-600">
                        ✍️
                      </div>
                      <span className="font-semibold text-slate-900">
                        by {post.author || "Author"}
                      </span>
                      <span>—</span>
                      <span>
                        {new Date(post.published_at).toLocaleDateString(
                          "pt-PT",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    </div>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags &&
                        post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    {/* Featured Image */}
                    {post.featured_image && (
                      <div className="mb-6">
                        <img
                          src={post.featured_image}
                          alt={post.excerpt}
                          className="w-full h-[34rem] object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src =
                              "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg";
                          }}
                        />
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-6 text-sm text-slate-600 border-b border-slate-200 pb-4">
                      {/* <span className="font-bold text-slate-900">
                        {post.view_count || 0}
                      </span>
                      <span>VIEWS</span> */}
                      {post.reading_time && (
                        <>
                          <span className="font-bold text-slate-900">
                            {post.reading_time}
                          </span>
                          <span>MIN READ</span>
                        </>
                      )}
                    </div>
                    {/* Content */}
                    <div className="prose prose-sm max-w-none mb-8">
                      <div className="flex gap-6 mb-6 p-4 bg-slate-50 rounded">
                        <div className="text-blue-600 font-bold text-2xl min-w-fit">
                          {/* {post.title.charAt(0).toUpperCase()} */}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed m-0">
                          {post.excerpt}
                        </p>
                      </div>

                      <div 
                        className="text-slate-700 leading-relaxed text-sm prose prose-slate prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-strong:text-slate-900"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>

                    {/* Engagement */}
                    {/* {post.allow_comments && (
                      <div className="flex items-center gap-6 text-sm text-slate-600 mb-6">
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          <span>Like</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <span>Comments</span>
                        </button>
                      </div>
                    )} */}

                    {/* Author Bio */}
                    {/* <div className="flex items-center gap-4 p-4 bg-slate-50 rounded">
                      <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
                        ✍️
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {post.author || "Author"}
                        </p>
                        <p className="text-sm text-slate-600">
                          Author bio and details
                        </p>
                      </div>
                    </div> */}
                  </article>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-lg">
                    Nenhum artigo encontrado.
                  </p>
                </div>
              )}
            </div>
          </div>

          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
