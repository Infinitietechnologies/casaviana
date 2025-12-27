import React, { useState, useEffect } from "react";
import { get_payments } from "@/Api/api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Skeleton,
} from "@heroui/react";
import PaymentProofModal from "@/components/Modals/PaymentProofModal";
import { useRouter } from "next/navigation";
import ProfileSidebar from "./ProfileSidebar";

const PaymentsView = () => {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upload Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  // Image Preview Modal State
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await get_payments();
      if (response?.success !== false && response?.data) {
        setPayments(response.data);
      } else {
        setError(response?.error || "Failed to load payments");
      }
    } catch (err) {
      setError("Failed to load payments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (paymentId) => {
    setSelectedPaymentId(paymentId);
    onOpen();
  };

  const handleUploadSuccess = () => {
    fetchPayments();
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    onImageOpen();
  };

  const getStringValue = (value) => {
    if (!value) return "N/A";
    if (typeof value === "object" && value !== null) {
      return value.label || value.key || value.name || "N/A";
    }
    return String(value);
  };

  const getStatusKey = (value) => {
    if (typeof value === "object" && value !== null) {
      return value.key || "";
    }
    return String(value || "").toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, currency = "AOA") => {
    if (!amount) return "N/A";
    const curCode =
      typeof currency === "object" ? currency.code || "AOA" : currency;
    return `${parseFloat(amount).toFixed(2)} ${curCode}`;
  };

  const getStatusColor = (statusKey) => {
    switch (statusKey) {
      case "completed":
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "proof_uploaded":
        return "primary";
      case "failed":
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const TableSkeleton = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table aria-label="Loading payments">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
          <TableColumn>METHOD</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TYPE</TableColumn>
          {/* <TableColumn>REFERENCE</TableColumn> */}
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-16 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24 rounded" />
              </TableCell>
              {/* <TableCell>
                <Skeleton className="h-4 w-32 rounded" />
              </TableCell> */}
              <TableCell>
                <Skeleton className="h-8 w-28 rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 mt-24 px-4 mb-8">
        <ProfileSidebar currentPath="/payments" />
        <div className="flex-1 flex justify-center items-center min-h-[400px]">
          <div className="text-center bg-white rounded-lg shadow p-8">
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button
              onPress={fetchPayments}
              className="bg-amber-500 text-white font-semibold"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 mt-24 px-4 mb-8">
      <ProfileSidebar currentPath="/payments" />

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-2">
            View all your payment transactions
          </p>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
            <p className="text-gray-600 text-lg">No payments found</p>
            <p className="text-gray-500 text-sm mt-2">
              Your payment history will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table aria-label="Payments table" className="min-w-full">
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                  <TableColumn>METHOD</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>TYPE</TableColumn>
                  {/* <TableColumn>REFERENCE</TableColumn> */}
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => {
                    const statusKey = getStatusKey(payment.status);
                    const showUpload =
                      statusKey === "pending" && !payment.proof_file_url;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <span className="font-mono text-sm font-medium">
                            #{payment.id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {formatDate(payment.created_at || payment.date)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-gray-900">
                            {formatAmount(payment.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm capitalize text-gray-700">
                            {getStringValue(
                              payment.gateway ||
                                payment.payment_method ||
                                payment.method
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={getStatusColor(statusKey)}
                            variant="flat"
                            size="sm"
                            className="capitalize"
                          >
                            {getStringValue(payment.status)}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            variant="bordered"
                            size="sm"
                            className="capitalize"
                          >
                            {payment.payable_type || "N/A"}
                          </Chip>
                        </TableCell>
                        {/* <TableCell>
                          <span className="font-mono text-xs text-gray-600">
                            {payment.payable_details.reference}
                          </span>
                        </TableCell> */}
                        <TableCell>
                          {showUpload ? (
                            <Button
                              size="sm"
                              className="bg-amber-500 text-white font-semibold hover:bg-amber-600"
                              onPress={() => handleUploadClick(payment.id)}
                              isIconOnly
                              startContent={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  {/* Send (paper plane) */}
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M22 2L11 13"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M22 2L15 22L11 13L2 9L22 2Z"
                                  />

                                  {/* Proof (check mark) */}
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7.5 14.5l2 2 4-4"
                                  />
                                </svg>
                              }
                            >
                              
                            </Button>
                          ) : payment.proof_file_url ? (
                            <Button
                              size="sm"
                              variant="flat"
                              color="success"
                              onPress={() =>
                                handleImageClick(payment.proof_file_url)
                              }
                              isIconOnly
                              startContent={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              }
                            ></Button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Nenhuma ação
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <PaymentProofModal
        isOpen={isOpen}
        onClose={onClose}
        paymentId={selectedPaymentId}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Image Preview Modal */}
      <Modal
        isOpen={isImageOpen}
        onClose={onImageClose}
        size="3xl"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Payment Proof
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center items-center">
                  <img
                    src={selectedImage}
                    alt="Payment proof"
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* <Button
                  color="primary"
                  as="a"
                  href={selectedImage}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PaymentsView;
