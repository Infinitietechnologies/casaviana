import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  addToast,
} from "@heroui/react";
import { useRouter } from "next/router";
import { check_payment_status, get_cart, get_payment_gateways } from "@/Api/api";
import { useDispatch } from "react-redux";
import { setCart } from "@/store/cartSlice";
import { useTranslation } from "react-i18next";

const PaymentInstructionsModal = ({
  isOpen,
  onClose,
  paymentData,
  shouldUpdateCart = true
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isPolling, setIsPolling] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentGateways, setPaymentGateways] = useState(null);
  const pollingIntervalRef = useRef(null);

  const displayData = paymentData?.data?.data || paymentData?.data || {};
  const paymentUrl = displayData?.payment_url || displayData?.frame_url;
  const paymentReference = displayData?.reference;

  // Check if this is Multicaixa Express payment
  const action = paymentData?.data?.action;
  const isMulticaixa = action === "multicaixa_token" || !!paymentUrl;

  const updateCart = async () => {
    try {
      const res = await get_cart();
      if (res?.success && res.data) {
        dispatch(setCart({
          items: res.data.items || [],
          cart_id: res.data.id || null,
          final_total: res.final_total || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const getPaymentGateways = async () => {
    try {
      const res = await get_payment_gateways();
      if (res?.success && res.data) {
        setPaymentGateways(res.data);
      }
    } catch (error) {
      console.error("Failed to get payment gateways:", error);
    }
  };

  useEffect(() => {
    if (isOpen && !isMulticaixa) {
      getPaymentGateways();
    }
  }, [isOpen, isMulticaixa]);

  useEffect(() => {
    // Only poll for Multicaixa Express payments
    if (isOpen && paymentReference && isMulticaixa) {
      setIsPolling(true);

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await check_payment_status(paymentReference);
          if (response?.success) {
            const status = response?.data?.status || response?.status;

            // Only handle succeeded or failed, ignore pending
            if (status === "succeeded") {
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              setIsPolling(false);
              setPaymentStatus("succeeded");

              // Refresh cart on success (it should be empty)
              if (shouldUpdateCart) {
                await updateCart();
              }

              addToast({
                title: t("modals.payment_result.success.title"),
                description: t("modals.payment_result.success.description"),
                color: "success",
              });
              setTimeout(() => {
                onClose();
                router.push("/payments");
              }, 2000);
            } else if (status === "failed") {
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              setIsPolling(false);
              setPaymentStatus("failed");
              addToast({
                title: t("modals.payment_result.failed.title"),
                description: t("modals.payment_result.failed.description"),
                color: "danger",
              });
              setTimeout(() => {
                onClose();
              }, 2000);
            }
            // If status is "pending", do nothing - continue polling silently
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }, 3000);
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setIsPolling(false);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isOpen, paymentReference, isMulticaixa, onClose, router, dispatch, shouldUpdateCart]);

  const handleClose = async () => {
    // Stop polling and clean up

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
    setPaymentStatus(null);

    // Update cart when closing modal manually, but only if requested
    if (shouldUpdateCart) {
      await updateCart();
    }

    onClose();
  };

  if (!paymentData) return null;

  // Prevent closing when Multicaixa payment is in progress
  const canClose = !isMulticaixa || !isPolling || paymentStatus === "succeeded" || paymentStatus === "failed";

  return (
    <Modal
      isOpen={isOpen}
      onClose={canClose ? handleClose : undefined}
      size={isMulticaixa ? "md" : "2xl"}
      hideCloseButton={true}
      isDismissable={canClose}
      scrollBehavior={isMulticaixa ? "outside" : "inside"}
      isKeyboardDismissDisabled={!canClose}
      classNames={{
        base: isMulticaixa ? "max-w-md" : "overflow-auto",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold text-gray-900 border-b">
              {t("modals.payment_instructions.title")}
            </ModalHeader>
            {isMulticaixa ? (
              <ModalBody className="p-0">
                {paymentUrl && (
                  <div className="relative w-full bg-white">
                    <button
                      onClick={handleClose}
                      className="absolute right-2 top-2 z-50 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all border border-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <iframe
                      src={paymentUrl}
                      className="w-full border-0"
                      style={{ height: "760px", minHeight: "700px" }}
                      title="Multicaixa Express Payment"
                      allow="payment"
                    />
                  </div>
                )}
              </ModalBody>
            ) : (
              <>
                <ModalBody className="py-6">
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                    <p className="text-amber-700 text-sm">
                      {paymentData?.message || paymentData?.data?.message || t("modals.payment_instructions.message")}
                    </p>
                  </div>

                  <div className="space-y-4">

                    {/* Bank Gateway Details */}
                    {(() => {
                      const bankGateway = paymentGateways?.find(g => g.gateway === "bank_transfer");
                      if (!bankGateway) return (
                        <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <Spinner color="warning" size="md" />
                          <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("modals.payment_instructions.loading_gateways")}</p>
                        </div>
                      );

                      const { credentials } = bankGateway;

                      const DetailItem = ({ label, value, icon }) => (
                        <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shadow-inner">
                              {icon}
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{label}</p>
                              <p className="text-sm font-extrabold text-gray-800 font-mono tracking-tight">{value}</p>
                            </div>
                          </div>
                          <Button
                            variant="bordered"
                            size="sm"
                            className="font-bold text-[10px] h-8 min-w-[80px] border-gray-200 bg-gray-100/30 hover:bg-gray-100/50 transition-colors rounded-xl"
                            startContent={
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                              </svg>
                            }
                            onPress={() => {
                              navigator.clipboard.writeText(value);
                              addToast({
                                title: t("modals.actions.copied"),
                                color: "success",
                                size: "sm"
                              });
                            }}
                          >
                            {t("modals.actions.copy")}
                          </Button>
                        </div>
                      );

                      return (
                        <div className="space-y-4">
                          {/* Top row: Amount & Reference */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <DetailItem
                              label={t("modals.payment_instructions.total_amount")}
                              value={`${displayData.amount} ${displayData.currency}`}
                              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            />
                            <DetailItem
                              label={t("modals.payment_instructions.reference")}
                              value={displayData.reference}
                              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                            />
                          </div>

                          {/* Full width: Account Name */}
                          <DetailItem
                            label={t("modals.payment_instructions.account_name")}
                            value={credentials.account_name}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                          />

                          {/* Bottom Grid: The 4 specific items side-by-side */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem
                              label={t("modals.payment_instructions.account_number")}
                              value={credentials.account_number}
                              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                            />
                            <DetailItem
                              label={t("modals.payment_instructions.bank_name")}
                              value={credentials.bank_name}
                              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                            />
                            <DetailItem
                              label={t("modals.payment_instructions.bank_code")}
                              value={credentials.swift}
                              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            />
                            <DetailItem
                              label={t("modals.payment_instructions.iban")}
                              value={credentials.iban}
                              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            />
                          </div>
                          {/* Important Instructions Box */}
                          <div className="mt-8 bg-amber-50/50 border border-amber-100 rounded-3xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                              <div className="p-2 bg-amber-500 rounded-full text-white shadow-md shadow-amber-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              </div>
                              <h5 className="font-black text-gray-800 uppercase tracking-widest text-sm">{t("modals.payment_instructions.important_instructions")}</h5>
                            </div>
                            <ul className="space-y-4">
                              {/* Dynamic Instructions */}
                              {(bankGateway.instructions || "").split(/\r?\n/).filter(line => line.trim()).map((line, idx) => (
                                <li key={`dyn-${idx}`} className="flex gap-4 text-sm text-gray-600 leading-relaxed font-bold group">
                                  <span className="text-amber-500 mt-1 flex-shrink-0 bg-white p-1 rounded-lg shadow-sm group-hover:bg-amber-50 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                  </span>
                                  <span className="opacity-90">{line}</span>
                                </li>
                              ))}
                              {/* Static Instructions */}
                              {[1, 2, 3, 4].map((num) => (
                                <li key={`stat-${num}`} className="flex gap-4 text-sm text-gray-600 leading-relaxed font-bold group">
                                  <span className="text-amber-500 mt-1 flex-shrink-0 bg-white p-1 rounded-lg shadow-sm group-hover:bg-amber-50 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                  </span>
                                  <span className="opacity-90">{t(`modals.payment_instructions.static_instructions.line_${num}`)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </ModalBody>
              </>
            )}

            <ModalFooter className="border-t gap-3">
              <Button
                variant="bordered"
                className="flex-1 font-bold border-gray-200"
                onPress={handleClose}
              >
                {t("modals.actions.cancel")}
              </Button>
              <Button
                className="flex-[2] bg-orange-500 text-white font-extrabold shadow-lg shadow-orange-200"
                onPress={() => {
                  handleClose();
                  router.push("/payments");
                }}
              >
                {t("modals.actions.confirm_payment_method")}
              </Button>
            </ModalFooter>
          </>
        )}

      </ModalContent>
    </Modal >
  );
};

export default PaymentInstructionsModal;