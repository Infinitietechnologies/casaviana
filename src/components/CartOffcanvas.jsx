"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  addToast,
  useDisclosure,
} from "@heroui/react";
import { initiate_payment, delete_cart, add_to_cart, get_cart } from "@/Api/api";
import { clearCart, addItemToCart, setCart } from "@/store/cartSlice";
import PaymentGatewayModal from "./Modals/PaymentGatewayModal";
import PaymentInstructionsModal from "./Modals/PaymentInstructionsModal";
import { useTranslation } from "react-i18next";

const CartOffcanvas = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);

  const {
    isOpen: isGatewayModalOpen,
    onOpen: onGatewayModalOpen,
    onClose: onGatewayModalClose,
  } = useDisclosure();

  const {
    isOpen: isPaymentModalOpen,
    onOpen: onPaymentModalOpen,
    onClose: onPaymentModalClose,
  } = useDisclosure();

  const [paymentData, setPaymentData] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});

  const handleUpdateQuantity = async (item, delta) => {
    const newQuantity = parseInt(item.quantity) + delta;
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => ({ ...prev, [item.id]: true }));
    try {
      const response = await add_to_cart(item.menu_item_id, newQuantity);

      if (response?.success) {
        // Fetch updated cart to ensure totals and quantities are synced
        const cartRes = await get_cart();
        if (cartRes?.success && cartRes.data) {
          dispatch(setCart({
            items: cartRes.data.items,
            cart_id: cartRes.data.id,
            final_total: cartRes.final_total
          }));
        }
      } else {
        addToast({
          title: t("cart.error.title"),
          description: response?.error || t("cart.error.update_quantity"),
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    const parts = num.toFixed(2).split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts[1];
    return `${integerPart},${decimalPart}`;
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      addToast({
        title: t("cart.empty.title"),
        description: t("cart.empty.description"),
        color: "warning",
      });
      return;
    }
    onGatewayModalOpen();
  };

  const handleClearCart = async () => {
    if (cart.items.length === 0) return;

    setClearLoading(true);
    try {
      const res = await delete_cart();
      if (res?.success !== false) { // Assuming success or data is returned
        dispatch(clearCart());
        addToast({
          title: t("cart.success.title"),
          description: t("cart.success.clear"),
          color: "success",
        });
      } else {
        addToast({
          title: t("cart.error.title"),
          description: res?.error || t("cart.error.clear"),
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      addToast({
        title: t("cart.error.title"),
        description: t("cart.error.clear"),
        color: "danger",
      });
    } finally {
      setClearLoading(false);
    }
  };

  const handleGatewaySelection = (gateway) => {
    setSelectedGateway(gateway);
    initiatePaymentForCart(gateway);
  };

  const initiatePaymentForCart = async (gateway) => {
    // Get cart_id from the first item (all items share the same cart_id)
    const cartId = cart.items.length > 0 ? cart.items[0].cart_id : cart.cartId;

    if (!cartId) {
      addToast({
        title: t("cart.error.title"),
        description: t("cart.error.cart_id_not_found"),
        color: "danger",
      });
      return;
    }

    setCheckoutLoading(true);
    try {
      const paymentPayload = {
        payable_type: "cart",
        payable_id: cartId,
        gateway: gateway,
      };

      if (gateway === "multicaixa_express") {
        paymentPayload.phone_number = "+916354340944";
      }

      const res = await initiate_payment(paymentPayload);

      if (res?.success) {
        setPaymentData(res);
        onPaymentModalOpen();
        onClose(); // Close cart offcanvas
        onGatewayModalClose();
      } else {
        addToast({
          title: t("cart.error.payment_initiation"),
          description: res?.error || t("cart.error.payment_processing"),
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      addToast({
        title: t("cart.error.payment_initiation"),
        description: t("cart.error.payment_processing_retry"),
        color: "danger",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
        size="md"
        classNames={{
          base: "max-w-md",
        }}
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-row justify-between items-center border-b">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">{t("cart.title")}</h2>
              <p className="text-sm text-gray-500">
                {cart.items.length} {cart.items.length === 1 ? t("cart.item_count_singular") : t("cart.item_count_plural")}
              </p>
            </div>
            {cart.items.length > 0 && (
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={handleClearCart}
                isLoading={clearLoading}
              >
                {t("cart.actions.clear")}
              </Button>
            )}
          </DrawerHeader>
          <DrawerBody className="p-0">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <svg
                  className="w-24 h-24 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-gray-500 text-lg">{t("cart.empty_state.title")}</p>
              </div>
            ) : (
              <div className="divide-y">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.menu_item?.image ||
                          "/cardapio/default.png"
                        }
                        alt={item.menu_item?.name || "Item"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.menu_item?.name || "Item"}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="default"
                          onPress={() => handleUpdateQuantity(item, -1)}
                          isDisabled={updatingItems[item.id] || parseInt(item.quantity) <= 1}
                          className="w-8 h-8 min-w-8"
                        >
                          -
                        </Button>
                        <span className="font-semibold min-w-[20px] text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => handleUpdateQuantity(item, 1)}
                          isLoading={updatingItems[item.id]}
                          className="w-8 h-8 min-w-8"
                        >
                          +
                        </Button>
                      </div>
                      <p className="text-lg font-bold text-red-600 mt-2">
                        {formatPrice(
                          parseFloat(item.menu_item?.price || 0) *
                          parseInt(item.quantity || 1)
                        )}{" "}
                        {item.menu_item?.currency?.code || "Kz"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DrawerBody>
          {cart.items.length > 0 && (
            <DrawerFooter className="border-t">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">{t("cart.total")}</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(cart.finalTotal)} Kz
                  </span>
                </div>
                <Button
                  color="primary"
                  className="w-full bg-red-600 text-white font-bold"
                  size="lg"
                  onPress={handleCheckout}
                  isLoading={checkoutLoading}
                >
                  {t("cart.actions.checkout")}
                </Button>
              </div>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>

      <PaymentGatewayModal
        isOpen={isGatewayModalOpen}
        onClose={onGatewayModalClose}
        onSelectGateway={handleGatewaySelection}
        allowedGateways={["multicaixa_express"]}
      />

      <PaymentInstructionsModal
        isOpen={isPaymentModalOpen}
        onClose={onPaymentModalClose}
        paymentData={paymentData}
      />
    </>
  );
};

export default CartOffcanvas;
