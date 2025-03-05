"use client";
import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {fetchOrders} from "@/modules/Orders/services/services";
import {Order} from "@/modules/Orders/types/types";
import {Pencil} from "lucide-react";
import {Spinner} from "@/components/UI/Spinner";


export default function OrdersList() {
	const [filter, setFilter] = useState<string>('all');

	const {data: orders, isLoading, error} = useQuery<Order[]>({
		queryKey: ['orders'],
		queryFn: fetchOrders,
	});


	if (isLoading) return <Spinner/>
	if (error) return <div className="text-red-500">Помилка: {(error as Error).message}</div>;

	const filteredOrders = filter === 'all'
		? orders
		: orders!.filter((order) => order.status === filter);

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-8 ">
				<div className="flex gap-2">
					<button
						onClick={() => setFilter('all')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'all'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						Усі
					</button>
					<button
						onClick={() => setFilter('pending')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'pending'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						Очікують
					</button>
					<button
						onClick={() => setFilter('paid')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'paid'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						Оплачені
					</button>
					<button
						onClick={() => setFilter('shipped')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === 'shipped'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						Відправлені
					</button>
				</div>
				<span className="text-sm text-gray-500">Всього: {filteredOrders!.length}</span>
			</div>

			<div className="bg-white  rounded-lg overflow-hidden ">
				<table className="min-w-full divide-y divide-gray-200 shadow-md">
					<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							ID
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Дата
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Користувач
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Товари
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Статус
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Дії
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
								<p
									className={`rounded-md text-center p-1 text-xs ${
										order.status === 'pending'
											? 'bg-yellow-100 text-yellow-800'
											: order.status === 'paid'
												? 'bg-green-100 text-green-800'
												: 'bg-blue-100 text-blue-800'
									}`}
								>
									<span>{order.status}</span>
								</p>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<Link href={`orders/${order.id}`}
								      className="text-xs  inline-flex items-center justify-start hover:text-blue-500 hover:bg-gray-200 rounded-md text-center px-2 py-1 bg-gray-300 text-black-main">
									<Pencil width={16} height={16} className="mr-2"/>
									Редагувати
								</Link>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
		</div>
	);
}