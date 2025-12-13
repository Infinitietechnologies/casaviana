import React, { useEffect, useState } from "react";
import { get_ratings, create_rating } from "@/Api/api";
import { addToast, Button, Modal, ModalBody, ModalContent, ModalHeader , ModalFooter, useDisclosure } from "@heroui/react";
import { Rating as SmastromRating } from "@smastrom/react-rating";

const EMOJIS = ["😡", "🙁", "😐", "🙂", "😄"];
const EMOJI_LABELS = ["Very Bad", "Bad", "Average", "Good", "Excellent"];

import { useSelector } from "react-redux";

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
          const avgVal =
            items.reduce((p, c) => p + (c.rating || 0), 0) / items.length;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        addToast({
          title: res.message || "Rating submitted",
          color: "success",
        });
        await fetchRatings();
        onClose();
        setValue(0);
        setTitle("");
        setReview("");
      } else {
        addToast({
          title: res?.error || "Failed to submit rating",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: err?.response?.data?.message || err.message,
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hasRated = user && ratings.some((r) => r.user_id === user.id);

  return (
    <div>
      {/* Compact Rating Display - Shows on event header */}
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-400 text-lg">⭐</span>
          <span className="font-bold text-sm">
            {avg > 0 ? avg.toFixed(1) : "0.0"}
          </span>
        </div>
        <span className="text-xs">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Compact Full Rating Section - Reduced spacing and sizes */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Reviews</h3>
         
        </div>

        {/* Compact Rating Summary */}
        {count > 0 ? (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{avg.toFixed(1)}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Based on {count} review{count !== 1 ? "s" : ""}
                </div>
              </div>
              
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const starCount = ratings.filter((r) => Math.round(r.rating) === star).length;
                  const percentage = count > 0 ? (starCount / count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700 w-8">{star}★</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8 text-right">{starCount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-4">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-gray-900 font-semibold text-base mb-2">No reviews yet</p>
            <p className="text-gray-500 text-xs mb-3">Be the first to share!</p>
            {user && (
              <Button 
                color="primary" 
                onPress={onOpen}
                size="sm"
                className="font-semibold"
              >
                Write First Review
              </Button>
            )}
          </div>
        )}

        {/* Compact Reviews List */}
        {ratings.length > 0 && (
          <div className="space-y-3">
            {ratings.map((rating, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        {(rating.user?.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {rating.user?.name || "Anonymous User"}
                        </div>
                        <div className="flex items-center gap-1">
                          <SmastromRating
                            style={{ maxWidth: 60 }}
                            value={rating.rating}
                            readOnly
                          />
                          <span className="text-xs font-semibold text-gray-700">{rating.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    {rating.title && (
                      <div className="font-bold text-gray-900 text-sm mb-1">{rating.title}</div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                  {rating.review || rating.body || "No review text provided."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modal - Unchanged as it's not part of the main section */}
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
                {/* Enhanced Emoji Rating */}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-700 mb-3">How would you rate this?</div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                    <div
                      className="flex items-center justify-center gap-2"
                      role="radiogroup"
                      aria-label="Rating"
                    >
                      {EMOJIS.map((emoji, i) => {
                        const idx = i + 1;
                        const activeIndex = hoverIndex || value;
                        const isActive = activeIndex >= idx;
                        const isSelected = value === idx;
                        return (
                          <button
                            key={i}
                            type="button"
                            role="radio"
                            aria-checked={value === idx}
                            aria-label={`Rate ${idx}`}
                            onClick={() => setValue(idx)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setValue(idx);
                              }
                            }}
                            onMouseEnter={() => setHoverIndex(idx)}
                            onMouseLeave={() => setHoverIndex(0)}
                            onFocus={() => setHoverIndex(idx)}
                            onBlur={() => setHoverIndex(0)}
                            className={`relative text-4xl p-3 rounded-2xl transition-all duration-200 focus:outline-none cursor-pointer ${
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
                        {(hoverIndex || value) > 0
                          ? EMOJI_LABELS[(hoverIndex || value) - 1]
                          : "Select a rating"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {(hoverIndex || value) > 0 ? `${hoverIndex || value} out of 5 stars` : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Review Title
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 h-32 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                    placeholder="Share details about your experience..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {review.length} characters
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t pt-4">
                <Button 
                  color="" 
                  variant="flat" 
                  onPress={onClose}
                  className="font-semibold"
                >
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