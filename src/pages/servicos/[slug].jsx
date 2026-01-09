import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceDetailsView from "@/views/ServiceDetailsView";

export default function ServiceDetailsPage() {
    return (
        <>
            <Head>
                <title>Detalhes do Serviço | Casa Viana</title>
                <meta
                    name="description"
                    content="Confira os detalhes dos nossos serviços exclusivos."
                />
            </Head>
            <Header />
            <ServiceDetailsView />
            <Footer />
        </>
    );
}
