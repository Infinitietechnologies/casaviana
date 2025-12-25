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
  Spinner,
  Button,
  useDisclosure,
} from "@heroui/react";
import PaymentProofModal from "@/components/Modals/PaymentProofModal";

const PaymentsView = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upload Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

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
    fetchPayments(); // Refresh list to show updated status/proof
  };

  // Helper function to extract string value from object or return string as-is
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
    const curCode = typeof currency === "object" ? (currency.code || "AOA") : currency;
    return `${parseFloat(amount).toFixed(2)} ${curCode}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" label="Loading payments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchPayments}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">View all your payment transactions</p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No payments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table aria-label="Payments table" className="min-w-full">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>METHOD</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>REFERENCE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const statusKey = getStatusKey(payment.status);
                const showUpload = statusKey === "pending" && !payment.proof_file_url;

                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <span className="font-mono text-sm">#{payment.id}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700">
                        {formatDate(payment.created_at || payment.date)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        {formatAmount(payment.amount, payment.currency)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize text-gray-700">
                        {getStringValue(payment.gateway || payment.payment_method || payment.method)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={statusKey === "completed" ? "success" : statusKey === "pending" ? "warning" : "default"}
                        variant="flat"
                        size="sm"
                        className="capitalize"
                      >
                        {getStringValue(payment.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-gray-600">
                        {payment.reference || payment.transaction_id || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {showUpload ? (
                        <Button
                          size="sm"
                          className="bg-amber-500 text-white font-semibold"
                          onPress={() => handleUploadClick(payment.id)}
                        >
                          Enviar Comprovativo
                        </Button>
                      ) : payment.proof_file_url ? (
                        <div className="flex items-center gap-2 text-success">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15l4.5-4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                          </svg>
                          <a 
                            href={payment.proof_file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs hover:underline"
                          >
                            Ver Comprovativo
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Nenhuma ação</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <PaymentProofModal 
        isOpen={isOpen} 
        onClose={onClose} 
        paymentId={selectedPaymentId}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default PaymentsView;
