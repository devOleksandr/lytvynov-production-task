import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {fetchOrders} from "@/modules/Orders/services/services";
import {getQueryClient} from "@/utils/queryClient";
import OrdersList from "@/modules/Orders/components/OrdersList";


export async function OrdersPage() {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['orders'],
		queryFn: fetchOrders,
	});

	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="container mx-auto p-4">
				<OrdersList/>
			</div>
		</HydrationBoundary>
	);
}