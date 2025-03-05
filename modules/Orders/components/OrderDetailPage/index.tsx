import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {fetchOrders} from "@/modules/Orders/services/services";
import {getQueryClient} from "@/utils/queryClient";
import SingleOrder from "@/modules/Orders/components/SingleOrder";


export async function OrderDetailPage() {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['orders'],
		queryFn: fetchOrders,
	});

	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="container mx-auto p-4">
				<SingleOrder/>
			</div>
		</HydrationBoundary>
	);
}