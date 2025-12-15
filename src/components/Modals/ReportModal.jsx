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

const ReportModal = ({ isOpen, onOpenChange, onSubmit, isSubmitting }) => {
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
            <ModalHeader className="flex flex-col gap-1">Report Comment</ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-500 mb-2">
                Please provide a reason for reporting this comment.
              </p>
              <Textarea
                placeholder="Enter your reason here..."
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
                Cancel
              </Button>
              <Button 
                color="danger" 
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!reason.trim()}
              >
                Submit Report
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;
