import React, { useEffect, useRef } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const ContactUs = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    script.async = true;

    script.onload = () => {
      if (mapRef.current && window.L) {
        const map = window.L.map(mapRef.current).setView(
          [38.7020807, -9.4221048],
          20
        );

        window.L.tileLayer(
          "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
          {
            attribution: "&copy; Google Maps",
          }
        ).addTo(map);

        const redIcon = window.L.icon({
          iconUrl:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MiIgdmlld0JveD0iMCAwIDMyIDQyIj48cGF0aCBmaWxsPSIjZGMyNjI2IiBkPSJNMTYgMEMxMC41IDAgNiA0LjUgNiAxMGMwIDcgMTAgMTcgMTAgMTdzMTAtMTAgMTAtMTdjMC01LjUtNC41LTEwLTEwLTEwem0wIDE0Yy0yLjIgMC00LTEuOC00LTRzMS44LTQgNC00IDQgMS44IDQgNC0xLjggNC00IDR6Ii8+PC9zdmc+",
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -42],
        });

        window.L.marker([38.7020807, -9.4221048], { icon: redIcon })
          .addTo(map)
          .bindPopup(
            "<b>Casa Viana Luanada - Angola</b><br>Estrada de Catete, km20, entre o Kero de Viana e o Kinda Home.<br>Luanada - Angola"
          )
          .openPopup();
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="mt-20 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative min-h-screen">
        <LeftSidebar />
        <div className="lg:col-span-8 py-4 md:py-6 flex flex-col items-center w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contate-nos
            </h1>
            <p className="text-lg text-gray-600">
              Entre em contacto com Casa Viana Luanada - Angola
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 w-full  gap-6">
            <Card className="shadow-lg">
              <CardBody className="p-6">
                <h3 className="text-2xl font-semibold mb-6">
                  Informações de contato
                </h3>

                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <svg
                      className="w-6 h-6 text-red-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <h5 className="text-lg font-semibold">Email</h5>
                  </div>
                  <a
                    href="mailto:comercial@casaviana.ao"
                    className="ml-9 text-lg text-gray-700 hover:text-red-600 transition-colors"
                  >
                    comercial@casaviana.ao
                  </a>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <svg
                      className="w-6 h-6 text-green-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <h5 className="text-lg font-semibold">Phones (WhatsApp)</h5>
                  </div>
                  <div className="ml-9 space-y-2">
                    <div>
                      <a
                        href="https://wa.me/351929977503"
                        className="text-lg text-gray-700 hover:text-green-600 transition-colors flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        C01 - 929977503 
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://wa.me/351929977507"
                        className="text-lg text-gray-700 hover:text-green-600 transition-colors flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        C02 - 929977507
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h5 className="text-lg font-semibold">Endereço</h5>
                  </div>
                  <p className="ml-9 text-lg text-gray-700">
                    Estrada de Catete, km20, entre o Kero de Viana e o Kinda Home
                    Luanada - Angola
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg">
              <CardBody className="p-0">
                <div
                  ref={mapRef}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "12px",
                    zIndex: 10,
                  }}
                />
              </CardBody>
            </Card>
          </div>
        </div>

        <RightSidebar />
      </div>
    </div>
  );
};

export default ContactUs;
