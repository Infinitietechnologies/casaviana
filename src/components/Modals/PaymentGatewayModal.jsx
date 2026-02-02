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
  Spinner,
} from "@heroui/react";
import Image from "next/image";
import { get_payment_gateways } from "@/Api/api";
import { useTranslation } from "react-i18next";

const PaymentGatewayModal = ({
  isOpen,
  onClose,
  onSelectGateway,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [gateways, setGateways] = useState([]);
  const [loadingGateways, setLoadingGateways] = useState(false);

  // Fetch gateways when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchGateways();
    } else {
      setSelectedGateway(null);
    }
  }, [isOpen]);

  const fetchGateways = async () => {
    setLoadingGateways(true);
    try {
      const response = await get_payment_gateways();
      if (response?.success !== false && response?.data) {
        // Filter only enabled gateways
        const enabledGateways = response.data.filter(
          (gateway) => gateway.is_enabled,
        );
        setGateways(enabledGateways);
      }
    } catch (error) {
      console.error("Failed to fetch payment gateways:", error);
    } finally {
      setLoadingGateways(false);
    }
  };

  const handleConfirm = () => {
    if (selectedGateway) {
      onSelectGateway(selectedGateway);
    }
  };

  const getGatewayIcon = (gateway) => {
    switch (gateway) {
      case "bank_transfer":
        return "🏦";
      case "multicaixa_express":
        return null; // Use image instead
      default:
        return "💳";
    }
  };

  const getGatewayDescription = (gateway) => {
    if (gateway === "bank_transfer") {
      return t("modals.payment_gateway.descriptions.bank_transfer");
    }
    if (gateway === "multicaixa_express") {
      return t("modals.payment_gateway.descriptions.multicaixa_express");
    }
    return "";
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
              {isLoading
                ? t("modals.payment_gateway.processing")
                : t("modals.payment_gateway.select_method")}
              {isLoading && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                    {t("modals.payment_gateway.waiting_confirmation")}
                  </div>
                </div>
              ) : loadingGateways ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Spinner size="lg" color="primary" />
                  <p className="mt-4 text-gray-500">
                    {t("modals.payment_gateway.loading")}
                  </p>
                </div>
              ) : gateways.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {t("modals.payment_gateway.no_methods")}
                  </p>
                </div>
              ) : (
                <RadioGroup
                  value={selectedGateway}
                  onValueChange={setSelectedGateway}
                  classNames={{
                    wrapper: "gap-4",
                  }}
                >
                  {gateways.map((gateway) => (
                    <Radio
                      key={gateway.id}
                      value={gateway.gateway}
                      classNames={{
                        base: "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent data-[selected=true]:border-primary",
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {gateway.gateway === "multicaixa_express" ? (
                          <Image
                            src="/images/express.png"
                            alt={gateway.display_name}
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="text-3xl">
                            {getGatewayIcon(gateway.gateway)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">
                            {gateway.display_name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {gateway.instructions ||
                              getGatewayDescription(gateway.gateway)}
                          </p>
                        </div>
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </ModalBody>
            {!isLoading && !loadingGateways && gateways.length > 0 && (
              <ModalFooter>
                <Button color="" variant="light" onPress={onClose}>
                  {t("modals.actions.cancel")}
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirm}
                  isDisabled={!selectedGateway}
                >
                  {t("modals.actions.continue")}
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
