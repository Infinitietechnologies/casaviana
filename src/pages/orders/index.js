import LayoutView from "@/views/LayoutView";
import OrdersView from "@/views/OrdersView";
// import MetaTags from "@/components/MetaTags";

export default function Orders() {
    return (
        <>
            {/* <MetaTags
                title="Meus Pedidos | Casa Viana"
                description="Visualize o histórico de seus pedidos"
            /> */}
            <OrdersView />
            {/* <LayoutView>
            </LayoutView> */}
        </>
    );
}
