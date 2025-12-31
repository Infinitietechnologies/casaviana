import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { get_event, book_event, initiate_payment } from "@/Api/api";
import { addToast, useDisclosure } from "@heroui/react";
import dynamic from "next/dynamic";
import PaymentInstructionsModal from "@/components/Modals/PaymentInstructionsModal";
import PaymentGatewayModal from "@/components/Modals/PaymentGatewayModal";

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

const EventDetailsView = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [tickets, setTickets] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Payment Modal state
  const { 
    isOpen: isPaymentModalOpen, 
    onOpen: onPaymentModalOpen, 
    onClose: onPaymentModalClose 
  } = useDisclosure();
  const [paymentData, setPaymentData] = useState(null);

  // Payment Gateway Selection Modal state
  const {
    isOpen: isGatewayModalOpen,
    onOpen: onGatewayModalOpen,
    onClose: onGatewayModalClose
  } = useDisclosure();
  const [pendingBookingId, setPendingBookingId] = useState(null);

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

  const initiatePaymentForBooking = async (bookingId, gateway = "bank_transfer") => {
    console.log("Initiating payment for booking ID:", bookingId, "Gateway:", gateway);
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
      } else {
        addToast({
          title: "Erro ao iniciar pagamento",
          description: res?.error || "Ocorreu um erro ao gerar os dados para pagamento.",
          color: "danger"
        });
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      addToast({
        title: "Erro ao iniciar pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.",
        color: "danger"
      });
    }
  };

  const handleGatewaySelection = (gateway) => {
    if (pendingBookingId) {
      initiatePaymentForBooking(pendingBookingId, gateway);
      setPendingBookingId(null);
    }
  };

  const handleBookEvent = async () => {
    if (!slug) {
      addToast({ title: "Evento inválido", color: "danger" });
      return;
    }
    // Build selected tickets
    const selected = Object.keys(tickets)
      .map((id) => ({ id, qty: tickets[id] }))
      .filter((t) => t.qty > 0);

    if (!selected.length) {
      addToast({ title: "Selecione pelo menos 1 ingresso", color: "danger" });
      return;
    }

    setBookingLoading(true);
    let successCount = 0;
    let failCount = 0;

    // Perform booking for each ticket type
    const promises = selected.map(async (t) => {
      const ticketObj = event.ticket_types?.find(
        (tt) => `${tt.id}` === `${t.id}`
      );
      if (!ticketObj) {
        failCount += 1;
        addToast({ title: "Tipo de ingresso inválido", color: "danger" });
        return;
      }
      if (t.qty > (ticketObj.available_tickets || 0)) {
        failCount += 1;
        addToast({
          title: `Quantidade solicitada maior que disponível para ${ticketObj.name}`,
          color: "danger",
        });
        return;
      }
      try {
        const res = await book_event(slug, t.id, t.qty);
        if (res?.success) {
          successCount += 1;
          addToast({
            title: res.message || "Ingresso reservado com sucesso",
            color: "success",
          });
          
          // Get booking ID and show gateway selection
          console.log("Booking response data:", res.data);
          const bookingId = res.data?.booking_id || res.booking_id || (typeof res.data === 'number' || typeof res.data === 'string' ? res.data : null);
          
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
            title: res?.error || res?.message || "Erro ao reservar ingresso",
            color: "danger",
          });
        }
      } catch (err) {
        failCount += 1;
        addToast({
          title:
            err?.response?.data?.message ||
            err.message ||
            "Erro ao reservar ingresso",
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
        title: `Sucesso: ${successCount}, Falha: ${failCount}`,
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
    if (!event?.event_date) return { day: "", month: "" };
    const eventDate = new Date(event.event_date);
    const day = eventDate.getDate().toString();
    const month = eventDate.toLocaleString("pt-PT", { month: "long" });
    return { day, month };
  };

  const { day, month } = parseEventDate();

  if (loading) return <EventDetailsSkeleton />;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
        <p className="text-gray-500">Evento não encontrado.</p>
      </div>
    );
  }

  return (
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
                    navigation={false}
                    pagination={{ clickable: true }}
                    modules={[Navigation, Thumbs, Pagination]}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
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
                  DURAÇÃO
                </div>
                <div className="font-bold text-sm lg:text-base">
                  {event.duration_minutes || 0} min
                </div>
              </div>
              <div className="p-3 lg:p-4 border-l">
                <div className="text-gray-600 text-xs lg:text-sm mb-1">
                  CLASSIFICAÇÃO
                </div>
                <div className="font-bold text-sm lg:text-base">
                  {event.category?.name || "Geral"}
                </div>
              </div>
              <div className="p-3 lg:p-4 border-l">
                <div className="text-gray-600 text-xs lg:text-sm mb-1">
                  PROMOTOR
                </div>
                <div className="font-bold text-sm lg:text-base">
                  {event.venue?.name || "N/E"}
                </div>
              </div>
            </div>

            <div className="p-3 lg:p-4 mt-4">
              <div className="font-bold text-sm lg:text-base mb-2">
                PARA MAIS INFORMAÇÕES 📞
              </div>
              <div className="text-xs lg:text-sm text-gray-700">
                {event.venue?.branch?.phone} |{" "}
                {event.venue?.branch?.manager?.phone}
              </div>
            </div>

            <div className="p-3 lg:p-4 mt-4">
              <h3 className="font-bold text-base lg:text-lg mb-3">
                Descrição Curta
              </h3>
              <p className="text-xs lg:text-base text-gray-700 mb-3">
                {event.short_description}
              </p>
            </div>

            <div className="p-3 lg:p-4 mt-4">
              <h3 className="font-bold text-base lg:text-lg mb-3">
                LOCALIZAÇÃO
              </h3>
              <div className="text-gray-700">
                <div className="font-semibold text-sm lg:text-base">
                  {event.venue?.name}
                </div>
                <div className="text-xs lg:text-sm">
                  {event.venue?.address || "Localização não disponível"}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 lg:sticky lg:top-4">
              <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">
                Selecione os Ingressos
              </h2>

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
                      {ticket.available_tickets > 0 && (
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded ml-3">
                          Available {ticket.available_tickets}
                        </span>
                      )}
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600 mt-2">
                       {ticket.description || "Sem descrição."}
                    </p>
                    {isDisabled && (
                      <div className="bg-red-50 text-red-600 text-center py-2 px-3 rounded text-xs lg:text-sm font-semibold mb-4">
                        VENDAS SOMENTE PRESENCIAIS
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
                          className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                            isDisabled
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
                          className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                            isDisabled
                              ? "bg-gray-300 text-white cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800"
                          }`}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs lg:text-sm text-gray-600">
                          Subtotal
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
                    TOTAL EVENTO
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">
                    {formatPrice(calculateTotal())} {event.currency?.code}
                  </div>
                </div>
                <button
                  className="w-full bg-gray-700 text-white py-3 lg:py-4 rounded-lg font-bold text-base lg:text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  onClick={handleBookEvent}
                  disabled={
                    bookingLoading ||
                    !event.is_available_for_booking ||
                    calculateTotal() === 0
                  }
                >
                  {bookingLoading ? "Reservando..." : "Reservar Ingressos"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Rating slug={slug} resource="event" />
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Comments</h3>
          <Comment slug={slug} resource="event" />
        </div>
      </div>
      <PaymentInstructionsModal 
        isOpen={isPaymentModalOpen} 
        onClose={onPaymentModalClose} 
        paymentData={paymentData} 
      />
      <PaymentGatewayModal
        isOpen={isGatewayModalOpen}
        onClose={onGatewayModalClose}
        onSelectGateway={handleGatewaySelection}
      />
    </div>
  );
};

export default EventDetailsView;
