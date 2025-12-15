import RootLayout from "@/layouts/layout";
import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/system";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { I18nextProvider } from "react-i18next";
import i18n from "@/utils/i18n";
import { ToastProvider } from "@heroui/react";

export default function App({ Component, pageProps }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <HeroUIProvider>
          <ToastProvider /> {/* ✅ Mount ONCE */}
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </HeroUIProvider>
      </Provider>
    </I18nextProvider>
  );
}

