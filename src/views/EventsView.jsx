import Link from "next/link";
import React, { useState, useEffect } from "react";
import { get_events, get_categories } from "@/Api/api";
import { Skeleton, Input, Button, Chip, Pagination } from "@heroui/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
} from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination as SwiperPagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { EventsPageSkeleton } from "@/components/Skeletons/EventsSkeletons";

const EventsView = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [initialEvents, setInitialEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
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
          const childCategories = categoriesResponse.data
            .filter((cat) => !cat.is_root && cat.status === "active")
            .map((cat) => ({ label: cat.name, value: cat.slug }));
          setCategories(childCategories);
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
    const fetchInitialEvents = async () => {
      setLoading(true);
      try {
        const eventsResponse = await get_events();
        if (eventsResponse?.success) {
          setInitialEvents(eventsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialEvents();
  }, []);

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      setUpcomingLoading(true);
      try {
        const category = activeCategory === "all" ? null : activeCategory;
        const search = debouncedSearch || null;
        const eventsResponse = await get_events(
          category,
          search,
          currentPage,
          ITEMS_PER_PAGE
        );
        if (eventsResponse?.success) {
          setFilteredEvents(eventsResponse.data || []);
          setTotalPages(eventsResponse.meta?.last_page || 1);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setUpcomingLoading(false);
      }
    };

    fetchFilteredEvents();
  }, [activeCategory, debouncedSearch, currentPage]);

  const transformEvent = (event) => {
    const eventDate = new Date(event.event_date);
    const day = eventDate.getDate().toString();
    const month = eventDate
      .toLocaleString("en-US", { month: "long" })
      .toUpperCase();

    return {
      id: event.id,
      title: event.title,
      time: event.start_time ? `At ${event.start_time}` : "All Day",
      slug: event.slug,
      date: event.event_date,
      day: day,
      month: month,
      category: event.category?.name || "Uncategorized",
      image: event.banner_image || event.images?.[0] || "/images/event2.png",
      showBadge: event.status === "published" && event.is_available_for_booking,
      badgeText: event.is_sold_out ? "Sold Out" : "Registration Open",
      registrationOpen: event.is_available_for_booking && !event.is_sold_out,
      status: event.status,
      venue: event.venue?.name,
      availableSeats: event.available_seats,
      totalSeats: event.total_seats,
    };
  };

  // Filter only highlighted events for featured section
  const featuredEvents = initialEvents
    .filter((event) => event.is_highlighted === true)
    .slice(0, 4)
    .map(transformEvent);

  const upcomingEvents = filteredEvents.map(transformEvent);

  const handleApplyFilter = () => {
    setActiveCategory(tempCategory);
    onClose();
  };

  const handleResetFilter = () => {
    setTempCategory("all");
    setActiveCategory("all");
    setSearchTerm("");
  };

  if (loading) return <EventsPageSkeleton />;

  const EventCard = ({ event }) => (
    <div className="card-event pointer">
      <Link href={`/events/${event.slug}`}>
        <img src={event.image} alt={event.title} />
      </Link>
      <div className="card-content">
        <div className="titulo">{event.title}</div>
        <div className="time">{event.time}</div>
        {event.venue && (
          <div className="venue text-sm text-gray-600">{event.venue}</div>
        )}
        <div className="bottom-section">
          <div className="categorie">{event.category}</div>
          <div className="date-container">
            <div className="date-block">
              <div className="month">{event.month}</div>
              <div className="day">{event.day}</div>
            </div>
          </div>
        </div>

        <button className="btn_black">{"Comprar Ingresso"}</button>
      </div>
    </div>
  );

  return (
    <div className="mt-20">
      <main>
        <section className="text-white py-8 bg-black full-width">
          <div className="px-4 sm:px-6 lg:px-8 xl:px-20">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Destaques</h2>

            {featuredEvents.length === 0 ? (
              <p className="text-gray-400">
                Nenhum evento em destaque no momento.
              </p>
            ) : (
              <>
                <div className="lg:hidden">
                  <Swiper
                    spaceBetween={16}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[SwiperPagination]}
                    className="featured-swiper"
                  >
                    {featuredEvents.map((event) => (
                      <SwiperSlide key={event.id}>
                        <Link href={`/events/${event.slug}`}>
                          <div className="flex items-center rounded-xl shadow-md overflow-hidden hover:scale-[1.02] transition-transform duration-200">
                            <div className="w-[40%] h-[120px] sm:h-[140px] relative bg-black">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </div>

                            <div className="w-[60%] p-3 flex flex-col justify-between bg-white h-[120px] sm:h-[140px]">
                              <div>
                                <h3 className="text-gray-900 font-semibold text-sm sm:text-base line-clamp-2">
                                  {event.title}
                                </h3>
                                <p className="text-gray-700 text-xs mt-1">
                                  {event.time}
                                </p>
                              </div>

                              <div className="flex justify-end mt-2">
                                <div className="bg-[#007bff] text-white rounded-md text-center px-3 py-1 shadow-md leading-tight">
                                  <div className="text-sm font-bold">
                                    {event.day}
                                  </div>
                                  <div className="text-[10px] uppercase">
                                    {event.month}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="hidden lg:block">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {featuredEvents.map((event) => (
                      <Link href={`/events/${event.slug}`} key={event.id}>
                        <div className="flex items-center rounded-xl shadow-md overflow-hidden hover:scale-[1.02] transition-transform duration-200">
                          <div className="w-[40%] h-[120px] sm:h-[140px] relative bg-black">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>

                          <div className="w-[60%] p-3 flex flex-col justify-between bg-white h-[120px] sm:h-[140px]">
                            <div>
                              <h3 className="text-gray-900 font-semibold text-sm sm:text-base line-clamp-2">
                                {event.title}
                              </h3>
                              <p className="text-gray-700 text-xs mt-1">
                                {event.time}
                              </p>
                            </div>

                            <div className="flex justify-end mt-2">
                              <div className="bg-[#007bff] text-white rounded-md text-center px-3 py-1 shadow-md leading-tight">
                                <div className="text-sm font-bold">
                                  {event.day}
                                </div>
                                <div className="text-[10px] uppercase">
                                  {event.month}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section id="events" className="py-16 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-8xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Próximos eventos
                  </h2>
                  <Input
                    type="text"
                    placeholder="Procurar evento"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="bordered"
                    className="mt-1 sm:mt-0 sm:ml-4 w-full sm:w-60"
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

              <div className="d-flex flex-wrap event-row" id="upcoming-events">
                {upcomingLoading ? (
                  <div className="w-full text-center py-12">
                    <p className="text-gray-500 text-lg">Carregando...</p>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="w-full text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {debouncedSearch
                        ? "Nenhum evento encontrado com esse termo de pesquisa."
                        : "Nenhum evento disponível no momento."}
                    </p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                )}
              </div>
              <Pagination
                showControls
                page={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          </div>
        </section>
      </main>

      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Filtrar Eventos</h2>
            <p className="text-sm text-gray-500">
              Selecione uma categoria para filtrar
            </p>
          </DrawerHeader>
          <DrawerBody>
            <div className="flex flex-wrap gap-2">
              <Chip
                onClick={() => setTempCategory("all")}
                className={`cursor-pointer transition-all ${
                  tempCategory === "all"
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
                  className={`cursor-pointer transition-all ${
                    tempCategory === category.value
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
              Clear filter
            </Button>
            <Button
              color="primary"
              onPress={handleApplyFilter}
              className="bg-blue-600"
            >
              Apply filter
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EventsView;
