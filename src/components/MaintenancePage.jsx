import React from "react";
import Image from "next/image";

const MaintenancePage = ({ settings }) => {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return null;
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('pt-AO', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return dateTimeString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        {/* Logo */}
        {settings?.site_logo && (
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Image
                src={settings.site_logo}
                alt={settings.app_name || "Logo"}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Maintenance Icon */}
        <div className="mb-8">
          <svg 
            className="w-24 h-24 md:w-32 md:h-32 mx-auto text-red-500"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          {settings?.app_name || "CASA VIANA"}
        </h1>
        
        <h2 className="text-xl md:text-2xl font-semibold text-red-600 mb-6">
          Em Manutenção
        </h2>

        {/* Custom Message */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            {settings?.maintenance_message || 
              "Estamos a realizar melhorias no nosso sistema para lhe oferecer uma melhor experiência. Voltaremos em breve!"}
          </p>
        </div>

        {/* Time Information */}
        {(settings?.maintenance_start_time || settings?.maintenance_end_time) && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {settings?.maintenance_start_time && (
                <div>
                  <p className="text-gray-600 font-semibold mb-1">Início:</p>
                  <p className="text-gray-800">{formatDateTime(settings.maintenance_start_time)}</p>
                </div>
              )}
              {settings?.maintenance_end_time && (
                <div>
                  <p className="text-gray-600 font-semibold mb-1">Fim Previsto:</p>
                  <p className="text-gray-800">{formatDateTime(settings.maintenance_end_time)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tagline */}
        {settings?.app_tagline && (
          <p className="text-gray-600 text-lg italic mb-8">
            {settings.app_tagline}
          </p>
        )}

        {/* Loading Animation */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Agradecemos a sua compreensão</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;