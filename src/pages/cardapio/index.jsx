"use client";
import React from "react";
import Head from "next/head";
import CardapioView from "@/views/CardapioView";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t("cardapio.title")} - Casa Viana`}</title>
        <meta
          name="description"
          content={t("cardapio.subtitle") || "Explore o cardápio e especialidades da Casa Viana."}
        />
      </Head>
      <CardapioView />
    </>
  );
};

export default Index;
