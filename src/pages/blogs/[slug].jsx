import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get_blog } from "@/Api/api";
import Rating from "@/components/Rating/Rating";

const BlogDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await get_blog(slug);
        if (response?.success) {
          setBlog(response.data);
          setError(null);
        } else {
          setError(response?.error || "Erro ao buscar artigo");
          setBlog(null);
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar artigo");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div>Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div>Artigo não encontrado.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-28">
        {blog.featured_image && (
          <div className="mb-6 rounded overflow-hidden">
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-[40rem] object-cover rounded-lg shadow-md"
              onError={(e) =>
                (e.target.src = "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg")
              }
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-slate-900 mb-3">{blog.title}</h1>
        <div className="text-sm text-slate-600 mb-6">
          {blog.author && (
            <span className="font-semibold">
              {typeof blog.author === "string"
                ? blog.author
                : blog.author?.name ||
                  blog.author?.username ||
                  blog.author?.email ||
                  "Author"}
            </span>
          )}
          {blog.published_at && (
            <span className="ml-2">
              {new Date(blog.published_at).toLocaleDateString("pt-PT", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        <div
          className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Rating slug={slug} resource="blog" />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
