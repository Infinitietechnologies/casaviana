"use client";
import React, { useState, useEffect } from "react";
import { Input, Textarea, Button, Select, SelectItem, CheckboxGroup, Checkbox, Accordion, AccordionItem } from "@heroui/react";
import { create_service_booking, get_rooms, get_addons } from "@/Api/api";
import { useTranslation } from "react-i18next";

const EVENT_TYPES = [
    "Casamento",
    "Aniversário",
    "Reserva de Almoço",
    "Reserva de Jantar",
    "Encomenda",
    "Reserva Empresarial",
    "Conferência",
    "Reunião",
    "Outro",
];

const ServiceBookingForm = ({ serviceId, onSuccess, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        service_id: serviceId,
        booking_date: "",
        start_time: "",
        number_of_guests: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        whatsapp_number: "",
        institution_name: "",
        event_type: "",
        room_id: "",
        customer_notes: "",
        addons: []
    });

    const [selectedType, setSelectedType] = useState(new Set([]));
    const [customEventType, setCustomEventType] = useState("");

    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(new Set([]));

    const [addons, setAddons] = useState([]);
    const [loadingAddons, setLoadingAddons] = useState(false);
    const [selectedAddons, setSelectedAddons] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    const fetchRooms = async () => {
        setLoadingRooms(true);
        try {
            const res = await get_rooms();
            if (res?.success === undefined || res?.success) { // Handle inconsistent API wrapper
                setRooms(res.data || res); // Fallback if data is direct array
            }
        } catch (err) {
            console.error("Failed to fetch rooms", err);
        } finally {
            setLoadingRooms(false);
        }
    }

    const fetchAddons = async () => {
        setLoadingAddons(true);
        try {
            const res = await get_addons();
            if (res?.success === undefined || res?.success) {
                setAddons(res.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch addons", err);
        } finally {
            setLoadingAddons(false);
        }
    }

    useEffect(() => {
        fetchRooms();
        fetchAddons();
    }, []);

    // Sync selected type to formData.event_type
    useEffect(() => {
        const typeValue = Array.from(selectedType)[0];
        if (typeValue === "Outro") {
            setFormData((prev) => ({ ...prev, event_type: customEventType }));
        } else {
            setFormData((prev) => ({ ...prev, event_type: typeValue || "" }));
        }
    }, [selectedType, customEventType]);

    // Sync selected room to formData.room_id
    useEffect(() => {
        const roomValue = Array.from(selectedRoom)[0];
        setFormData((prev) => ({ ...prev, room_id: roomValue || "" }));
    }, [selectedRoom]);

    // Sync selected addons to formData.addons
    useEffect(() => {
        const formattedAddons = Array.from(selectedAddons).map(id => ({
            id: id,
            quantity: 1
        }));
        setFormData((prev) => ({ ...prev, addons: formattedAddons }));
    }, [selectedAddons]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Verify component is mounted to avoid state updates on unmount
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneralError("");

        try {
            const res = await create_service_booking(formData);

            if (res.success) {
                if (onSuccess) onSuccess();
            } else {
                if (isMounted) {
                    if (res.status === 401) {
                        setGeneralError(t("service_booking.errors.login_required"));
                        setErrors({ _status: 401 });
                    } else if (res.errors) {
                        setErrors(res.errors);
                    } else {
                        setGeneralError(res.error || t("service_booking.errors.generic_error"));
                    }
                }
            }
        } catch (err) {
            if (isMounted) {
                setGeneralError(t("service_booking.errors.connection_error"));
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    const isOtherSelected = Array.from(selectedType)[0] === "Outro";

    // Group addons by type
    const groupedAddons = addons.reduce((acc, addon) => {
        const type = addon.type || "Outros";
        if (!acc[type]) acc[type] = [];
        acc[type].push(addon);
        return acc;
    }, {});

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Stable container for error messages */}
            <div className="min-h-0">
                {generalError && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm border border-red-200 flex flex-col gap-2 mb-4">
                        <p>{generalError}</p>
                        {(generalError.includes("log in") || generalError.includes("Unauthenticated") || errors?._status === 401) && (
                            <Button
                                as="a"
                                href="/login"
                                color="primary"
                                size="sm"
                                className="w-fit"
                            >
                                {t("service_booking.form.login_button")}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    type="date"
                    label={t("service_booking.form.date_label")}
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleChange}
                    isRequired
                    errorMessage={errors.booking_date?.[0]}
                    isInvalid={!!errors.booking_date}
                    placeholder=" "
                />
                <Input
                    type="time"
                    label={t("service_booking.form.time_label")}
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    isRequired
                    errorMessage={errors.start_time?.[0]}
                    isInvalid={!!errors.start_time}
                    placeholder=" "
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label={t("service_booking.form.room_label")}
                    placeholder={t("service_booking.form.room_placeholder")}
                    selectedKeys={selectedRoom}
                    onSelectionChange={setSelectedRoom}
                    errorMessage={errors.room_id?.[0]}
                    isInvalid={!!errors.room_id}
                    isLoading={loadingRooms}
                >
                    {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id} textValue={room.name}>
                            {room.name} {room.capacity ? `(${room.capacity} pax)` : ""}
                        </SelectItem>
                    ))}
                </Select>

                <Input
                    type="number"
                    label={t("service_booking.form.guests_label")}
                    name="number_of_guests"
                    value={formData.number_of_guests}
                    onChange={handleChange}
                    isRequired
                    min="1"
                    errorMessage={errors.number_of_guests?.[0]}
                    isInvalid={!!errors.number_of_guests}
                />
            </div>

            <div>
                <Select
                    label={t("service_booking.form.event_type_label")}
                    placeholder={t("service_booking.form.event_type_placeholder")}
                    selectedKeys={selectedType}
                    onSelectionChange={setSelectedType}
                    // isRequired 
                    errorMessage={errors.event_type?.[0]}
                    isInvalid={!!errors.event_type && !isOtherSelected}
                >
                    {EVENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                            {t(`service_booking.event_types.${type}`)}
                        </SelectItem>
                    ))}
                </Select>

                {/* Stable container for conditional input */}
                <div>
                    {isOtherSelected && (
                        <Input
                            placeholder={t("service_booking.form.other_type_placeholder")}
                            value={customEventType}
                            onChange={(e) => setCustomEventType(e.target.value)}
                            errorMessage={errors.event_type?.[0]}
                            isInvalid={!!errors.event_type}
                            className="mt-2"
                            isRequired
                        />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t("service_booking.form.name_label")}
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    isRequired
                    errorMessage={errors.contact_name?.[0]}
                    isInvalid={!!errors.contact_name}
                />
                <Input
                    type="email"
                    label={t("service_booking.form.email_label")}
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    isRequired
                    errorMessage={errors.contact_email?.[0]}
                    isInvalid={!!errors.contact_email}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t("service_booking.form.institution_label")}
                    name="institution_name"
                    value={formData.institution_name}
                    onChange={handleChange}
                    placeholder={t("service_booking.form.institution_placeholder")}
                    errorMessage={errors.institution_name?.[0]}
                    isInvalid={!!errors.institution_name}
                />
                <Input
                    label={t("service_booking.form.phone_label")}
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    isRequired
                    errorMessage={errors.contact_phone?.[0]}
                    isInvalid={!!errors.contact_phone}
                />
            </div>

            <Input
                label={t("service_booking.form.whatsapp_label")}
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                errorMessage={errors.whatsapp_number?.[0]}
                isInvalid={!!errors.whatsapp_number}
                description={t("service_booking.form.optional")}
            />


            {/* Stable container for addons */}
            <div className="min-h-0">
                {addons.length > 0 && (
                    <Accordion variant="shadow" className="mb-4">
                        <AccordionItem
                            key="addons"
                            aria-label={t("service_booking.form.addons_title")}
                            title={t("service_booking.form.addons_title")}
                            subtitle={t("service_booking.form.addons_subtitle")}
                        >
                            <Accordion selectionMode="multiple" variant="light">
                                {Object.entries(groupedAddons).map(([type, typeAddons]) => (
                                    <AccordionItem key={type} aria-label={type} title={<span className="capitalize">{type}</span>}>
                                        <CheckboxGroup
                                            value={selectedAddons}
                                            onValueChange={setSelectedAddons}
                                        >
                                            {typeAddons.map((addon) => (
                                                <Checkbox key={String(addon.id)} value={String(addon.id)}>
                                                    <div className="flex flex-col">
                                                        <span className="text-small">{addon.name}</span>
                                                        <span className="text-tiny text-default-400">
                                                            {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: addon.currency || 'AOA' }).format(addon.price)}
                                                        </span>
                                                    </div>
                                                </Checkbox>
                                            ))}
                                        </CheckboxGroup>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionItem>
                    </Accordion>
                )}
            </div>


            <Textarea
                label={t("service_booking.form.notes_label")}
                name="customer_notes"
                value={formData.customer_notes}
                onChange={handleChange}
                placeholder={t("service_booking.form.notes_placeholder")}
                errorMessage={errors.customer_notes?.[0]}
                isInvalid={!!errors.customer_notes}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button color="danger" variant="light" onPress={onClose}>
                    {t("service_booking.form.cancel_button")}
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                    {t("service_booking.form.submit_button")}
                </Button>
            </div>
        </form>
    );
};

export default ServiceBookingForm;
