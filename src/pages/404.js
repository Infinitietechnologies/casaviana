import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Custom404() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-32 h-32 md:w-40 md:h-40 animate-bounce"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sad face illustration */}
              <circle cx="100" cy="100" r="80" fill="#F87171" opacity="0.2" />
              <circle cx="70" cy="85" r="8" fill="#DC2626" />
              <circle cx="130" cy="85" r="8" fill="#DC2626" />
              <path
                d="M 70 130 Q 100 110 130 130"
                stroke="#DC2626"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {t("404.title")}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          {t("404.message")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {t("404.back_home")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg border border-gray-200 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {t("404.go_back")}
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
