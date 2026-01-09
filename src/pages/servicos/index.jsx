import ServicesView from "@/views/ServicesView";
import React from "react";
import Head from "next/head";

const ServicesPage = () => {
    return (
        <>
            <Head>
                <title>Serviços - Casa Viana</title>
                <meta name="description" content="Nossos serviços" />
            </Head>
            <ServicesView />
        </>
    );
};

export default ServicesPage;
