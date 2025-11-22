import RootLayout from "@/layouts/layout";
import "@/styles/globals.css";
import { HeroUIProvider } from "@heroui/system";

export default function App({ Component, pageProps }) {
  return (
    <HeroUIProvider>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </HeroUIProvider>
  );
}
