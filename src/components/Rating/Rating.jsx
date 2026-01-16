import React, { useEffect, useState } from "react";
import { get_ratings, create_rating } from "@/Api/api";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Rating as SmastromRating } from "@smastrom/react-rating";
import { useSelector } from "react-redux";

const EMOJIS = ["😡", "🙁", "😐", "🙂", "😄"];
const EMOJI_LABELS = ["Muito Mau", "Mau", "Médio", "Bom", "Excelente"];

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
  // whether the logged-in user already submitted a rating for this resource
  const [hasUserRated, setHasUserRated] = useState(false);

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
  }, [slug]);

  // Recompute whether current user has already rated whenever ratings or user changes
  useEffect(() => {
    if (!user) {
      setHasUserRated(false);
      return;
    }

    const uId = user.id ?? user._id ?? user.email ?? user.name;

    const found = ratings.some((r) => {
      const ru = r.user ?? {};
      // various possible id/email/name shapes returned by backend
      const rId =
        ru.id ??
        ru._id ??
        ru.user_id ??
        ru.userId ??
        ru.email ??
        ru.name ??
        r.user_id ??
        r.userId;
      return rId && uId && String(rId) === String(uId);
    });

    setHasUserRated(!!found);
  }, [ratings, user]);

  const handleSubmit = async (onClose) => {
    if (!value || value < 1) {
      addToast({ title: "Por favor selecione uma avaliação", color: "danger" });
      return;
    }
    setSubmitting(true);
    try {
      const payload = { rating: value, title, review };
      const res = await create_rating(resource, slug, payload);
      if (res?.success) {
        addToast({
          title: res.message || "Avaliação enviada",
          color: "success",
        });
        await fetchRatings();
        onClose();
        setValue(0);
        setTitle("");
        setReview("");
      } else {
        addToast({
          title: res?.error || "Falha ao enviar avaliação",
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
        <h2 className="text-2xl font-bold text-gray-900">Avaliações e Críticas</h2>
        {user && !hasUserRated && (
          <Button
            color="primary"
            onPress={onOpen}
            size="sm"
            className="font-semibold"
          >
            Escrever Avaliação
          </Button>
        )}
      </div>

      {count > 0 ? (
        <>
          {/* Compact Rating Summary */}
          <div className="flex gap-6 mb-8 pb-6 border-b border-gray-200">
            {/* Left side - Average Rating */}
            <div className="flex flex-col items-center justify-center min-w-[120px]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">
                  {avg.toFixed(1)}
                </span>
                <span className="text-2xl text-yellow-500">★</span>
              </div>
              <div className="text-xs text-gray-600">
                {count.toLocaleString()} Avaliações
              </div>
              <div className="text-xs text-gray-600">
                {ratings.length} Críticas
              </div>
            </div>

            {/* Right side - Star Distribution (Compact) */}
            <div className="flex-1 flex flex-col justify-center gap-1.5 max-w-md">
              {[5, 4, 3, 2, 1].map((star) => {
                const starCount = starDistribution[star];
                const percentage = count > 0 ? (starCount / count) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 w-8">
                      <span className="text-xs font-medium text-gray-700">
                        {star}
                      </span>
                      <span className="text-yellow-500 text-xs">★</span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          star === 5
                            ? "bg-green-500"
                            : star === 4
                            ? "bg-green-400"
                            : star === 3
                            ? "bg-yellow-400"
                            : star === 2
                            ? "bg-orange-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-8 text-right">
                      {starCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {ratings.map((rating, index) => {
              const ratingValue = Math.round(rating.rating);
              return (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-3 last:border-b-0"
                >
                  {/* Rating Badge and Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-900 text-white px-2 py-0.5 rounded text-xs font-bold min-w-[32px] text-center">
                      {rating.rating.toFixed(1)} ★
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      {rating.user?.name || "Utilizador Anónimo"}
                    </span>
                  </div>

                  {/* Review Title */}
                  {rating.title && (
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {rating.title}
                    </h4>
                  )}

                  {/* Review Text */}
                  {rating.review && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {rating.review}
                    </p>
                  )}
                  {/* {console.log(rating)} */}
                  {/* Date */}
                  <div className="text-xs text-gray-500">
                    {/* {rating.created_at || "Recently"} */}
                  </div>
                </div>
              );
            })}
          </div>

          {ratings.length > 3 && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 font-semibold text-sm hover:underline">
                Ver todas as {ratings.length} críticas
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-gray-900 font-semibold text-lg mb-2">
            Ainda sem avaliações
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Seja o primeiro a partilhar a sua experiência!
          </p>
          {user && !hasUserRated && (
            <Button color="primary" onPress={onOpen} className="font-semibold">
              Escrever Primeira Avaliação
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
          base: "bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl",
          backdrop: "bg-black/60 backdrop-blur-md",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 border-b border-gray-100 pb-5">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Partilhe a Sua Experiência
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                  O seu feedback ajuda outros a tomar decisões informadas
                </p>
                <div className="w-12 h-1 bg-blue-600 rounded-full mt-1" />
              </ModalHeader>

              <ModalBody className="py-6 space-y-6">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-3">
                    Como avalia isto?
                  </div>

                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-yellow-200 shadow-inner">
                    <div className="flex items-center justify-center gap-3">
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
                            className={`relative text-4xl p-4 rounded-2xl transition-all duration-200
                        ${
                          isSelected
                            ? "bg-white scale-125 shadow-xl ring-4 ring-yellow-400"
                            : isActive
                            ? "bg-white/80 scale-110 shadow-md"
                            : "hover:bg-white/60 hover:scale-105"
                        }`}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-center mt-5">
                      <div className="text-lg font-semibold text-gray-800">
                        {(hoverIndex || value) > 0
                          ? EMOJI_LABELS[(hoverIndex || value) - 1]
                          : "Selecione uma avaliação"}
                      </div>
                      {(hoverIndex || value) > 0 && (
                        <div className="text-sm text-gray-600 mt-1">
                          {hoverIndex || value} de 5 estrelas
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título da Avaliação
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Resuma a sua experiência"
                    className="w-full rounded-xl border border-gray-200 bg-white/80 p-3
              focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    A Sua Avaliação
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Partilhe detalhes sobre a sua experiência..."
                    className="w-full h-36 resize-none rounded-xl border border-gray-200 bg-white/80 p-3
              focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {review.length} caracteres
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t border-gray-100 pt-5 flex gap-3">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </Button>

                <Button
                  color="primary"
                  isLoading={submitting}
                  onPress={() => handleSubmit(onClose)}
                  className="font-semibold px-8 rounded-xl shadow-lg"
                >
                  {submitting ? "A enviar..." : "Enviar Avaliação"}
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
