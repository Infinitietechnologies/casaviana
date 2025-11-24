import RootLayout from "@/layouts/layout";
import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/system";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <HeroUIProvider>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </HeroUIProvider>
    </Provider>
  );
}
