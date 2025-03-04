"use client";
import {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import Link from 'next/link';
import {fetchOrders, updateOrderStatus} from "@/modules/Orders/services/services";
import {Order} from "@/modules/Orders/types/types";


export default function OrdersList() {
	const queryClient = useQueryClient();
	const [filter, setFilter] = useState<string>('all');

	const {data: orders, isLoading, error} = useQuery<Order[]>({
		queryKey: ['orders'],
		queryFn: fetchOrders,
	});


	const mutation = useMutation({
		mutationFn: updateOrderStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['orders']});
		},
	});

	if (isLoading) return <div className="text-center">Завантаження...</div>;
	if (error) return <div className="text-red-500">Помилка: {(error as Error).message}</div>;

	const filteredOrders = filter === 'all'
		? orders
		: orders!.filter((order) => order.status === filter);

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<div className="flex gap-2">
					<button
						onClick={() => setFilter('all')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'all'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						All
					</button>
					<button
						onClick={() => setFilter('pending')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'pending'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						Pending
					</button>
					<button
						onClick={() => setFilter('paid')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'paid'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						Paid
					</button>
					<button
						onClick={() => setFilter('shipped')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'shipped'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						Shipped
					</button>
				</div>
				<span className="text-sm text-gray-500">Total: {filteredOrders!.length}</span>
			</div>
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							ID
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Date
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							User
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Products
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
					</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
					{filteredOrders!.map((order) => (
						<tr key={order.id} className="hover:bg-gray-50 transition-colors">
							<td className="px-6 py-4 whitespace-nowrap">
								<Link href={`/orders/${order.id}`} className="text-indigo-600 hover:underline">
									#{order.id}
								</Link>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{new Date(order.date).toLocaleDateString()}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userId}</td>
							<td className="px-6 py-4 text-sm text-gray-500">
								{order.products.map((p) => `${p.productId} (x${p.quantity})`).join(', ')}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<select
									value={order.status}
									onChange={(e) =>
										mutation.mutate({id: order.id, status: e.target.value as Order['status']})
									}
									className={`border rounded-md p-1 text-sm ${
										order.status === 'pending'
											? 'bg-yellow-100 text-yellow-800'
											: order.status === 'paid'
												? 'bg-green-100 text-green-800'
												: 'bg-blue-100 text-blue-800'
									}`}
								>
									<option value="pending">Pending</option>
									<option value="paid">Paid</option>
									<option value="shipped">Shipped</option>
								</select>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);
}