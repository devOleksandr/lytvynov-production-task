export interface CartProduct {
	productId: number;
	quantity: number;
}

export interface Order {
	id: number;
	userId: number;
	date: string;
	products: CartProduct[];
	status: 'pending' | 'paid' | 'shipped';
}


export interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	image: string;
}