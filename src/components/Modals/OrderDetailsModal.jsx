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

const OrderDetailsModal = ({ isOpen, onOpenChange, order }) => {
    if (!order) return null;

    const { items } = order;

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
            case "completed":
            case "delivered":
                return "success";
            case "pending":
            case "processing":
                return "warning";
            case "cancelled":
                return "danger";
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
                                        Pedido #{order.id}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <Chip
                                    color={getStatusColor(order.status)}
                                    variant="flat"
                                    size="sm"
                                    className="capitalize"
                                >
                                    {order.status === "pending"
                                        ? "Pendente"
                                        : order.status === "completed"
                                            ? "Concluído"
                                            : order.status}
                                </Chip>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            {/* Order Summary */}
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-2">
                                <div className="grid grid-cols-2 gap-3 sm:gap-6 text-sm">
                                    <div>
                                        <span className="text-gray-500 block text-[10px] sm:text-xs uppercase tracking-wide">
                                            Valor Total
                                        </span>
                                        <span className="font-bold text-base sm:text-lg text-primary-600">
                                            {formatAmount(order.total_amount)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-[10px] sm:text-xs uppercase tracking-wide">
                                            Qtd. Itens
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {items?.reduce((acc, item) => acc + item.quantity, 0) || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Divider className="my-2" />

                            {/* Items List */}
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                                    Itens do Pedido
                                    <Chip size="sm" variant="solid" className="h-5 min-w-5">
                                        {items?.length || 0}
                                    </Chip>
                                </h3>

                                <div className="flex flex-col gap-3">
                                    {items &&
                                        items.map((item, index) => (
                                            <div
                                                key={item.id || index}
                                                className="flex flex-col sm:flex-row gap-4 p-3 border border-gray-100 rounded-lg bg-white shadow-sm"
                                            >
                                                {/* Image */}
                                                <div className="w-full sm:w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.menu_item?.image ? (
                                                        <img
                                                            src={item.menu_item.image}
                                                            alt={item.menu_item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{item.menu_item?.name || "Item Indisponível"}</h4>
                                                        <p className="text-xs text-gray-500 line-clamp-2">{item.menu_item?.short_description}</p>
                                                    </div>
                                                    <div className="flex justify-between items-end mt-2">
                                                        <div className="text-sm text-gray-600">
                                                            {item.quantity} x {formatAmount(item.price)}
                                                        </div>
                                                        <div className="font-bold text-gray-900">
                                                            {formatAmount(item.quantity * item.price)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {(!items || items.length === 0) && (
                                        <div className="text-center py-8 text-gray-500 italic">
                                            Detalhes dos itens indisponíveis.
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

export default OrderDetailsModal;
