"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Chip,
    Button,
    Skeleton,
    Select,
    SelectItem,
    Input,
} from "@heroui/react";
import { get_orders } from "@/Api/api";
import OrderDetailsModal from "../components/Modals/OrderDetailsModal";
import ProfileSidebar from "./ProfileSidebar";
import { useTranslation } from "react-i18next";

const statusColorMap = {
    completed: "success",
    delivered: "success",
    pending: "warning",
    processing: "primary",
    cancelled: "danger",
};

export default function OrdersView() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const statusOptions = useMemo(() => [
        { key: "all", label: t("orders.status.all") },
        { key: "pending", label: t("orders.status.pending") },
        { key: "processing", label: t("orders.status.processing") },
        { key: "completed", label: t("orders.status.completed") },
        { key: "delivered", label: t("orders.status.delivered") },
        { key: "cancelled", label: t("orders.status.cancelled") },
    ], [t]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter, debouncedSearch]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await get_orders(
                page,
                perPage,
                statusFilter,
                debouncedSearch
            );

            if (response?.success !== false && response?.data) {
                // Handle pagination structure from API
                const paginationData = response.pagination || response;
                const ordersData = response.data || [];

                setOrders(ordersData);
                setTotalPages(paginationData.last_page || 1);
                setTotalRecords(paginationData.total || 0);
            } else {
                setError(response?.error || t("orders.error.fetch_failed"));
                setOrders([]);
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
            setError(t("orders.error.fetch_failed"));
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (value) => {
        const selectedValue = Array.from(value)[0];
        setStatusFilter(selectedValue || "all");
        setPage(1);
    };

    const handleClearFilters = () => {
        setStatusFilter("all");
        setSearchQuery("");
        setDebouncedSearch("");
        setPage(1);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("pt-AO", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const formatAmount = (amount) => {
        if (!amount) return "0.00 AOA";
        const num = parseFloat(amount);
        const parts = num.toFixed(2).split(".");
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const decimalPart = parts[1];
        return `${integerPart},${decimalPart} AOA`;
    };

    const TableSkeleton = () => (
        <Table aria-label={t("orders.title")}>
            <TableHeader>
                <TableColumn>{t("orders.table.order_number")}</TableColumn>
                <TableColumn>{t("orders.table.items")}</TableColumn>
                <TableColumn>{t("orders.table.total_amount")}</TableColumn>
                <TableColumn>{t("orders.table.status")}</TableColumn>
                <TableColumn>{t("orders.table.date")}</TableColumn>
                <TableColumn>{t("orders.table.actions")}</TableColumn>
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
                            onPress={fetchOrders}
                            className="bg-amber-500 text-white font-semibold"
                        >
                            {t("orders.error.retry")}
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
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t("orders.title")}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {t("orders.subtitle")}
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 max-w-xs">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("orders.filters.status")}
                            </label>
                            <Select
                                placeholder={t("orders.filters.select_status")}
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

                        <div className="flex-1 max-w-xs">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t("orders.filters.search")}
                            </label>
                            <Input
                                placeholder={t("orders.filters.search_placeholder")}
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                startContent={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                    </svg>
                                }
                                size="md"
                                variant="bordered"
                                isClearable
                                onClear={() => setSearchQuery("")}
                            />
                        </div>

                        <div className="flex gap-2">
                            {(statusFilter !== "all" || searchQuery) && (
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
                                    {t("orders.filters.clear")}
                                </Button>
                            )}
                            <Button
                                onPress={fetchOrders}
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
                                {t("orders.filters.refresh")}
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
                                    <strong>{totalRecords}</strong> {t("orders.pagination.total_orders")}
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
                                    {t("orders.pagination.page")} <strong>{page}</strong> {t("orders.pagination.of")}{" "}
                                    <strong>{totalPages}</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <TableSkeleton />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        {/* Food related empty state icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="mx-auto h-16 w-16 text-gray-300 mb-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>

                        <p className="text-gray-600 text-lg">
                            {statusFilter !== "all" || searchQuery
                                ? t("orders.empty.filtered")
                                : t("orders.empty.title")}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            {statusFilter !== "all" || searchQuery
                                ? t("orders.empty.filtered_subtitle")
                                : t("orders.empty.subtitle")}
                        </p>
                        {(statusFilter !== "all" || searchQuery) && (
                            <Button
                                onPress={handleClearFilters}
                                className="mt-4 bg-amber-500 text-white"
                            >
                                {t("orders.empty.clear_filters")}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table
                                aria-label={t("orders.title")}
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
                                    <TableColumn>{t("orders.table.order_number")}</TableColumn>
                                    <TableColumn>{t("orders.table.items")}</TableColumn>
                                    <TableColumn>{t("orders.table.total_amount")}</TableColumn>
                                    <TableColumn>{t("orders.table.status")}</TableColumn>
                                    <TableColumn>{t("orders.table.date")}</TableColumn>
                                    <TableColumn>{t("orders.table.actions")}</TableColumn>
                                </TableHeader>

                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <span className="font-mono text-sm font-medium">
                                                    #{order.id}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">
                                                        {order.items?.length > 0 ? order.items[0].menu_item?.name : t("orders.item.no_items")}
                                                    </span>
                                                    {order.items?.length > 1 && (
                                                        <span className="text-xs text-gray-500">
                                                            {t("orders.item.more_items", { count: order.items.length - 1 })}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <span className="font-semibold text-gray-900">
                                                    {formatAmount(order.total_amount)}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    color={statusColorMap[order.status] || "default"}
                                                    size="sm"
                                                    variant="flat"
                                                    className="capitalize"
                                                >
                                                    {t(`orders.status.${order.status}`) || order.status}
                                                </Chip>
                                            </TableCell>

                                            <TableCell>
                                                <span className="text-sm text-gray-700">
                                                    {formatDateTime(order.created_at)}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="primary"
                                                    onPress={() => handleViewDetails(order)}
                                                    aria-label={t("orders.actions.view_details")}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
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

            <OrderDetailsModal
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                order={selectedOrder}
            />
        </div>
    );
}
