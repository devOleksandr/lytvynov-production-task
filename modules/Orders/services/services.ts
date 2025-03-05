import {CartProduct, Order, Product} from "@/modules/Orders/types/types";

export async function fetchOrders(): Promise<Order[]> {
	const res = await fetch(`${process.env.API_URL}/carts`);
	const carts: Omit<Order, 'status'>[] = await res.json();

	//added random status for each "order" because they carts dont have this field
	return carts.map((cart) => ({
		...cart,
		status: ['pending', 'paid', 'shipped'][Math.floor(Math.random() * 3)] as Order['status'],
	}));
}

//get order by ID
export async function fetchOrderById(id: string): Promise<Order> {
	const res = await fetch(`${process.env.API_URL}/carts/${id}`);
	if (!res.ok) {
		throw new Error(`Failed to fetch order with id ${id}. Status: ${res.status}`);
	}
	const cart: Omit<Order, 'status'> = await res.json();
	return {
		...cart,
		products: Array.isArray(cart.products) ? cart.products : [],
		status: ['pending', 'paid', 'shipped'][Math.floor(Math.random() * 3)] as Order['status'],
	};
}

// get product data by ID
export async function fetchProductById(productId: number): Promise<Product> {
	const res = await fetch(`${process.env.API_URL}/products/${productId}`);
	return res.json();
}

// patch order by ID
export async function updateOrderById({ id, status, products }: { id: number; status: Order['status']; products: CartProduct[] }): Promise<Order> {
	const res = await fetch(`${process.env.API_URL}/carts/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			userId: 1,
			date: new Date().toISOString(),
			products,
			status,
		}),
	});
	return res.json();
}