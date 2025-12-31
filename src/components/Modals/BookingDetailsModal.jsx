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

  const { event, items } = booking;

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
      switch(status) {
          case 'confirmed': return 'success';
          case 'pending': return 'warning';
          case 'cancelled': return 'danger';
          case 'published': return 'success';
          default: return 'default';
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
              <div className="flex justify-between items-center pr-8">
                  <div>
                    <h2 className="text-xl font-bold">
                        Booking #{booking.booking_number}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {formatDate(booking.created_at)}
                    </p>
                  </div>
                  <Chip color={getStatusColor(booking.status)} variant="flat">
                      {booking.status}
                  </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              {/* Event Details */}
              {event && (
                <div className="bg-gray-50 p-4 rounded-lg mb-2">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">{event.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wide">Event Date</span>
                      <span className="font-medium text-gray-900">
                        {new Date(event.event_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wide">Venue</span>
                      <span className="font-medium text-gray-900">
                        {event.venue?.name || "-"}
                      </span>
                    </div>
                    <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wide">Total Amount</span>
                        <span className="font-bold text-lg text-primary-600">{formatAmount(booking.total_amount)}</span>
                    </div>
                     <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wide">Total Tickets</span>
                        <span className="font-medium text-gray-900">{booking.total_tickets}</span>
                    </div>
                  </div>
                </div>
              )}

              <Divider className="my-2" />

              {/* Tickets List */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    Tickets 
                    <Chip size="sm" variant="solid" className="h-5 min-w-5">{items?.length || 0}</Chip>
                </h3>
                <div className="space-y-3">
                  {items && items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white hover:border-gray-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                             <h4 className="font-bold text-gray-900 text-base">
                                {item.ticket_type?.name || item.metadata?.ticket_type_name || "Ticket"}
                             </h4>
                             {item.item_type && (
                                <Chip size="sm" variant="dot" color="primary" className="border-none">
                                    {item.item_type}
                                </Chip>
                             )}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                             {item.metadata?.ticket_code && (
                                <p className="flex items-center gap-2">
                                    <span className="text-gray-500 text-xs uppercase">Code:</span>
                                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-medium select-all">
                                        {item.metadata.ticket_code}
                                    </span>
                                </p>
                             )}
                             {(item.seat_label || item.table_number) && (
                                <p className="text-xs text-gray-500">
                                    {item.table_number && `Table: ${item.table_number} `}
                                    {item.seat_label && `Seat: ${item.seat_label}`}
                                </p>
                             )}
                        </div>

                        {/* QR Code Display */}
                        {item.metadata?.qr_code_full_url && (
                          <div className="mt-2">
                             <img 
                                src={item.metadata.qr_code_full_url} 
                                alt={`QR Code for ${item.metadata.ticket_code}`}
                                className="w-24 h-24 object-contain border border-gray-100 rounded bg-white p-1"
                             />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-1 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 font-mono">
                           <span className="font-bold text-gray-900">
                                {formatAmount(item.price_paid)}
                           </span>
                      </div>
                    </div>
                  ))}
                  
                  {(!items || items.length === 0) && (
                      <div className="text-center py-8 text-gray-500 italic">
                          No ticket details available.
                      </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BookingDetailsModal;
