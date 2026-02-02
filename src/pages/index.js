import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Homepage from "@/views/Homepage";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>CASA VIANA</title>
        <meta name="description" content={t("meta.description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="my-0">
        <Homepage />
      </div>
    </>
  );
}
