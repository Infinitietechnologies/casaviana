import { ToastProvider } from "@heroui/react";
import dynamic from "next/dynamic";
import Head from "next/head";

const Header = dynamic(() => import("../components/Header"), {
  ssr: false,
});

const Footer = dynamic(() => import("../components/Footer"), {
  ssr: false,
});

export default function RootLayout({ children }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/images/casa-viana.png" type="image/*" sizes="any" />
      </Head>

      <Header />

      <main className="mx-auto max-w-[1900px] px-4 min-h-[75vh] sm:px-6 md:px-4 flex-grow pt-0">
        {children}
        <ToastProvider />

      </main>
      <Footer />
    </div>

  );
}
