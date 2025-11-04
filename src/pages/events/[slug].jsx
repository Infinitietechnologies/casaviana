import { useRouter } from "next/router";
import { useState } from "react";

const EventDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Ticket state management
  const [tickets, setTickets] = useState({
    puffs4pax: 0,
    mesaPartilhada: 0,
    extraMesa: 0,
  });

  // Calculate totals
  const calculateTotal = () => {
    const total =
      tickets.puffs4pax * 600000 +
      tickets.mesaPartilhada * 50000 +
      tickets.extraMesa * 35000;
    return total;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-AO").format(price);
  };

  const handleIncrement = (type) => {
    setTickets((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const handleDecrement = (type) => {
    setTickets((prev) => ({
      ...prev,
      [type]: prev[type] > 0 ? prev[type] - 1 : 0,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="relative bg-black text-white pb-12 full-width">
        <div className="py-6 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-right"></div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
              <div className="text-2xl font-bold">28</div>
              <div className="text-xs uppercase">Novembro</div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 lg:px-12">
          <div className="relative">
            {/* Image container */}
            <div className="absolute top-[-60px] left-0 w-full lg:w-[90%]">
              <img
                src="https://check-in.ao/admin/upload/photos/2025/10/thumb_10_9cd058114f9fdf16943d01d6203adf4f_image.jpeg"
                alt="Calema Concert Poster"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right Side - Event Details */}
          <div className="text-gray-200 pt-[300px] lg:pt-0">
            <div className="text-sm">Concerto</div>
            <h1 className="text-3xl font-bold">Calema no Clube S</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Event Info */}
          <div className="relative mt-[380px]">
            {/* Event Info Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4">
                <div className="text-gray-600 text-sm mb-1">DURAÇÃO</div>
                <div className="font-bold">120 Minutos</div>
              </div>
              <div className="p-4 border-l">
                <div className="text-gray-600 text-sm mb-1">CLASSIFICAÇÃO</div>
                <div className="font-bold">A</div>
              </div>
              <div className="p-4 border-l">
                <div className="text-gray-600 text-sm mb-1">PROMOTOR</div>
                <div className="font-bold">Clube S</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-4 mt-4">
              <div className="font-bold mb-2">PARA MAIS INFORMAÇÕES 📞</div>
              <div className="text-sm text-gray-700">926151856 | 936059093</div>
            </div>

            {/* Description */}
            <div className="p-4   mt-4">
              <h3 className="font-bold text-lg mb-3">Descrição Curta</h3>
              <p className="text-gray-700 mb-3">Calema de Volta a Angola.</p>
              <p className="text-gray-700">Mais um grande show, não percas.</p>
            </div>

            {/* Location */}
            <div className="p-4 mt-4">
              <h3 className="font-bold text-lg mb-3">LOCALIZAÇÃO</h3>
              <div className="text-gray-700">
                <div className="font-semibold">Clube S</div>
                <div>Belas, Luanda - Angola</div>
              </div>
            </div>
          </div>

          {/* Right Side - Ticket Selection */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Selecione os Ingressos</h2>

              {/* Puff's 4 Pax */}
              <div className="border-b pb-6 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Puff's 4 Pax</h3>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      600 000,00 Kz
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Puff's para 4 pessoas com consumo de 135.000 para Snack's
                      e Bebidas (O POSICIONAMENTO DOS LUGARES É DA INTEIRA
                      RESPONSABILIDADE DO CLUBE S, NÃO PODENDO SER ALTERADO)
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded ml-4">
                    Restam 20
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrement("puffs4pax")}
                      className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold">
                      {tickets.puffs4pax}
                    </span>
                    <button
                      onClick={() => handleIncrement("puffs4pax")}
                      className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="font-bold">
                      {formatPrice(tickets.puffs4pax * 600000)} Kz
                    </div>
                  </div>
                </div>
              </div>

              {/* Mesa Partilhada */}
              <div className="border-b pb-6 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Mesa Partilhada</h3>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      50 000,00 Kz
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Puff's partilhados sem consumo incluído
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded ml-4">
                    Restam 13
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrement("mesaPartilhada")}
                      className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold">
                      {tickets.mesaPartilhada}
                    </span>
                    <button
                      onClick={() => handleIncrement("mesaPartilhada")}
                      className="w-8 h-8 bg-black text-white rounded flex items-center justify-center hover:bg-gray-800"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="font-bold">
                      {formatPrice(tickets.mesaPartilhada * 50000)} Kz
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Mesa */}
              <div className="pb-6 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Extra mesa</h3>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      35 000,00 Kz
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Ingresso adicional para quem já tenha comprado mesa, o
                      indresso
                    </p>
                  </div>
                </div>
                <div className="bg-red-50 text-red-600 text-center py-2 px-4 rounded text-sm font-semibold mb-4">
                  VENDAS SOMENTE PRESENCIAIS
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 opacity-50">
                    <button
                      disabled
                      className="w-8 h-8 bg-gray-300 text-white rounded flex items-center justify-center cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold">0</span>
                    <button
                      disabled
                      className="w-8 h-8 bg-gray-300 text-white rounded flex items-center justify-center cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="font-bold">0,00 Kz</div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold">TOTAL EVENTO</div>
                  <div className="text-2xl font-bold">
                    {formatPrice(calculateTotal())} Kz
                  </div>
                </div>
                <button className="w-full bg-gray-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors">
                  🛒 Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
