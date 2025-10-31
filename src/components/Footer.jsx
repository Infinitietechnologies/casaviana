import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white">
        {/* Top orange line */}
        <div className="bg-orange-500 h-1"></div>

        {/* Main Footer Section */}
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-16">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            {/* Left Content */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">casaviana.ao</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  A casaviana.ao é uma Plataforma Digital de Comércio Eletrónico
                  que liga Vendedores, Compradores e Entregadores de forma
                  Prática, Rápida e Segura.
                </p>
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {/* Empresa */}
                <div>
                  <h3 className="font-bold text-white mb-3">Empresa</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Sobre
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        O que fazemos
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Onde estamos
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Liderança
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Contributo Social
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Marketplace */}
                <div>
                  <h3 className="font-bold text-white mb-3">Marketplace</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Seja Afiliada
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Seja Vendedor
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Seja Entregador
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Productos
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Categorias
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Recursos */}
                <div>
                  <h3 className="font-bold text-white mb-3">Recursos</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        D.Adcense
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Centro de Formação
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Histórias de Sucesso
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Relatórios da Indústria
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Tendências de Produtos
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Press */}
                <div>
                  <h3 className="font-bold text-white mb-3">Press</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Notícias
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        PodCast
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Media Kit
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="font-bold text-white mb-3">Payment Methods</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        D.Wallet
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Multicaixa Express
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Referência Multicaixa
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Unitel Monay
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Afrimonay
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Contact Section */}
            <div className="flex-shrink-0">
              <h3 className="font-bold text-white mb-4">Connect with Us</h3>

              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 001.5-1.5v-2.548a1.5 1.5 0 00-1.026-1.423l-3.423-1.141a1.5 1.5 0 00-1.607.376l-.96.96a12.036 12.036 0 01-5.198-5.198l.96-.96a1.5 1.5 0 00.376-1.607L7.721 4.776A1.5 1.5 0 006.298 3.75H3.75A1.5 1.5 0 002.25 5.25v1.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Phone</div>
                    <div className="text-gray-400 text-sm">921908484</div>
                  </div>
                </div>

                {/* Mail */}
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0L12 13.5 2.25 6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">
                      Mail Us
                    </div>
                    <div className="text-gray-400 text-sm">
                      vendas@dikomba.ao
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.125-7.5 11.25-7.5 11.25S4.5 17.625 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">
                      Encontre-nos
                    </div>
                    <div className="text-gray-400 text-sm">
                      Escritório Central: Talatona, Luanda-Angola.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-gray-800 border-t border-gray-700">
          <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <div className="text-gray-400 text-sm">
                Copyright © 2025 | casaviana.ao, Lda.
              </div>
              <div className="flex space-x-6 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Termos e Condições
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Política de Privacidade
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Política de devolução
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
