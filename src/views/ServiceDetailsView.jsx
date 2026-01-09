"use client";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { fetch_service_details } from "@/Api/api";
import { ServiceDetailsSkeleton } from "@/components/Skeletons/ServiceDetailsSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@heroui/react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { useDisclosure } from "@heroui/react";
import ServiceBookingForm from "@/components/ServiceBookingForm";
import Drawer from "@/components/Drawer";

const ServiceDetailsView = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchService = async () => {
            setLoading(true);
            try {
                const response = await fetch_service_details(slug);
                if (response?.success) {
                    setService(response.data);
                }
            } catch (error) {
                console.error("Error fetching service details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [slug]);

    if (loading) return <ServiceDetailsSkeleton />;

    if (!service) {
        return (
            <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
                <p className="text-gray-500">Serviço não encontrado.</p>
            </div>
        );
    }

    // Use cover_image if images array is empty or not present
    const imagesToDisplay = service.images && service.images.length > 0 ? service.images : (service.cover_image ? [service.cover_image] : ["/images/placeholder-service.png"]);

    return (
        <div className="min-h-screen bg-gray-50 mt-20">
            <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
                    <LeftSidebar />

                    <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col">
                        <div className="relative bg-black text-white pb-6 lg:pb-12 rounded-xl">
                            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 px-4 lg:px-8 pt-8">
                                <div className="relative">
                                    <div className="h-[250px] sm:h-[350px] lg:h-[400px] rounded-lg overflow-hidden shadow-lg bg-gray-900">
                                        <Swiper
                                            spaceBetween={10}
                                            navigation={imagesToDisplay.length > 1}
                                            pagination={{ clickable: true }}
                                            modules={[Navigation, Pagination]}
                                            className="h-full w-full"
                                        >
                                            {imagesToDisplay.map((img, i) => (
                                                <SwiperSlide key={i}>
                                                    <img
                                                        src={typeof img === 'string' ? img : (img?.url || img?.path || img?.image)}
                                                        alt={`${service.title} - ${i + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>

                                <div className="text-gray-200 lg:pt-0 flex flex-col justify-center">
                                    <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                                        {service.category?.name || "Serviço"}
                                    </div>
                                    <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                                        {service.title}
                                    </h1>
                                    {service.description && (
                                        <div
                                            className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-4"
                                            dangerouslySetInnerHTML={{ __html: service.description }}
                                        />
                                    )}
                                    {service.price !== null && service.price !== undefined && (
                                        <div className="text-xl lg:text-2xl font-bold text-white mb-2">
                                            {service.price === 0 ? "Sob Consulta" : new Intl.NumberFormat('ao-AO', { style: 'currency', currency: 'AOA' }).format(service.price)}
                                            {service.pricing_type && service.pricing_type !== 'fixed' && (
                                                <span className="text-sm text-gray-400 font-normal ml-2 capitalize">
                                                    / {service.pricing_type.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Additional Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {service.min_capacity && (
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="text-gray-500 text-xs uppercase font-semibold mb-1">Capacidade Mínima</div>
                                            <div className="text-gray-900 font-medium">{service.min_capacity} Pessoas</div>
                                        </div>
                                    )}
                                    {service.max_capacity && (
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="text-gray-500 text-xs uppercase font-semibold mb-1">Capacidade Máxima</div>
                                            <div className="text-gray-900 font-medium">{service.max_capacity} Pessoas</div>
                                        </div>
                                    )}
                                    {service.min_notice_hours && (
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="text-gray-500 text-xs uppercase font-semibold mb-1">Aviso Prévio Mínimo</div>
                                            <div className="text-gray-900 font-medium">{service.min_notice_hours} Horas</div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Detalhes do Serviço</h3>
                                    <div className="prose max-w-none text-gray-600">
                                        {service.description ? (
                                            <div dangerouslySetInnerHTML={{ __html: service.description }} />
                                        ) : <p>Nenhuma descrição adicional disponível.</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Interessado neste serviço?</h3>
                                    <p className="text-gray-600 text-sm mb-6">
                                        Entre em contacto connosco para verificar disponibilidade e fazer uma reserva.
                                    </p>
                                    <div className="space-y-3">
                                        <Button
                                            className="w-full font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-md"
                                            size="lg"
                                            onPress={onOpen}
                                        >
                                            Reservar Agora
                                        </Button>
                                        <Button
                                            as="a"
                                            href={`https://wa.me/message/YOUR_WHATSAPP_LINK?text=Olá, estou interessado no serviço: ${service.title}`}
                                            target="_blank"
                                            className="w-full bg-green-500 text-white font-semibold"
                                            startContent={
                                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                            }
                                        >
                                            WhatsApp
                                        </Button>
                                        <Button
                                            as="a"
                                            href="/contact-us"
                                            variant="bordered"
                                            className="w-full font-semibold"
                                        >
                                            Contactar-nos
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <RightSidebar />
                </div>
            </div>

            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                title={`Reservar ${service.title}`}
                size="xl"
            >
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 h-full">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Pedido Enviado!</h3>
                        <p className="text-gray-600 max-w-md text-lg">
                            O seu pedido de reserva foi enviado com sucesso. Entraremos em contacto brevemente para confirmar os detalhes.
                        </p>
                        <Button color="primary" size="lg" onPress={onClose} className="mt-8 px-8">
                            Fechar
                        </Button>
                    </div>
                ) : (
                    <ServiceBookingForm
                        serviceId={service.id}
                        onClose={onClose}
                        onSuccess={() => setIsSuccess(true)}
                    />
                )}
            </Drawer>
        </div >
    );
};

export default ServiceDetailsView;
