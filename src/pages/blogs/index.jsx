import React, { useState } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const blogPosts = [
    {
      id: 1,
      title: "A nova era do Comércio Digital em Angola",
      excerpt:
        "Como surgiu o marketplace multissetorial que está a impulsionar empreendedores, comerciantes e consumidores de todo o país.",
      category: "Gaming",
      breadcrumb: "Home / Entertainment / Gaming",
      author: "Himmanuel Kangombe",
      date: "Agosto 2, 2025",
      tags: ["Startups", "Mobile", "Musth", "Reobots", "Startup"],
      image: "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg", // Updated to image URL
      shares: 47,
      views: 1200,
      likes: 0,
      comments: 0,
      rating: 8.2,
      content: `Como surgiu o marketplace multissetorial que está a impulsionar empreendedores, comerciantes e consumidores de todo o país.

Recapitulate the popularization of the "ideal measure" has led to advise such as "Increase font size for large screens" and select font-size from font list on some sites. This guideline does include discussion on scaling...

Stretch lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine.`,
      review: {
        pros: [
          "Good low light camera",
          "Water resistant",
          "Double the internal capacity",
        ],
        cons: [
          "Lacks clear upgrades",
          "Same design used for last three phones",
          "Battery life unimpressive",
        ],
      },
      breakdown: [
        { label: "Design", score: 9 },
        { label: "Performance", score: 8 },
        { label: "Camera", score: 9 },
        { label: "Battery", score: 7 },
        { label: "Price", score: 8 },
      ],
    },
    {
      id: 2,
      title: "The Legend of Zelda",
      excerpt:
        "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.",
      category: "Web Design",
      breadcrumb: "Home / Gaming / Review",
      author: "Maria Santos",
      date: "Julho 15, 2025",
      tags: ["WordPress", "Design", "Theme", "2017"],
      image: "/images/D.PRO-POST-no-Ponto-02s-750x375.jpg", // Updated to image URL
      shares: 32,
      views: 856,
      likes: 12,
      comments: 5,
      rating: 8.5,
      content: `A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart...`,
      review: {
        pros: ["Engaging gameplay", "Beautiful graphics", "Great storyline"],
        cons: [
          "Performance issues",
          "High price point",
          "Limited customization",
        ],
      },
      breakdown: [
        { label: "Gameplay", score: 9 },
        { label: "Graphics", score: 8 },
        { label: "Story", score: 9 },
        { label: "Audio", score: 8 },
        { label: "Value", score: 7 },
      ],
    },
  ];

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
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, idx) => (
                  <article
                    key={post.id}
                    className={`pb-12 ${
                      idx !== filteredPosts.length - 1
                        ? "border-b border-slate-200"
                        : ""
                    }`}
                  >
                    {/* Breadcrumb */}
                    <div className="text-sm text-slate-500 mb-4">
                      {post.breadcrumb}
                    </div>

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
                        {post.image.split("/").pop().split(".")[0]}{" "}
                        {/* Fallback to emoji or initial if needed */}
                      </div>
                      <span className="font-semibold text-slate-900">
                        by {post.author}
                      </span>
                      <span>—</span>
                      <span>{post.date}</span>
                    </div>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Featured Image */}
                    <div className="mb-6">
                      <img
                        src={post.image}
                        alt={post.excerpt}
                        className="w-full h-[34rem] object-cover rounded-lg shadow-md"
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-6 text-sm text-slate-600 border-b border-slate-200 pb-4">
                      <span className="font-bold text-slate-900">
                        {post.shares}
                      </span>
                      <span>SHARES</span>
                      <span className="font-bold text-slate-900">
                        {post.views}
                      </span>
                      <span>VIEWS</span>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="flex gap-3 mb-6">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 text-sm font-semibold">
                        {/* <Share2 size={16} /> */}
                        Share on Facebook
                      </button>
                      <button className="flex-1 bg-black hover:bg-slate-900 text-white py-2 rounded flex items-center justify-center gap-2 text-sm font-semibold">
                        {/* <Share2 size={16} /> */}
                        Share on Twitter
                      </button>
                      <button
                        className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50"
                        aria-label="Share"
                      >
                        {/* Share icon (16x16) */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="inline-block align-middle"
                          aria-hidden="true"
                        >
                          <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                          <polyline points="16 6 12 2 8 6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="prose prose-sm max-w-none mb-8">
                      <div className="flex gap-6 mb-6 p-4 bg-slate-50 rounded">
                        <div className="text-blue-600 font-bold text-2xl min-w-fit">
                          D
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed m-0">
                          {post.content}
                        </p>
                      </div>

                      <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>

                    {/* Engagement */}
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
                        <span>{post.likes}</span>
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
                        <span>{post.comments}</span>
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
                          <circle cx="18" cy="5" r="3"></circle>
                          <circle cx="6" cy="12" r="3"></circle>
                          <circle cx="18" cy="19" r="3"></circle>
                          <line
                            x1="8.59"
                            y1="13.51"
                            x2="15.42"
                            y2="17.49"
                          ></line>
                          <line
                            x1="15.41"
                            y1="6.51"
                            x2="8.59"
                            y2="10.49"
                          ></line>
                        </svg>
                      </button>
                    </div>

                    {/* Review Section */}
                    <div className="bg-slate-50 p-6 rounded mb-8">
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase mb-2">
                          THE REVIEW
                        </h3>
                        <h2 className="text-2xl font-bold text-orange-500">
                          {post.title}
                        </h2>
                      </div>

                      {/* Rating */}
                      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-200">
                        <div className="bg-blue-600 text-white rounded flex items-center justify-center w-16 h-16 flex-shrink-0">
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {post.rating}
                            </div>
                            <div className="text-xs font-semibold">SCORE</div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 flex-1 leading-relaxed">
                          A wonderful serenity has taken possession of my entire
                          soul, like these sweet mornings of spring which I
                          enjoy with my whole heart. I am alone, and feel the
                          charm of existence in this spot, which was created for
                          the bliss of souls like mine.
                        </p>
                      </div>

                      {/* Pros and Cons */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm mb-3">
                            PROS
                          </h4>
                          <div className="space-y-2">
                            {post.review.pros.map((pro, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="flex-shrink-0 mt-0.5 text-green-600"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span className="text-slate-700">{pro}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm mb-3">
                            CONS
                          </h4>
                          <div className="space-y-2">
                            {post.review.cons.map((con, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="flex-shrink-0 mt-0.5 text-red-600"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                <span className="text-slate-700">{con}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Review Breakdown */}
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-4">
                          REVIEW BREAKDOWN
                        </h4>
                        <div className="space-y-4">
                          {post.breakdown.map((item, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-sm font-semibold text-slate-900">
                                  {item.label}
                                </label>
                                <span className="text-sm font-bold text-slate-900">
                                  {item.score}
                                </span>
                              </div>
                              <div className="w-full bg-slate-300 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                                  style={{
                                    width: `${(item.score / 10) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Author Bio */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded">
                      <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
                        👤
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {post.author}
                        </p>
                        <p className="text-sm text-slate-600">
                          Author bio and details
                        </p>
                      </div>
                    </div>
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
