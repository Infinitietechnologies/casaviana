import React, { useState } from "react";

const EventsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Event data
  const featuredEvents = [
    {
      title: "Angola Golden Jubilee - 50th Independence Day",
      time: "All Day",
      date: "November 11, 2025",
      day: "11",
      month: "NOVEMBER",
      endDay: null,
      endMonth: null,
      category: "Festival",
      image: "/images/06_169baee7c014e294a6e37bfcb2974814_image.jpg",
      isFeatured: true,
      showBadge: true,
      badgeText: "Celebrate",
      badgePosition: "top-left",
      hasEndDate: false,
      registrationOpen: true,
    },
    {
      title: "Forbes África Lusófona Annual Summit 2025",
      time: "At 9:00 AM",
      date: "November 18, 2025",
      day: "18",
      month: "NOVEMBER",
      endDay: null,
      endMonth: null,
      category: "Conferência",
      image: "/images/07_739d11a007244184794b683209b90f1a_image.jpg",
      showBadge: true,
      badgeText: "Registration Open",
      badgePosition: "top-right",
      hasEndDate: false,
      registrationOpen: true,
    },
    {
      title: "7th AU-EU Summit",
      time: "All Day",
      date: "November 24, 2025",
      day: "24",
      month: "NOVEMBER",
      endDay: "25",
      endMonth: "NOVEMBER",
      category: "Conferência",
      image: "/images/19_8b4a5b573eb071d49c25425c4b4331de_image.jpg",
      showBadge: false,
      hasEndDate: true,
      registrationOpen: true,
    },
    {
      title: "4th African Youth Games Angola 2025",
      time: "At 8:00 AM",
      date: "December 10, 2025",
      day: "10",
      month: "DECEMBER",
      endDay: "20",
      endMonth: "DECEMBER",
      category: "Desporto",
      image:
        "https://africaolympic.com/wp-content/uploads/2025/08/ACNOA_NEWSLETTER_25-AOUT_2025-11.jpg",
      showBadge: true,
      badgeText: "Opening Ceremony",
      badgePosition: "bottom-left",
      hasEndDate: true,
      registrationOpen: true,
    },
  ];

  const upcomingEvents = [
    {
      title: "Digital Summit Angola 2025",
      time: "At 10:00 AM",
      date: "November 20, 2025",
      day: "20",
      month: "NOVEMBER",
      category: "Conferência",
      image: "/images/06_169baee7c014e294a6e37bfcb2974814_image.jpg",
      showBadge: false,
      registrationOpen: true,
    },
    {
      title: "Segunda Edição do Brunch Mangás",
      time: "At 11:00 AM",
      date: "November 15, 2025",
      day: "15",
      month: "NOVEMBER",
      category: "Cultura",
      image: "/images/07_739d11a007244184794b683209b90f1a_image.jpg",
      showBadge: false,
      registrationOpen: true,
    },
    {
      title: "EXPO ECONOMIA DIGITAL 2025",
      time: "At 9:00 AM",
      date: "November 22, 2025",
      day: "22",
      month: "NOVEMBER",
      category: "Feiras",
      image: "/images/19_8b4a5b573eb071d49c25425c4b4331de_image.jpg",
      showBadge: false,
      registrationOpen: true,
    },
    {
      title: "Prémios Dentes D'ouro 2025",
      time: "At 7:00 PM",
      date: "November 28, 2025",
      day: "28",
      month: "NOVEMBER",
      category: "Arte",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop",
      showBadge: false,
      registrationOpen: true,
    },
    {
      title: "III Edição da Cantata de Natal 2025",
      time: "At 6:00 PM",
      date: "December 15, 2025",
      day: "15",
      month: "DECEMBER",
      category: "Show",
      image:
        "https://i.etsystatic.com/18858649/r/il/ce92bb/5359529302/il_fullxfull.5359529302_bc6i.jpg",
      showBadge: false,
      registrationOpen: true,
    },
    {
      title: "Estudos de Literatura Angolana",
      time: "At 2:00 PM",
      date: "December 5, 2025",
      day: "5",
      month: "DECEMBER",
      category: "Cultura",
      image:
        "https://check-in.ao/admin/upload/photos/2025/10/thumb_10_9cd058114f9fdf16943d01d6203adf4f_image.jpeg",
      showBadge: false,
      registrationOpen: true,
    },
    {
      title: "Exposição de Arte Contemporânea Angolana",
      time: "At 3:00 PM",
      date: "December 12, 2025",
      day: "12",
      month: "DECEMBER",
      category: "Arte",
      image:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=500&fit=crop",
      showBadge: false,
      registrationOpen: true,
    },
    {
      title: "Oficina de Artesanato Angolano",
      time: "At 4:00 PM",
      date: "December 18, 2025",
      day: "18",
      month: "DECEMBER",
      category: "Artesanato",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop",
      showBadge: false,
      registrationOpen: true,
    },
  ];

  const categories = [
    { label: "Festival", value: "Festival" },
    { label: "Casamento", value: "Casamento" },
    { label: "Restaurante", value: "Restaurante" },
    { label: "Show", value: "Show" },
    { label: "Ferias", value: "Ferias" },
    { label: "Desporto", value: "Desporto" },
    { label: "Exposiao", value: "Exposiao" },
  ];

  // Filter upcoming events based on selected category
  const filteredEvents =
    activeCategory === "all"
      ? upcomingEvents
      : upcomingEvents.filter((event) => event.category === activeCategory);

  // Event Card Component
  const EventCard = ({ event }) => (
    <div className="card-event pointer">
      <img src={event.image} alt={event.title} />
      <div className="card-content">
        <div className="titulo">{event.title}</div>
        <div className="time">{event.time}</div>
        <div className="bottom-section">
          <div className="categorie">{event.category}</div>
          <div className="date-container">
            <div className="date-block">
              <div className="month">{event.month}</div>
              <div className="day">{event.day}</div>
            </div>
            {event.hasEndDate && (
              <>
                <div className="date-separator">the</div>
                <div className="date-block">
                  <div className="month">{event.endMonth}</div>
                  <div className="day">{event.endDay}</div>
                </div>
              </>
            )}
          </div>
        </div>
        {event.showBadge && <div className="destaque">{event.badgeText}</div>}
        {!event.registrationOpen && (
          <div className="soon-overlay">Em breve</div>
        )}
        <button className="btn_black">
          {event.registrationOpen ? "Comprar Ingresso" : "Em breve"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-20">
      <main>
        {/* Hero Section */}
        <section className="py-12 bg-white hidden">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-8xl mx-auto">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">
                  Eventos
                </h1>
                <div className="flex justify-center space-x-4 mt-4">
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors">
                    Trending
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors">
                    Comments
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors">
                    Latest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Destaques Section (Responsive Grid: 1 → 2 → 4 columns) */}
        <section className="text-white py-8">
          <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Destaques</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-xl shadow-md overflow-hidden hover:scale-[1.02] transition-transform duration-200"
                >
                  {/* Image with Black Background */}
                  <div className="w-[40%] h-[120px] sm:h-[140px] relative bg-black">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Content with White Background */}
                  <div className="w-[60%] p-3 flex flex-col justify-between bg-white h-[120px] sm:h-[140px]">
                    <div>
                      <h3 className="text-gray-900 font-semibold text-sm sm:text-base line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-700 text-xs mt-1">{event.time}</p>
                    </div>

                    {/* Date */}
                    <div className="flex justify-end mt-2">
                      <div className="bg-[#007bff] text-white rounded-md text-center px-3 py-1 shadow-md leading-tight">
                        <div className="text-sm font-bold">{event.day}</div>
                        <div className="text-[10px] uppercase">
                          {event.month}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="events" className="py-16 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-8xl mx-auto">
              {/* Header Row: Title + Search + Categories */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
                {/* Left side - Title & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Próximos eventos
                  </h2>
                  <input
                    type="text"
                    placeholder="Procurar evento"
                    className="mt-1 sm:mt-0 sm:ml-4 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
                  />
                </div>

                {/* Right side - Category buttons */}
                <div className="flex flex-wrap justify-start sm:justify-end gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      className={`px-4 py-2 text-sm rounded-md font-medium transition-all ${
                        activeCategory === category.value
                          ? "bg-blue-600 text-white"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events Grid */}
              <div className="d-flex flex-wrap event-row" id="upcoming-events">
                {filteredEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EventsPage;
