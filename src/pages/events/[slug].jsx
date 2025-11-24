import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { get_event } from "../../Api/api"; // Assuming this API function exists for fetching event by slug
import { Skeleton } from "@heroui/react"; // Assuming Skeleton is available from your UI library

const EventDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ticket state management - dynamic based on ticket_types
  const [tickets, setTickets] = useState({});

  // Fetch event data
  useEffect(() => {
    if (!slug) return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await get_event(slug); // Pass slug to API
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

  // Initialize ticket quantities when event loads
  useEffect(() => {
    if (event?.ticket_types) {
      const initialTickets = {};
      event.ticket_types.forEach((ticket) => {
        initialTickets[ticket.id] = 0;
      });
      setTickets(initialTickets);
    }
  }, [event]);

  // Calculate totals
  const calculateTotal = () => {
    if (!event?.ticket_types) return 0;
    let total = 0;
    event.ticket_types.forEach((ticket) => {
      const qty = tickets[ticket.id] || 0;
      total += qty * parseFloat(ticket.price || 0);
    });
    return total;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-AO").format(price);
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

  // Parse date for display
  const parseEventDate = () => {
    if (!event?.event_date) return { day: '', month: '' };
    const eventDate = new Date(event.event_date);
    const day = eventDate.getDate().toString();
    const month = eventDate.toLocaleString("pt-PT", { month: "long" });
    return { day, month };
  };

  const { day, month } = parseEventDate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20">
        <Skeleton className="w-full h-[400px]" />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full h-32 mb-4" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4 mt-2" />
            </div>
            <div>
              <Skeleton className="w-full h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
        <p className="text-gray-500">Evento não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="relative bg-black text-white pb-12 full-width">
        <div className="py-6 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-right"></div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
              <div className="text-2xl font-bold">{day}</div>
              <div className="text-xs uppercase">{month}</div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 lg:px-12">
          <div className="relative">
            {/* Image container */}
            <div className="absolute top-[-60px] left-0 w-full lg:w-[90%]">
              <img
                src={event.banner_image || "/images/event2.png"}
                alt={event.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right Side - Event Details */}
          <div className="text-gray-200 pt-[300px] lg:pt-0">
            <div className="text-sm">{event.category?.name || "Evento"}</div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Event Info */}
          <div className="relative mt-[380px]">
            {/* Event Info Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4">
                <div className="text-gray-600 text-sm mb-1">DURAÇÃO</div>
                <div className="font-bold">{event.duration_minutes || 0} Minutos</div>
              </div>
              <div className="p-4 border-l">
                <div className="text-gray-600 text-sm mb-1">CLASSIFICAÇÃO</div>
                <div className="font-bold">{event.category?.name || "Geral"}</div>
              </div>
              <div className="p-4 border-l">
                <div className="text-gray-600 text-sm mb-1">PROMOTOR</div>
                <div className="font-bold">{event.venue?.name || "Não especificado"}</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-4 mt-4">
              <div className="font-bold mb-2">PARA MAIS INFORMAÇÕES 📞</div>
              <div className="text-sm text-gray-700">926151856 | 936059093</div>
            </div>

            {/* Description */}
            <div className="p-4 mt-4">
              <h3 className="font-bold text-lg mb-3">Descrição Curta</h3>
              <p className="text-gray-700 mb-3">{event.short_description }</p>
            </div>

            {/* Location */}
            <div className="p-4 mt-4">
              <h3 className="font-bold text-lg mb-3">LOCALIZAÇÃO</h3>
              <div className="text-gray-700">
                <div className="font-semibold">{event.venue?.name}</div>
                <div>{event.venue?.address || "Localização não disponível"}</div>
              </div>
            </div>
          </div>

          {/* Right Side - Ticket Selection */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Selecione os Ingressos</h2>

              {/* Dynamic Ticket Types */}
              {event.ticket_types?.map((ticket) => {
                const ticketQty = tickets[ticket.id] || 0;
                const ticketPrice = parseFloat(ticket.price || 0);
                const subtotal = ticketQty * ticketPrice;
                const symbol = ticket.currency?.symbol || "Kz";
                const isDisabled = ticket.status !== "active";

                return (
                  <div key={ticket.id} className="border-b pb-6 mb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{ticket.name}</h3>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                          {formatPrice(ticketPrice)} {symbol}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {ticket.description || "Sem descrição."}
                        </p>
                      </div>
                      {ticket.available_tickets > 0 && (
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded ml-4">
                          Restam {ticket.available_tickets}
                        </span>
                      )}
                    </div>
                    {isDisabled && (
                      <div className="bg-red-50 text-red-600 text-center py-2 px-4 rounded text-sm font-semibold mb-4">
                        VENDAS SOMENTE PRESENCIAIS
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3" style={{ opacity: isDisabled ? 0.5 : 1 }}>
                        <button
                          onClick={() => handleDecrement(ticket.id)}
                          disabled={isDisabled}
                          className={`w-8 h-8 rounded flex items-center justify-center ${
                            isDisabled
                              ? "bg-gray-300 text-white cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800"
                          }`}
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-bold">{ticketQty}</span>
                        <button
                          onClick={() => handleIncrement(ticket.id)}
                          disabled={isDisabled}
                          className={`w-8 h-8 rounded flex items-center justify-center ${
                            isDisabled
                              ? "bg-gray-300 text-white cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800"
                          }`}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Subtotal</div>
                        <div className="font-bold">
                          {formatPrice(subtotal)} {symbol}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) || (
                <p className="text-gray-500">Nenhum tipo de ingresso disponível.</p>
              )}

              {/* Total */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold">TOTAL EVENTO</div>
                  <div className="text-2xl font-bold">
                    {formatPrice(calculateTotal())} {event.currency?.symbol || "Kz"}
                  </div>
                </div>
                <button 
                  className="w-full bg-gray-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  disabled={!event.is_available_for_booking || calculateTotal() === 0}
                >
                  🛒 Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;