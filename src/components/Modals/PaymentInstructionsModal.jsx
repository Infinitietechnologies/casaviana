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
import { check_payment_status, get_cart } from "@/Api/api";
import { useDispatch } from "react-redux";
import { setCart } from "@/store/cartSlice";

const PaymentInstructionsModal = ({ 
  isOpen, 
  onClose, 
  paymentData, 
  shouldUpdateCart = true 
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isPolling, setIsPolling] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
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
                title: "Pagamento bem-sucedido",
                description: "Seu pagamento foi processado com sucesso!",
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
                title: "Pagamento falhou",
                description: "O pagamento não foi processado. Por favor, tente novamente.",
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
      size={isMulticaixa ? "md" : "md"}
      hideCloseButton={true}
      isDismissable={canClose}
      isKeyboardDismissDisabled={!canClose}
      classNames={{
        base: isMulticaixa ? "max-w-md" : "",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
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
                <ModalHeader className="flex flex-col gap-1 text-2xl font-bold text-gray-900 border-b">
                  Prossiga com o Pagamento
                </ModalHeader>
                <ModalBody className="py-6">
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                    <p className="text-amber-700 text-sm">
                      {paymentData?.message || paymentData?.data?.message || "Por favor, proceda com a transferência bancária utilizando os detalhes abaixo."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Referência:</span>
                      <span className="font-mono font-bold text-gray-900">{displayData.reference}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Valor Total:</span>
                      <span className="font-bold text-xl text-amber-600">
                        {displayData.amount} {displayData.currency}
                      </span>
                    </div>

                    {displayData.bank_details && displayData.bank_details.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-bold text-gray-900 mb-2">Dados Bancários:</h4>
                        <div className="space-y-3">
                          {displayData.bank_details.map((bank, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <p className="text-sm font-bold text-gray-800">{bank.bank_name}</p>
                              <p className="text-sm text-gray-600">IBAN: <span className="font-mono">{bank.iban}</span></p>
                              <p className="text-sm text-gray-600">Conta: <span className="font-mono">{bank.account_number}</span></p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter className="border-t">
                  <Button color="danger" variant="light" onPress={handleClose}>
                    Fechar
                  </Button>
                  <Button 
                    className="bg-red-500 text-white font-bold" 
                    onPress={() => {
                      handleClose();
                      router.push("/payments");
                    }}
                  >
                    Ver Meus Pagamentos
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PaymentInstructionsModal;