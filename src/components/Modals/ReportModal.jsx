import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

const ReportModal = ({ isOpen, onOpenChange, onSubmit, isSubmitting }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit(reason);
    setReason(""); // Reset on submit
  };

  const handleClose = (onClose) => {
    setReason(""); // Reset on close
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{t("modals.report.title")}</ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-500 mb-2">
                {t("modals.report.description")}
              </p>
              <Textarea
                placeholder={t("modals.report.placeholder")}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                minRows={3}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => handleClose(onClose)}
              >
                {t("modals.actions.cancel")}
              </Button>
              <Button
                color="danger"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!reason.trim()}
              >
                {t("modals.report.submit")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;
