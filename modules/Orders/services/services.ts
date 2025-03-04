import {Order} from "@/modules/Orders/types/types";

export async function fetchOrders(): Promise<Order[]> {
	const res = await fetch('https://fakestoreapi.com/carts');
	const carts: Omit<Order, 'status'>[] = await res.json();
	return carts.map((cart) => ({
		...cart,
		status: ['pending', 'paid', 'shipped'][Math.floor(Math.random() * 3)] as Order['status'],
	}));
}

export async function updateOrderStatus({ id, status }: { id: number; status: Order['status'] }): Promise<Order> {
	const res = await fetch(`https://fakestoreapi.com/carts/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status }),
	});
	return res.json();
}