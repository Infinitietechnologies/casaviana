import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio,
  Card,
  CardBody,
} from "@heroui/react";
import Image from "next/image";

const PaymentGatewayModal = ({
  isOpen,
  onClose,
  onSelectGateway,
  allowedGateways = null,
  isLoading = false,
}) => {
  const [selectedGateway, setSelectedGateway] = useState(null);

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedGateway(null);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedGateway) {
      onSelectGateway(selectedGateway);
    }
  };

  const isGatewayAllowed = (gateway) => {
    return allowedGateways === null || allowedGateways.includes(gateway);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="md" 
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold relative">
              {isLoading ? "Processando Pagamento" : "Selecione o Método de Pagamento"}
              {isLoading && (
                 <button 
                   onClick={onClose}
                   className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
              )}
            </ModalHeader>
            <ModalBody className="py-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="text-center text-gray-500 mt-4">
                    A aguardar confirmação do pagamento...
                  </div>
                </div>
              ) : (
                <RadioGroup
                  value={selectedGateway}
                  onValueChange={setSelectedGateway}
                  classNames={{
                    wrapper: "gap-4",
                  }}
                >
                  {isGatewayAllowed("bank_transfer") && (
                    <Radio
                      value="bank_transfer"
                      classNames={{
                        base: "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent data-[selected=true]:border-primary",
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="text-3xl">🏦</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">
                            Transferência Bancária
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Transfira diretamente para a nossa conta bancária
                          </p>
                        </div>
                      </div>
                    </Radio>
                  )}

                  {isGatewayAllowed("multicaixa_express") && (
                    <Radio
                      value="multicaixa_express"
                      classNames={{
                        base: "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent data-[selected=true]:border-primary",
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Image src="/images/express.png" alt="Multicaixa Express" width={32} height={32} />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">
                            Multicaixa Express
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Pagamento online seguro via Multicaixa
                          </p>
                        </div>
                      </div>
                    </Radio>
                  )}
                </RadioGroup>
              )}
            </ModalBody>
            {!isLoading && (
              <ModalFooter>
                <Button color="" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirm}
                  isDisabled={!selectedGateway}
                >
                  Continuar
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PaymentGatewayModal;