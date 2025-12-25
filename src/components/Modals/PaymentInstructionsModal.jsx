import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useRouter } from "next/router";

const PaymentInstructionsModal = ({ isOpen, onClose, paymentData }) => {
  const router = useRouter();

  if (!paymentData) return null;

  console.log("PaymentInstructionsModal data:", paymentData);

  const handleGoToPayments = () => {
    onClose();
    router.push("/payments");
  };

  const displayData = paymentData?.data?.data || paymentData?.data || {};
  const displayMessage = paymentData?.message || paymentData?.data?.message || "Por favor, proceda com a transferência bancária utilizando os detalhes abaixo.";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold text-gray-900 border-b">
              Prossiga com o Pagamento
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <p className="text-amber-700 text-sm">
                  {displayMessage}
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

                {/* <div className="mt-6">
                  <h4 className="font-bold text-gray-900 mb-2 underline">Instruções:</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {displayData.instructions || "Por favor, entre em contato com o administrador para obter os dados bancários."}
                  </p>
                </div> */}

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
              <Button color="danger" variant="light" onPress={onClose}>
                Fechar
              </Button>
              <Button 
                className="bg-red-500 text-white font-bold" 
                onPress={handleGoToPayments}
              >
                Ver Meus Pagamentos
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PaymentInstructionsModal;
