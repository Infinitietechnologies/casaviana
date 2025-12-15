import React, { useEffect, useState } from "react";
import { get_ratings, create_rating } from "@/Api/api";
import { addToast, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";
import { Rating as SmastromRating } from "@smastrom/react-rating";
import { useSelector } from "react-redux";

const EMOJIS = ["😡", "🙁", "😐", "🙂", "😄"];
const EMOJI_LABELS = ["Very Bad", "Bad", "Average", "Good", "Excellent"];

const Rating = ({ slug, resource = "events" }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useSelector((state) => state.auth);
  const [ratings, setRatings] = useState([]);
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRatings = async () => {
    if (!slug) return;
    try {
      const res = await get_ratings(resource, slug);
      if (res?.success) {
        let items = [];
        if (res.data?.data && Array.isArray(res.data.data)) {
          items = res.data.data;
        } else if (Array.isArray(res.data)) {
          items = res.data;
        } else if (Array.isArray(res.ratings)) {
          items = res.ratings;
        }

        setRatings(items);

        if (items.length > 0) {
          const avgVal = items.reduce((p, c) => p + (c.rating || 0), 0) / items.length;
          setAvg(Number(avgVal.toFixed(1)));
          setCount(items.length);
        } else if (res?.average || res?.avg) {
          setAvg(res.average || res.avg || 0);
          setCount(res.count || 0);
        } else {
          setAvg(0);
          setCount(0);
        }
      }
    } catch (err) {
      console.error("fetchRatings error", err);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [slug]);

  const handleSubmit = async (onClose) => {
    if (!value || value < 1) {
      addToast({ title: "Please select a rating", color: "danger" });
      return;
    }
    setSubmitting(true);
    try {
      const payload = { rating: value, title, review };
      const res = await create_rating(resource, slug, payload);
      if (res?.success) {
        addToast({ title: res.message || "Rating submitted", color: "success" });
        await fetchRatings();
        onClose();
        setValue(0);
        setTitle("");
        setReview("");
      } else {
        addToast({ title: res?.error || "Failed to submit rating", color: "danger" });
      }
    } catch (err) {
      addToast({ title: err?.response?.data?.message || err.message, color: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const getStarDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach((r) => {
      const star = Math.round(r.rating);
      if (star >= 1 && star <= 5) {
        distribution[star]++;
      }
    });
    return distribution;
  };

  const starDistribution = getStarDistribution();

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h2>
      
      </div>

      {count > 0 ? (
        <>
          <div className="flex gap-8 mb-8 pb-8 border-b border-gray-200">
            <div className="flex flex-col items-center justify-center min-w-[200px]">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</span>
                <span className="text-3xl text-gray-400">★</span>
              </div>
              <div className="text-sm text-gray-600">
                {count.toLocaleString()} Ratings &
              </div>
              <div className="text-sm text-gray-600">
                {ratings.length} Reviews
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const starCount = starDistribution[star];
                const percentage = count > 0 ? (starCount / count) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium text-gray-700">{star}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          star === 5 ? 'bg-green-500' :
                          star === 4 ? 'bg-green-400' :
                          star === 3 ? 'bg-yellow-400' :
                          star === 2 ? 'bg-orange-400' :
                          'bg-red-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {starCount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {ratings.map((rating, index) => {
              const ratingValue = Math.round(rating.rating);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-md text-white font-bold text-sm ${
                        ratingValue >= 4 ? 'bg-green-600' :
                        ratingValue === 3 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {rating.rating.toFixed(1)} ★
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-base">
                          {rating.title || EMOJI_LABELS[ratingValue - 1] || "Review"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  {rating.review && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {rating.review}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      {rating.user?.name || "Anonymous User"}
                    </span>
                    {rating.verified && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-green-600">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Certified Buyer
                        </span>
                      </>
                    )}
                    {rating.location && (
                      <>
                        <span>•</span>
                        <span>{rating.location}</span>
                      </>
                    )}
                    {rating.date && (
                      <>
                        <span>•</span>
                        <span>{rating.date}</span>
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* View All Reviews Link */}
          {ratings.length > 0 && (
            <div className="mt-6 text-center">
              <button className="text-blue-600 font-semibold text-sm hover:underline">
                All {ratings.length} reviews
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-gray-900 font-semibold text-lg mb-2">No reviews yet</p>
          <p className="text-gray-500 text-sm mb-4">Be the first to share your experience!</p>
          {user && (
            <Button
              color="primary"
              onPress={onOpen}
              className="font-semibold"
            >
              Write First Review
            </Button>
          )}
        </div>
      )}

      {/* Rating Modal */}
      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          base: "bg-white",
          backdrop: "bg-black/50 backdrop-blur-sm"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
                <p className="text-sm text-gray-500 font-normal">Your feedback helps others make informed decisions</p>
              </ModalHeader>
              <ModalBody className="py-6">
                {/* Emoji Rating */}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-700 mb-3">How would you rate this?</div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                    <div className="flex items-center justify-center gap-2">
                      {EMOJIS.map((emoji, i) => {
                        const idx = i + 1;
                        const activeIndex = hoverIndex || value;
                        const isActive = activeIndex >= idx;
                        const isSelected = value === idx;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setValue(idx)}
                            onMouseEnter={() => setHoverIndex(idx)}
                            onMouseLeave={() => setHoverIndex(0)}
                            className={`relative text-4xl p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-white shadow-lg scale-125 ring-4 ring-yellow-400"
                                : isActive
                                ? "bg-white/50 scale-110 shadow-md"
                                : "hover:bg-white/30 hover:scale-105"
                            }`}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-center mt-4">
                      <div className="text-lg font-bold text-gray-800">
                        {(hoverIndex || value) > 0 ? EMOJI_LABELS[(hoverIndex || value) - 1] : "Select a rating"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {(hoverIndex || value) > 0 ? `${hoverIndex || value} out of 5 stars` : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Sum up your experience in a few words"
                  />
                </div>

                {/* Review Textarea */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 h-32 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                    placeholder="Share details about your experience..."
                  />
                  <div className="text-xs text-gray-500 mt-1">{review.length} characters</div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t pt-4">
                <Button color="" variant="flat" onPress={onClose} className="font-semibold">
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={submitting}
                  onPress={() => handleSubmit(onClose)}
                  className="font-semibold bg-gradient-to-r from-blue-600 to-blue-700"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Rating;