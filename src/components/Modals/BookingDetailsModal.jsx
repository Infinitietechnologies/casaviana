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

  const handleDownloadQR = (qrCodeUrl, ticketCode) => {
    // Open in new tab - user can right-click and save
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `QR-${ticketCode || "ticket"}.png`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

              {/* Tickets List - Vertical Ticket Card Style */}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                  Bilhetes
                  <Chip size="sm" variant="solid" className="h-5 min-w-5">
                    {items?.length || 0}
                  </Chip>
                </h3>

                {/* Grid layout for tickets - 1 column on mobile, 2-3 on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items &&
                    items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-b from-white to-gray-50 border border-gray-200"
                      >
                        {/* Blue Header with Event Info */}
                        <div
                          className="relative px-4 py-4 text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                          }}
                        >
                          <div className="text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1">
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

                        {/* Main Content - Vertical Layout */}
                        <div className="px-4 py-4 flex flex-col items-center gap-3">
                          {/* QR Code with Download */}
                          {item.metadata?.qr_code_full_url && (
                            <div className="flex flex-col items-center gap-2">
                              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                                <img
                                  src={item.metadata.qr_code_full_url}
                                  alt={`QR Code for ${item.metadata.ticket_code}`}
                                  className="w-24 h-24 object-contain"
                                />
                              </div>
                              {/* Download button */}
                              <button
                                onClick={() =>
                                  handleDownloadQR(
                                    item.metadata.qr_code_full_url,
                                    item.metadata.ticket_code,
                                  )
                                }
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Download QR Code"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-3.5 h-3.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                  />
                                </svg>
                                Download
                              </button>
                            </div>
                          )}

                          {/* Ticket Code */}
                          {item.metadata?.ticket_code && (
                            <div className="w-full text-center">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                                Código do Bilhete
                              </p>
                              <p className="font-mono font-bold text-sm text-gray-900 tracking-wider break-all px-2">
                                {item.metadata.ticket_code}
                              </p>
                            </div>
                          )}

                          {/* Price */}
                          <div className="w-full text-center pt-2 border-t border-dashed border-gray-300">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                              Valor do Bilhete
                            </p>
                            <p className="text-xl font-bold text-blue-600">
                              {formatAmount(item.price_paid)}
                            </p>
                          </div>
                        </div>

                        {/* Side notches */}
                        <div className="absolute left-0 top-[45%] -translate-y-1/2 w-4 h-4 bg-gray-100 rounded-full -ml-2"></div>
                        <div className="absolute right-0 top-[45%] -translate-y-1/2 w-4 h-4 bg-gray-100 rounded-full -mr-2"></div>
                      </div>
                    ))}

                  {(!items || items.length === 0) && (
                    <div className="col-span-full text-center py-8 text-gray-500 italic">
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
