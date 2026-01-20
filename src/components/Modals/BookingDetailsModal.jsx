"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider,
} from "@heroui/react";

const BookingDetailsModal = ({ isOpen, onOpenChange, booking }) => {
  if (!booking) return null;

  const { items } = booking;

  const formatAmount = (amount) => {
    if (!amount) return "0.00 AOA";
    const num = parseFloat(amount);
    const parts = num.toFixed(2).split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts[1];
    return `${integerPart},${decimalPart} AOA`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-AO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "published":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pr-8">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">
                    Reserva #{booking.booking_number}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDate(booking.created_at)}
                  </p>
                </div>
                <Chip
                  color={getStatusColor(booking.status)}
                  variant="flat"
                  size="sm"
                >
                  {booking.status === "confirmed"
                    ? "Confirmado"
                    : booking.status === "pending"
                      ? "Pendente"
                      : booking.status === "cancelled"
                        ? "Cancelado"
                        : booking.status}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              {/* Booking Summary */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-2">
                <div className="grid grid-cols-2 gap-3 sm:gap-6 text-sm">
                  <div>
                    <span className="text-gray-500 block text-[10px] sm:text-xs uppercase tracking-wide">
                      Valor Total
                    </span>
                    <span className="font-bold text-base sm:text-lg text-primary-600">
                      {formatAmount(booking.total_amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] sm:text-xs uppercase tracking-wide">
                      Total de Bilhetes
                    </span>
                    <span className="font-medium text-gray-900">
                      {booking.total_tickets}
                    </span>
                  </div>
                </div>
              </div>

              <Divider className="my-2" />

              {/* Tickets List - Boarding Pass Style */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                  Bilhetes
                  <Chip size="sm" variant="solid" className="h-5 min-w-5">
                    {items?.length || 0}
                  </Chip>
                </h3>
                <div className="space-y-4">
                  {items &&
                    items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="relative overflow-hidden rounded-xl shadow-md bg-white border border-gray-100"
                        style={{
                          background:
                            "linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)",
                        }}
                      >
                        {/* Blue Header - Boarding Class Style */}
                        <div
                          className="relative px-4 py-2.5 text-white overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                          }}
                        >
                          <div className="relative z-10 flex justify-between items-center">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider">
                                {item.ticket_type?.name ||
                                  item.metadata?.ticket_type_name ||
                                  "Ingresso VIP"}
                              </p>
                              {item.item_type && (
                                <p className="text-[10px] opacity-80 capitalize">
                                  {item.item_type}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Main Content - Responsive Layout */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4">
                          {/* QR Code */}
                          {item.metadata?.qr_code_full_url && (
                            <div className="flex-shrink-0">
                              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                                <img
                                  src={item.metadata.qr_code_full_url}
                                  alt={`QR Code for ${item.metadata.ticket_code}`}
                                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                                />
                              </div>
                            </div>
                          )}

                          {/* Ticket Code and Price - Stack on mobile */}
                          <div className="flex-1 w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
                            {/* Ticket Code */}
                            <div className="flex-1 text-center sm:text-left">
                              {item.metadata?.ticket_code && (
                                <div>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                                    Código
                                  </p>
                                  <p className="font-mono font-bold text-xs sm:text-sm text-gray-900 tracking-wider break-all">
                                    {item.metadata.ticket_code}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Price */}
                            <div className="flex-shrink-0 text-center sm:text-right sm:border-l border-dashed border-gray-300 sm:pl-4">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                                Valor do Bilhete
                              </p>
                              <p className="text-base sm:text-lg font-bold text-blue-600 whitespace-nowrap">
                                {formatAmount(item.price_paid)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Decorative side notches */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-50 rounded-r-full -ml-1.5"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-50 rounded-l-full -mr-1.5"></div>
                      </div>
                    ))}

                  {(!items || items.length === 0) && (
                    <div className="text-center py-8 text-gray-500 italic">
                      Detalhes do bilhete indisponíveis.
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BookingDetailsModal;
