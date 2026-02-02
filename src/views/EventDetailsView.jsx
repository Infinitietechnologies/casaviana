import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { get_event, book_event, initiate_payment } from "@/Api/api";
import { addToast, useDisclosure } from "@heroui/react";
import dynamic from "next/dynamic";
import PaymentInstructionsModal from "@/components/Modals/PaymentInstructionsModal";
import PaymentGatewayModal from "@/components/Modals/PaymentGatewayModal";
import { useTranslation } from "react-i18next";

const Rating = dynamic(() => import("@/components/Rating/Rating"), {
  ssr: false,
});

const Comment = dynamic(() => import("@/components/Comment/Comment"), {
  ssr: false,
});

import { Skeleton } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";

import { EventDetailsSkeleton } from "@/components/Skeletons/EventsSkeletons";
import Head from "next/head";

const EventDetailsView = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { slug } = router.query;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [tickets, setTickets] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const videoRef = useRef(null);

  // Payment Modal state
  const {
    isOpen: isPaymentModalOpen,
    onOpen: onPaymentModalOpen,
    onClose: onPaymentModalClose,
  } = useDisclosure();
  const [paymentData, setPaymentData] = useState(null);

  // Payment Gateway Selection Modal state
  const {
    isOpen: isGatewayModalOpen,
    onOpen: onGatewayModalOpen,
    onClose: onGatewayModalClose,
  } = useDisclosure();
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await get_event(slug);
        if (response?.success) {
          setEvent(response.data);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  useEffect(() => {
    if (event?.ticket_types) {
      const initialTickets = {};
      let firstSet = false;
      event.ticket_types.forEach((ticket) => {
        // Set first active ticket to 1, others to 0
        if (
          !firstSet &&
          ticket.status === "active" &&
          ticket.available_tickets > 0
        ) {
          initialTickets[ticket.id] = 1;
          firstSet = true;
        } else {
          initialTickets[ticket.id] = 0;
        }
      });
      setTickets(initialTickets);
    }
  }, [event]);

  // Calculate the effective price (with discount if available)
  const getEffectivePrice = (ticket) => {
    const originalPrice = parseFloat(ticket.price || 0);
    const discountPrice = parseFloat(ticket.discount_price || 0);

    // If discount_price exists and is less than original price, use it
    if (discountPrice > 0 && discountPrice < originalPrice) {
      return discountPrice;
    }
    return originalPrice;
  };

  // Check if ticket has a discount
  const hasDiscount = (ticket) => {
    const originalPrice = parseFloat(ticket.price || 0);
    const discountPrice = parseFloat(ticket.discount_price || 0);
    return discountPrice > 0 && discountPrice < originalPrice;
  };

  // Calculate discount percentage
  const getDiscountPercentage = (ticket) => {
    if (!hasDiscount(ticket)) return 0;
    const originalPrice = parseFloat(ticket.price || 0);
    const discountPrice = parseFloat(ticket.discount_price || 0);
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const calculateTotal = () => {
    if (!event?.ticket_types) return 0;
    let total = 0;
    event.ticket_types.forEach((ticket) => {
      const qty = tickets[ticket.id] || 0;
      const price = getEffectivePrice(ticket);
      total += qty * price;
    });
    return total;
  };

  const user = useSelector((state) => state.auth.user);

  const initiatePaymentForBooking = async (
    bookingId,
    gateway = "bank_transfer",
  ) => {
    console.log(
      "Initiating payment for booking ID:",
      bookingId,
      "Gateway:",
      gateway,
    );
    try {
      const paymentPayload = {
        payable_type: "event_booking",
        payable_id: bookingId,
        gateway: gateway,
      };

      // Add phone_number for Multicaixa
      if (gateway === "multicaixa_express") {
        paymentPayload.phone_number = "+916354340944"; // Static for now as per requirements
      }

      const res = await initiate_payment(paymentPayload);

      console.log("Payment initiation response:", res);

      if (res?.success) {
        setPaymentData(res);
        onPaymentModalOpen();
        return true;
      } else {
        addToast({
          title: t("pages.events.details.toasts.init_payment_error"),
          description:
            res?.error || "Ocorreu um erro ao gerar os dados para pagamento.",
          color: "danger",
        });
        return false;
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      addToast({
        title: t("pages.events.details.toasts.init_payment_error"),
        description:
          "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.",
        color: "danger",
      });
      return false;
    }
  };

  const handleGatewaySelection = async (gateway) => {
    if (pendingBookingId) {
      setIsPaymentLoading(true);
      await initiatePaymentForBooking(pendingBookingId, gateway);
      setIsPaymentLoading(false);
      onGatewayModalClose();
      setPendingBookingId(null);
    }
  };

  const handleBookEvent = async () => {
    if (!slug) {
      addToast({ title: t("pages.events.details.toasts.invalid_event"), color: "danger" });
      return;
    }
    // Build selected tickets
    const selected = Object.keys(tickets)
      .map((id) => ({ id, qty: tickets[id] }))
      .filter((t) => t.qty > 0);

    if (!selected.length) {
      addToast({ title: t("pages.events.details.toasts.select_one"), color: "danger" });
      return;
    }

    setBookingLoading(true);
    let successCount = 0;
    let failCount = 0;

    // Perform booking for each ticket type
    const promises = selected.map(async (t) => {
      const ticketObj = event.ticket_types?.find(
        (tt) => `${tt.id}` === `${t.id}`,
      );
      if (!ticketObj) {
        failCount += 1;
        addToast({ title: t("pages.events.details.toasts.invalid_ticket"), color: "danger" });
        return;
      }
      if (t.qty > (ticketObj.available_tickets || 0)) {
        failCount += 1;
        addToast({
          title: t("pages.events.details.toasts.quantity_exceeded", { name: ticketObj.name }),
          color: "danger",
        });
        return;
      }
      try {
        const res = await book_event(slug, t.id, t.qty);
        if (res?.success) {
          successCount += 1;
          addToast({
            title: res.message || t("pages.events.details.toasts.success"),
            color: "success",
          });

          // Get booking ID and show gateway selection
          console.log("Booking response data:", res.data);
          const bookingId =
            res.data?.booking_id ||
            res.booking_id ||
            (typeof res.data === "number" || typeof res.data === "string"
              ? res.data
              : null);

          if (bookingId) {
            // Store booking ID and show gateway selection modal
            setPendingBookingId(bookingId);
            onGatewayModalOpen();
          } else {
            console.error("No booking ID found in response:", res);
          }
        } else {
          failCount += 1;
          addToast({
            title: res?.error || res?.message || t("pages.events.details.toasts.error"),
            color: "danger",
          });
        }
      } catch (err) {
        failCount += 1;
        addToast({
          title:
            err?.response?.data?.message ||
            err.message ||
            t("pages.events.details.toasts.error"),
          color: "danger",
        });
      }
    });

    await Promise.all(promises);

    // Refresh event details to update available tickets
    try {
      const response = await get_event(slug);
      if (response?.success) setEvent(response.data);
    } catch (err) {
      console.error("Error refreshing event:", err);
    }

    if (successCount > 0 && failCount === 0) {
      // addToast({
      //   title: `Reserva(s) concluída(s): ${successCount}`,
      //   color: "success",
      // });
      // reset tickets selected
      const reset = {};
      Object.keys(tickets).forEach((id) => (reset[id] = 0));
      setTickets(reset);
    } else if (successCount > 0 && failCount > 0) {
      addToast({
        title: t("pages.events.details.toasts.mixed_results", { success: successCount, fail: failCount }),
        color: "warning",
      });
    }

    setBookingLoading(false);
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    const parts = num.toFixed(2).split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts[1];
    return `${integerPart},${decimalPart}`;
  };

  const handleIncrement = (ticketId) => {
    setTickets((prev) => ({ ...prev, [ticketId]: (prev[ticketId] || 0) + 1 }));
  };

  const handleDecrement = (ticketId) => {
    setTickets((prev) => ({
      ...prev,
      [ticketId]: (prev[ticketId] || 0) > 0 ? (prev[ticketId] || 0) - 1 : 0,
    }));
  };

  const parseEventDate = () => {
    if (!event?.event_date) return { day: "", month: "", isPast: false };

    // Parse date from API (format: YYYY-MM-DD)
    // Split manually to avoid timezone issues
    const [year, monthNum, dayNum] = event.event_date.split("-");

    // Create date object for formatting
    const dateObj = new Date(
      parseInt(year),
      parseInt(monthNum) - 1,
      parseInt(dayNum),
    );

    // Check if event is past (strictly before today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = dateObj < today;

    // Get month name in Portuguese (short form, e.g., "Nov")
    const monthName = dateObj
      .toLocaleString("pt-PT", { month: "short" })
      .toUpperCase();

    // Format as "Month Year" (e.g., "NOV 2025")
    const monthWithYear = `${monthName} ${year}`;

    return { day: dayNum, month: monthWithYear, isPast };
  };

  const { day, month, isPast } = parseEventDate();

  // Handle video play/pause based on active slide
  const handleSlideChange = (swiper) => {
    const currentIndex = swiper.activeIndex;
    setActiveSlideIndex(currentIndex);

    if (videoRef.current) {
      const totalSlides = event?.images?.length || 0;
      const videoSlideIndex = event?.video ? totalSlides : -1;

      if (currentIndex === videoSlideIndex) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Autoplay video when slide becomes active
  useEffect(() => {
    if (
      videoRef.current &&
      activeSlideIndex === (event?.images?.length || 0) &&
      event?.video
    ) {
      videoRef.current.play();
    }
  }, [activeSlideIndex, event]);

  if (loading) return <EventDetailsSkeleton />;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
        <p className="text-gray-500">{t("pages.events.details.not_found")}</p>
      </div>
    );
  }

  return (
    <>

      <Head>
        <title>{event.title} - Casa Viana</title>
        <meta name="description" content={event.description} />
      </Head>

      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="relative bg-black text-white pb-6 lg:pb-12 full-width">
          <div className="py-4 lg:py-6 px-4 lg:px-12">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-right"></div>
              <div className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg text-center">
                <div className="text-xl lg:text-2xl font-bold">{day}</div>
                <div className="text-xs uppercase">{month}</div>
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 px-4 lg:px-12">
            <div className="relative">
              <div className="relative lg:absolute lg:top-[-60px] lg:left-0 lg:w-full ">
                {event?.images && event.images.length > 0 ? (
                  <div>
                    <Swiper
                      spaceBetween={10}
                      navigation={true}
                      pagination={{ clickable: true }}
                      modules={[Navigation, Thumbs, Pagination]}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      onSlideChange={handleSlideChange}
                      className="mainSwiper rounded-lg shadow-lg overflow-hidden"
                    >
                      {event.images.map((img, i) => (
                        <SwiperSlide key={i}>
                          <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[500px]">
                            <img
                              src={img}
                              alt={`${event.title} - ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                      {event?.video && (
                        <SwiperSlide key="video-slide">
                          <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[500px]">
                            <video
                              ref={videoRef}
                              src={event.video}
                              className="w-full h-full object-cover"
                              controls
                              loop
                              playsInline
                              muted={false}
                            />
                          </div>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  </div>
                ) : (
                  <img
                    src={event.banner_image || "/images/event2.png"}
                    alt={event.title}
                    className="w-full rounded-lg shadow-lg hidden"
                  />
                )}
              </div>
            </div>

            <div className="text-gray-200 lg:pt-0">
              <div className="text-xs lg:text-sm">
                {event.category?.name || "Evento"}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mt-2">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="relative mt-0 lg:mt-[280px]">
              <div className="grid grid-cols-3 gap-2 lg:gap-4 mt-4 lg:mt-6">
                <div className="p-3 lg:p-4">
                  <div className="text-gray-600 text-xs lg:text-sm mb-1">
                    {t("pages.events.details.duration")}
                  </div>
                  <div className="font-bold text-sm lg:text-base">
                    {event.duration_minutes || 0} {t("pages.events.details.min")}
                  </div>
                </div>
                <div className="p-3 lg:p-4 border-l">
                  <div className="text-gray-600 text-xs lg:text-sm mb-1">
                    {t("pages.events.details.classification")}
                  </div>
                  <div className="font-bold text-sm lg:text-base">
                    {event.category?.name || t("pages.events.details.general")}
                  </div>
                </div>
                <div className="p-3 lg:p-4 border-l">
                  <div className="text-gray-600 text-xs lg:text-sm mb-1">
                    {t("pages.events.details.promoter")}
                  </div>
                  <div className="font-bold text-sm lg:text-base">
                    {event.venue?.name || "N/E"}
                  </div>
                </div>
              </div>

              <div className="p-3 lg:p-4 mt-4">
                <div className="font-bold text-sm lg:text-base mb-2">
                  {t("pages.events.details.info_title")}
                </div>
                {event.venue?.branch?.phone ||
                  event.venue?.branch?.manager?.phone ? (
                  <div className="text-xs lg:text-sm text-gray-700">
                    {(Array.isArray(event.venue?.branch?.phone)
                      ? event.venue.branch.phone
                      : (event.venue?.branch?.phone || "").toString().split(",")
                    )
                      .map((p) => p.trim())
                      .join(" | ")}{" "}
                    | {event.venue?.branch?.manager?.phone}
                  </div>
                ) : (
                  <div className="text-xs lg:text-sm text-gray-700">N/A</div>
                )}
              </div>

              <div className="p-3 lg:p-4 mt-4">
                <h3 className="font-bold text-base lg:text-lg mb-3">
                  {t("pages.events.details.short_description")}
                </h3>
                <p className="text-xs lg:text-base text-gray-700 mb-3">
                  {event.short_description}
                </p>
              </div>

              <div className="p-3 lg:p-4 mt-4">
                <h3 className="font-bold text-base lg:text-lg mb-3">
                  {t("pages.events.details.location")}
                </h3>
                <div className="text-gray-700">
                  <div className="font-semibold text-sm lg:text-base">
                    {event.venue?.name}
                  </div>
                  <div className="text-xs lg:text-sm">
                    {event.venue?.address || t("pages.events.details.location_unavailable")}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 lg:sticky lg:top-4">
                <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">
                  {t("pages.events.details.select_tickets")}
                </h2>

                {isPast ? (
                  <div className="text-center py-6">
                    <p className="text-red-500 font-bold mb-2">
                      {t("pages.events.details.event_ended")}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {t("pages.events.details.bookings_closed")}
                    </p>
                  </div>
                ) : (
                  <>
                    {event.ticket_types?.map((ticket) => {
                      const ticketQty = tickets[ticket.id] || 0;
                      const originalPrice = parseFloat(ticket.price || 0);
                      const effectivePrice = getEffectivePrice(ticket);
                      const subtotal = ticketQty * effectivePrice;
                      const symbol = ticket.currency?.code;
                      const isDisabled = ticket.status !== "active";
                      const discount = hasDiscount(ticket);
                      const discountPercent = getDiscountPercentage(ticket);

                      return (
                        <div
                          key={ticket.id}
                          className="border-b pb-4 lg:pb-6 mb-4 lg:mb-6"
                        >
                          <div className="flex justify-between items-start mb-2 lg:mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-base lg:text-lg">
                                {ticket.name}
                              </h3>

                              {/* Price Display with Discount */}
                              <div className="flex items-center gap-2 mt-1">
                                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                                  {formatPrice(effectivePrice)} {symbol}
                                </div>

                                {discount && (
                                  <>
                                    <div className="text-sm lg:text-base text-gray-400 line-through">
                                      {formatPrice(originalPrice)} {symbol}
                                    </div>
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                                      -{discountPercent}%
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            {/* {ticket.available_tickets > 0 && (
                          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded ml-3">
                            Available {ticket.available_tickets}
                          </span>
                        )} */}
                          </div>
                          <p className="text-xs lg:text-sm text-gray-600 mt-2">
                            {ticket.description || t("pages.events.details.no_ticket_description")}
                          </p>
                          {isDisabled && (
                            <div className="bg-red-50 text-red-600 text-center py-2 px-3 rounded text-xs lg:text-sm font-semibold mb-4">
                              {t("pages.events.details.sales_in_person")}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3 lg:mt-4">
                            <div
                              className="flex items-center gap-3"
                              style={{ opacity: isDisabled ? 0.5 : 1 }}
                            >
                              <button
                                onClick={() => handleDecrement(ticket.id)}
                                disabled={isDisabled}
                                className={`w-8 h-8 rounded flex items-center justify-center text-sm ${isDisabled
                                  ? "bg-gray-300 text-white cursor-not-allowed"
                                  : "bg-black text-white hover:bg-gray-800"
                                  }`}
                              >
                                −
                              </button>
                              <span className="w-12 text-center font-bold text-sm">
                                {ticketQty}
                              </span>
                              <button
                                onClick={() => handleIncrement(ticket.id)}
                                disabled={isDisabled}
                                className={`w-8 h-8 rounded flex items-center justify-center text-sm ${isDisabled
                                  ? "bg-gray-300 text-white cursor-not-allowed"
                                  : "bg-black text-white hover:bg-gray-800"
                                  }`}
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="text-xs lg:text-sm text-gray-600">
                                {t("pages.events.details.subtotal")}
                              </div>
                              <div className="font-bold text-sm lg:text-base">
                                {formatPrice(subtotal)} {symbol}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }) || (
                        <p className="text-gray-500 text-sm">
                          Nenhum tipo de ingresso disponível.
                        </p>
                      )}

                    <div className="border-t pt-4 lg:pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-base lg:text-lg font-bold ">
                          {t("pages.events.details.total_event")}
                        </div>
                        <div className="text-xl lg:text-2xl font-bold">
                          {formatPrice(calculateTotal())} {event.currency?.code}
                        </div>
                      </div>
                      <button
                        className="w-full bg-gray-700 text-white py-3 lg:py-4 rounded-lg font-bold text-base lg:text-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                        onClick={handleBookEvent}
                        disabled={
                          bookingLoading ||
                          !event.is_available_for_booking ||
                          calculateTotal() === 0
                        }
                      >
                        {bookingLoading ? t("pages.events.details.booking") : t("pages.events.details.book_tickets")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Rating slug={slug} resource="event" />
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">{t("pages.events.details.reviews")}</h3>
            <Comment slug={slug} resource="event" />
          </div>
        </div>
        <PaymentInstructionsModal
          isOpen={isPaymentModalOpen}
          onClose={onPaymentModalClose}
          paymentData={paymentData}
          shouldUpdateCart={false}
        />
        <PaymentGatewayModal
          isOpen={isGatewayModalOpen}
          onClose={onGatewayModalClose}
          onSelectGateway={handleGatewaySelection}
          isLoading={isPaymentLoading}
        />
      </div>
    </>
  );
};

export default EventDetailsView;
