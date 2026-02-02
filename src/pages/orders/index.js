import LayoutView from "@/views/LayoutView";
import OrdersView from "@/views/OrdersView";
import Head from "next/head";
// import MetaTags from "@/components/MetaTags";

export default function Orders() {
    return (
        <>
            <Head>
                <title>Meus Pedidos | Casa Viana</title>
                <meta name="description" content="Visualize o histórico de seus pedidos" />
            </Head>
            <OrdersView />
            {/* <LayoutView>
            </LayoutView> */}
        </>
    );
}
