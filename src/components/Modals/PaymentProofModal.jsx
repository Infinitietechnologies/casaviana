import React, { useState, useRef } from "react";
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
import { upload_payment_proof } from "@/Api/api";
import { useTranslation } from "react-i18next";

const PaymentProofModal = ({ isOpen, onClose, paymentId, onUploadSuccess }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError(t("modals.proof.validation.invalid_type"));
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError(t("modals.proof.validation.size_limit"));
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      addToast({
        title: t("modals.proof.validation.error_title"),
        description: t("modals.proof.validation.no_file"),
        color: "danger",
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await upload_payment_proof(paymentId, file);
      if (res?.success) {
        addToast({
          title: t("modals.proof.success.title"),
          description: t("modals.proof.success.message"),
          color: "success",
        });
        onUploadSuccess();
        handleClose();
      } else {
        const errorMsg = res?.error || t("modals.proof.error.generic");
        setError(errorMsg);
        addToast({
          title: t("modals.proof.error.upload_title"),
          description: typeof errorMsg === 'string' ? errorMsg : t("modals.proof.file_info"),
          color: "danger",
        });
      }
    } catch (err) {
      setError(t("modals.proof.error.unexpected"));
      addToast({
        title: t("modals.proof.error.upload_title"),
        description: t("modals.proof.error.unexpected"),
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="font-bold">{t("modals.proof.title")}</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center justify-center space-y-4">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />

                <div
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {preview ? (
                    <img src={preview} alt="Proof preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500 font-medium">{t("modals.proof.select_image")}</p>
                      <p className="mt-1 text-xs text-gray-400">{t("modals.proof.file_info")}</p>
                    </div>
                  )}
                </div>

                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose} disabled={loading}>
                {t("modals.actions.cancel")}
              </Button>
              <Button
                className="bg-amber-500 text-white font-bold"
                onPress={handleUpload}
                isLoading={loading}
                disabled={!file || loading}
              >
                {loading ? t("modals.proof.loading") : t("modals.proof.submit")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PaymentProofModal;
