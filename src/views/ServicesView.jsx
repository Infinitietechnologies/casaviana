"use client";
import React, { useState, useEffect } from "react";
import { fetch_all_services, get_categories } from "@/Api/api";
import { ServicesPageSkeleton } from "@/components/Skeletons/ServicesSkeletons";
import { Input, Button, Chip, Pagination } from "@heroui/react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
} from "@heroui/react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const ServicesView = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [initialServices, setInitialServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 8;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tempCategory, setTempCategory] = useState("all");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesResponse = await get_categories();
                if (categoriesResponse?.success) {
                    const allCategories = categoriesResponse.data
                        .filter((cat) => cat.status === "active")
                        .map((cat) => ({ label: cat.name, value: cat.id }));
                    setCategories(allCategories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, debouncedSearch]);

    useEffect(() => {
        const fetchServices = async () => {
            setSearching(true);
            try {
                const categoryId = activeCategory === "all" ? null : activeCategory;
                const search = debouncedSearch || null;

                // Fetch services with filters
                const servicesResponse = await fetch_all_services(
                    search,
                    categoryId,
                    null, // is_featured - we can add a filter for this later if needed
                    currentPage,
                    ITEMS_PER_PAGE
                );

                if (servicesResponse?.success) {
                    let servicesData = servicesResponse.data;
                    let meta = servicesResponse.meta;

                    // Check if data is wrapped in pagination object (has nested data array)
                    if (servicesData && !Array.isArray(servicesData) && Array.isArray(servicesData.data)) {
                        meta = servicesData.meta;
                        servicesData = servicesData.data;
                    }
                    setFilteredServices(servicesData || []);
                    setTotalPages(meta?.last_page || 1);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
                setSearching(false);
            }
        };

        fetchServices();
    }, [activeCategory, debouncedSearch, currentPage]);

    const transformService = (service) => {
        return {
            id: service.id,
            title: service.title,
            short_description: service.short_description,
            description: service.description,
            price: service.price,
            image: service.cover_image || "/images/placeholder-service.png", // Use cover_image from API
            category: service.category?.name || "Uncategorized",
            slug: service.slug,
        };
    };

    const servicesList = filteredServices.map(transformService);

    const handleApplyFilter = () => {
        setActiveCategory(tempCategory);
        onClose();
    };

    const handleResetFilter = () => {
        setTempCategory("all");
        setActiveCategory("all");
        setSearchTerm("");
    };

    if (loading && initialServices.length === 0 && !searching) return <ServicesPageSkeleton />;

    const ServiceCard = ({ service }) => (
        <a href={`/servicos/${service.slug}`} className="block h-full">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-[1.02] transition-transform duration-200 h-full flex flex-col">
                <div className="w-full h-48 relative bg-gray-200">
                    <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                        {service.short_description ? (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {service.short_description}
                            </p>
                        ) : (
                            <div
                                className="text-sm text-gray-600 mb-4 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: service.description }}
                            />
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                            {service.category}
                        </span>
                        {service.price !== null && service.price !== undefined && (
                            <span className="text-lg font-bold text-black">
                                {service.price === 0 ? "Sob Consulta" : new Intl.NumberFormat('ao-AO', { style: 'currency', currency: 'AOA' }).format(service.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );

    return (
        <div className="mt-20">
            <div className="mx-auto px-2 sm:px-4 md:px-8 lg:px-0 min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
                    <LeftSidebar />

                    <div className="lg:col-span-8 py-4 md:py-6 gap-6 flex flex-col">
                        <section className="py-8 bg-black rounded-xl px-4 sm:px-6 lg:px-8 xl:px-20 text-white shadow-lg">
                            <h1 className="text-3xl font-bold">Nossos Serviços</h1>
                            <p className="text-gray-300 mt-2">Explore a variedade de serviços que oferecemos.</p>
                        </section>

                        <section id="services" className="bg-white">
                            <div className="w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <Input
                                            type="text"
                                            placeholder="Procurar serviço"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            variant="bordered"
                                            className="w-full sm:w-80"
                                            classNames={{
                                                input: "text-sm",
                                                inputWrapper: "h-10",
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {activeCategory !== "all" && (
                                            <span className="text-sm text-gray-600">
                                                Filtrado:{" "}
                                                <span className="font-semibold">
                                                    {
                                                        categories.find((c) => c.value === activeCategory)
                                                            ?.label
                                                    }
                                                </span>
                                            </span>
                                        )}
                                        <Button
                                            onPress={onOpen}
                                            className="bg-black text-white hover:bg-gray-800"
                                        >
                                            Filtros
                                        </Button>
                                    </div>
                                </div>

                                <div className="min-h-[400px]">
                                    {loading && searching ? (
                                        <ServicesPageSkeleton />
                                    ) : servicesList.length === 0 ? (
                                        <div className="w-full text-center py-12">
                                            <p className="text-gray-500 text-lg">
                                                {debouncedSearch
                                                    ? "Nenhum serviço encontrado com esse termo de pesquisa."
                                                    : "Nenhum serviço disponível no momento."}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                                {servicesList.map((service) => (
                                                    <ServiceCard key={service.id} service={service} />
                                                ))}
                                            </div>
                                            <div className="flex justify-center">
                                                <Pagination
                                                    showControls
                                                    page={currentPage}
                                                    total={totalPages}
                                                    onChange={setCurrentPage}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    <RightSidebar />
                </div>
            </div>

            <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
                <DrawerContent>
                    <DrawerHeader className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold">Filtrar Serviços</h2>
                        <p className="text-sm text-gray-500">
                            Selecione uma categoria para filtrar
                        </p>
                    </DrawerHeader>
                    <DrawerBody>
                        <div className="flex flex-wrap gap-2">
                            <Chip
                                onClick={() => setTempCategory("all")}
                                className={`cursor-pointer transition-all ${tempCategory === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                                size="lg"
                                variant={tempCategory === "all" ? "solid" : "flat"}
                            >
                                Todos
                            </Chip>

                            {categories.map((category) => (
                                <Chip
                                    key={category.value}
                                    onClick={() => setTempCategory(category.value)}
                                    className={`cursor-pointer transition-all ${tempCategory === category.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                        }`}
                                    size="lg"
                                    variant={tempCategory === category.value ? "solid" : "flat"}
                                >
                                    {category.label}
                                </Chip>
                            ))}
                        </div>
                    </DrawerBody>
                    <DrawerFooter className="gap-2">
                        <Button color="danger" variant="light" onPress={handleResetFilter}>
                            Limpar filtro
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleApplyFilter}
                            className="bg-blue-600"
                        >
                            Aplicar filtro
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default ServicesView;
