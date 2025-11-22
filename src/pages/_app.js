import RootLayout from "@/layouts/layout";
import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/system";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastProvider } from "@heroui/react";

export default function App({ Component, pageProps }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <Provider store={store}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </Provider>
    </HeroUIProvider>
  );
}
