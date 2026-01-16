import RootLayout from "@/layouts/layout";
import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/system";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { I18nextProvider } from "react-i18next";
import i18n from "@/utils/i18n";
import { ToastProvider } from "@heroui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { get_system_settings } from "@/Api/api";
import { setSettings, setLoading, setError } from "@/store/systemSettingsSlice";
import MaintenancePage from "@/components/MaintenancePage";

import { get_cart } from "@/Api/api";
import { setCart } from "@/store/cartSlice";

function AppContent({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { settings, loading } = useSelector((state) => state.systemSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await get_cart();
        if (res?.success && res.data) {
          dispatch(setCart({
            items: res.data.items || [],
            cart_id: res.data.id || null, 
            final_total: res.final_total || 0,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [dispatch]);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      // Only fetch system settings if we're on the home page
      if (router.pathname !== "/") {
        setIsInitialized(true);
        return;
      }

      // If settings already exist in Redux, don't fetch again
      if (settings && Object.keys(settings).length > 0) {
        setIsInitialized(true);
        return;
      }

      dispatch(setLoading(true));
      try {
        const res = await get_system_settings();
        if (res?.success && res.data) {
          dispatch(setSettings(res.data));
        } else {
          dispatch(setError(res?.error || "Failed to fetch settings"));
        }
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        setIsInitialized(true);
      }
    };

    fetchSystemSettings();
  }, [dispatch, router.pathname, settings]);


  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="text-center relative z-10">
       

          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-red-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-rose-300 border-t-transparent rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 mb-4 animate-pulse">
            CASA VIANA
          </h2>
          
          <p className="text-gray-600 mb-6">A carregar...</p>

          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (settings?.maintenance_mode) {
    return <MaintenancePage settings={settings} />;
  }

  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <HeroUIProvider>
          <ToastProvider />
          <AppContent Component={Component} pageProps={pageProps} />
        </HeroUIProvider>
      </Provider>
    </I18nextProvider>
  );
}
