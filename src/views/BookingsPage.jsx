"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Chip,
  Spinner,
  Button,
  Skeleton,
  Select,
  SelectItem,
} from "@heroui/react";
import { get_booking, get_booking_details } from "@/Api/api";
import BookingDetailsModal from "../components/Modals/BookingDetailsModal";
import ProfileSidebar from "./ProfileSidebar";

const statusColorMap = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
};

const statusOptions = [
  { key: "all", label: "All Status" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
];

const TableSkeleton = () => (
  <Table aria-label="Loading bookings">
    <TableHeader>
      <TableColumn>BOOKING #</TableColumn>
      <TableColumn>EVENT</TableColumn>
      <TableColumn>TICKET TYPE</TableColumn>
      <TableColumn>QTY</TableColumn>
      <TableColumn>AMOUNT</TableColumn>
      <TableColumn>STATUS</TableColumn>
      <TableColumn>BOOKED AT</TableColumn>
      <TableColumn>ACTIONS</TableColumn>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-24 rounded" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loadingBookingId, setLoadingBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get_booking(page, perPage, statusFilter);

      if (response?.success !== false && response?.data) {
        const paginationData = response.data;

        // Set bookings array
        setBookings(
          Array.isArray(paginationData.data) ? paginationData.data : []
        );

        // Set pagination info
        setTotalPages(paginationData.last_page || 1);
        setTotalRecords(paginationData.total || 0);
      } else {
        setError(response?.error || "Failed to load bookings");
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setError("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value) => {
    const selectedValue = Array.from(value)[0];
    setStatusFilter(selectedValue || "all");
    setPage(1); // Reset to first page when filter changes
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = async (bookingNumber) => {
    setLoadingBookingId(bookingNumber);
    try {
      const response = await get_booking_details(bookingNumber);
      if (response && (response.success || response.success === undefined) && response.data) {
          // The API returns { success: true, data: { ... } }
          setSelectedBooking(response.data);
          setIsDetailsOpen(true);
      } else {
        console.error("Failed to load details", response);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBookingId(null);
    }
  };

  const formatAmount = (amount, currencyId = 1) => {
    if (!amount) return "0.00 AOA";
    return `${parseFloat(amount).toLocaleString()} AOA`;
  };

  if (error && !loading) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 mt-24 px-4 mb-8">
        <ProfileSidebar currentPath="/orders" />
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
              onPress={fetchBookings}
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
      <ProfileSidebar currentPath="/orders" />

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Event Bookings</h1>
          <p className="text-gray-600 mt-2">
            View all your event ticket bookings
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <Select
                placeholder="Select status"
                selectedKeys={new Set([statusFilter])}
                onSelectionChange={handleStatusChange}
                className="max-w-xs"
                size="md"
                variant="bordered"
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-2">
              {statusFilter !== "all" && (
                <Button
                  onPress={handleClearFilters}
                  variant="flat"
                  color="warning"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  }
                >
                  Clear Filters
                </Button>
              )}
              <Button
                onPress={fetchBookings}
                color="primary"
                variant="flat"
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
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                }
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
                <span>
                  <strong>{totalRecords}</strong> total bookings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                <span>
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
                <span>
                  Showing <strong>{perPage}</strong> per page
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <TableSkeleton />
          </div>
        ) : bookings.length === 0 ? (
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
                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
              />
            </svg>
            <p className="text-gray-600 text-lg">
              {statusFilter !== "all"
                ? `No ${statusFilter} bookings found`
                : "No bookings found"}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {statusFilter !== "all"
                ? "Try selecting a different status filter"
                : "Your event bookings will appear here"}
            </p>
            {statusFilter !== "all" && (
              <Button
                onPress={handleClearFilters}
                className="mt-4 bg-amber-500 text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table
                aria-label="Bookings table"
                className="min-w-full"
                bottomContent={
                  totalPages > 1 ? (
                    <div className="flex w-full justify-center py-4">
                      <Pagination
                        showControls
                        page={page}
                        total={totalPages}
                        onChange={setPage}
                        color="warning"
                        size="lg"
                      />
                    </div>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn>BOOKING #</TableColumn>
                  <TableColumn>EVENT</TableColumn>
                  <TableColumn>TICKET TYPE</TableColumn>
                  <TableColumn>QTY</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>BOOKED AT</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>

                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <span className="font-mono text-sm font-medium">
                          {booking.booking_number || `#${booking.id}`}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {booking.event?.title || "-"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(booking.event?.event_date)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {booking.items?.[0]?.ticket_type?.name || "-"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold text-gray-900">
                          {booking.total_tickets || 0}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold text-gray-900">
                          {formatAmount(
                            booking.total_amount,
                            booking.currency_id
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Chip
                          color={statusColorMap[booking.status] || "default"}
                          size="sm"
                          variant="flat"
                          className="capitalize"
                        >
                          {booking.status}
                        </Chip>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {formatDateTime(booking.booked_at)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          onPress={() => handleViewDetails(booking.booking_number)}
                          isLoading={loadingBookingId === booking.booking_number}
                          aria-label="View Details"
                        >
                          {!loadingBookingId && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      <BookingDetailsModal 
        isOpen={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        booking={selectedBooking} 
      />
    </div>
  );
}