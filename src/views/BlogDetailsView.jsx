import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { get_blog } from "@/Api/api";
import dynamic from "next/dynamic";
import Link from "next/link";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Chip } from "@heroui/react";

const Rating = dynamic(() => import("@/components/Rating/Rating"), {
  ssr: false,
});

const Comment = dynamic(() => import("@/components/Comment/Comment"), {
  ssr: false,
});

import { BlogDetailsSkeleton } from "@/components/Skeletons/BlogsSkeletons";

const BlogDetailsView = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
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
          setRelatedPosts(Object.values(response.related_posts || {}));
          setError(null);
        } else {
          setError(response?.error || "Error fetching article");
          setBlog(null);
          setRelatedPosts([]);
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching article");
        setBlog(null);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return <BlogDetailsSkeleton />;

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
        <div>Article not found.</div>
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
        <div className="text-sm text-slate-600 mb-6 flex flex-wrap items-center gap-2">
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
            <>
              <span className="mx-2">•</span>
              <span>
                {new Date(blog.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </>
          )}
          {blog.reading_time && (
            <>
              <span className="mx-2">•</span>
              <span>{blog.reading_time} min read</span>
            </>
          )}
          {blog.category && (
            <>
              <span className="mx-2">•</span>
              <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                {blog.category.name}
              </span>
            </>
          )}
        </div>

        <div
          className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">
              Related Posts
            </h2>

            {relatedPosts.length <= 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((post) => (
                  <RelatedPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="related-posts-swiper"
              >
                {relatedPosts.map((post) => (
                  <SwiperSlide key={post.id}>
                    <RelatedPostCard post={post} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </section>
        )}

        <div className="mt-20 pt-8 border-t border-gray-200">
          <Rating slug={slug} resource="blog" />
          <div className="mt-8">
            <Comment slug={slug} resource="blog" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable card component for related posts
const RelatedPostCard = ({ post }) => (
  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
    {post.featured_image ? (
      <Link href={`/blogs/${post.slug}`}>
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-64 object-cover"
          onError={(e) =>
            (e.target.src = "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg")
          }
        />
      </Link>
    ) : (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No image</span>
      </div>
    )}

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
            {new Date(post.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
  </article>
);

export default BlogDetailsView;
