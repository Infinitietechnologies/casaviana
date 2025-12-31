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

const PaymentGatewayModal = ({
  isOpen,
  onClose,
  onSelectGateway,
  allowedGateways = null,
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
      onClose();
    }
  };

  const isGatewayAllowed = (gateway) => {
    return allowedGateways === null || allowedGateways.includes(gateway);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold">
              Selecione o Método de Pagamento
            </ModalHeader>
            <ModalBody className="py-6">
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
                      <div className="text-3xl">💳</div>
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
            </ModalBody>
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
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PaymentGatewayModal;