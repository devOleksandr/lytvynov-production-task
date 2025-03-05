"use client";

import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useParams, useRouter} from 'next/navigation';
import Link from 'next/link';
import {Formik, Form, Field, ErrorMessage, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {CartProduct, Order, Product} from "@/modules/Orders/types/types";
import {fetchOrderById, fetchProductById, updateOrderById} from "@/modules/Orders/services/services";
import {Spinner} from "@/components/UI/Spinner";
import {Pencil} from "lucide-react";


interface OrderFormValues {
	status: Order['status'];
	products: CartProduct[];
}

const OrderValidationSchema = Yup.object().shape({
	status: Yup.string()
		.oneOf(['pending', 'paid', 'shipped'], 'Невірний статус')
		.required('Статус обов’язковий'),
	products: Yup.array()
		.of(
			Yup.object().shape({
				productId: Yup.number().required('ID товару обов’язковий'),
				quantity: Yup.number().min(1, 'Кількість має бути більше 0').required('Кількість обов’язкова'),
			})
		)
		.min(1, 'Замовлення має містити хоча б один товар')
		.required('Товари обов’язкові'),
});

export default function OrderDetails() {
	const queryClient = useQueryClient();
	const {id} = useParams<{ id: string }>();
	const router = useRouter();

	const {data: order, isLoading: orderLoading, error: orderError} = useQuery<Order>({
		queryKey: ['order', id],
		queryFn: () => fetchOrderById(id),
		retry: false //need for permanent redirect without retry connect
	});

	const productIds: number[] = order?.products.map((p) => p.productId) || [];

	const {data: productsData, isLoading: productsLoading, error: productsError} = useQuery<Product[]>({
		queryKey: ['products', productIds],
		queryFn: () => Promise.all(productIds.map((productId) => fetchProductById(productId))),
		enabled: !!productIds.length,
	});


	const mutation = useMutation({
		mutationFn: updateOrderById,
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['order', id]});
			queryClient.invalidateQueries({queryKey: ['orders']});
		},
	});

	const initialValues: OrderFormValues = {
		status: order?.status || 'pending',
		products: Array.isArray(order?.products) ? [...order.products] : [],
	};

	const handleRemoveProduct = (
		productId: number,
		setFieldValue: FormikHelpers<OrderFormValues>['setFieldValue'],
		values: OrderFormValues
	) => {
		const updatedProducts = values.products.filter((p) => p.productId !== productId);
		console.log(`Removing product ${productId}. Updated products:`, updatedProducts);
		setFieldValue('products', updatedProducts);
	};

	const handleSubmit = (values: OrderFormValues, {setSubmitting}: FormikHelpers<OrderFormValues>) => {
		if (order) {
			mutation.mutate({id: order.id, status: values.status, products: values.products});
		}
		setSubmitting(false);
	};


	// useEffect(() => {
	// 	if (orderError) {
	// 		router.push('/orders');
	// 	}
	// }, [orderError, router]);


	if (orderLoading) return <Spinner />;

	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-semibold">Замовлення #{order!.id}</h1>
				<Link href="/orders" className="text-indigo-600 hover:underline text-sm">
					← Назад до списку
				</Link>
			</div>
			<Formik
				initialValues={initialValues}
				validationSchema={OrderValidationSchema}
				onSubmit={handleSubmit}
				enableReinitialize
			>
				{({values, setFieldValue, isSubmitting}) => (
					<Form className="bg-white shadow-md rounded-lg p-6">
						<div className="grid grid-cols-2 gap-4 mb-6">
							<div>
								<p className="text-sm text-gray-500">Дата:</p>
								<p className="text-gray-900">{new Date(order!.date).toLocaleString()}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Користувач:</p>
								<p className="text-gray-900">{order!.userId}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Статус:</p>
								<Field
									as="select"
									name="status"
									className={`border rounded-md p-1 text-sm ${
										values.status === 'pending'
											? 'bg-yellow-100 text-yellow-800'
											: values.status === 'paid'
												? 'bg-green-100 text-green-800'
												: 'bg-blue-100 text-blue-800'
									}`}
								>
									<option value="pending">Очікує</option>
									<option value="paid">Оплачено</option>
									<option value="shipped">Відправлено</option>
								</Field>
								<ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1"/>
							</div>
						</div>
						<h2 className="text-lg font-medium mb-4">Товари</h2>
						{productsLoading ? (
							<Spinner/>
						) : productsError ? (
							<div className="text-red-500 text-center py-4">Помилка завантаження товарів</div>
						) : !Array.isArray(values.products) ? (
							<div className="text-red-500 text-center py-4">Помилка: товари не є масивом</div>
						) : values.products.length === 0 ? (
							<div className="text-gray-500 text-center py-4">Немає товарів у замовленні</div>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
									<thead className="bg-gray-100">
									<tr>
										<th
											className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Зображення
										</th>
										<th
											className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID
										</th>
										<th
											className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Назва
										</th>
										<th
											className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Опис
										</th>
										<th
											className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Кількість
										</th>
										<th
											className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Дії
										</th>
									</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
									{values.products.map((product) => {
										const productData = productsData?.find((p: Product) => p.id === product.productId);
										return (
											<tr key={product.productId} className="hover:bg-gray-50 transition-colors">
												<td className="px-4 py-3">
													{productData?.image ? (
														<img
															src={productData.image}
															alt={productData.title}
															className="w-12 h-12 object-cover rounded-md"
														/>
													) : (
														<div
															className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
															Немає
														</div>
													)}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">{product.productId}</td>
												<td
													className="px-4 py-3 text-sm text-gray-900">{productData?.title || 'Завантаження...'}</td>
												<td
													className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{productData?.description || 'Завантаження...'}</td>
												<td className="px-4 py-3 text-sm text-gray-900">{product.quantity}</td>
												<td className="px-4 py-3 text-sm">
													<button
														type="button"
														onClick={() => handleRemoveProduct(product.productId, setFieldValue, values)}
														className="text-xs  inline-flex items-center justify-start hover:text-white hover:bg-red-500 rounded-md text-center px-2 py-1 bg-gray-300 text-black-main"
													>
														<Pencil width={16} height={16} className="mr-2"/>
														Видалити
													</button>
												</td>
											</tr>
										);
									})}
									</tbody>
								</table>
								<ErrorMessage name="products" component="div" className="text-red-500 text-xs mt-2"/>
							</div>
						)}
						<div className="mt-6 flex justify-end">
							<button
								type="submit"
								disabled={isSubmitting || mutation.isPending}
								className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
									isSubmitting || mutation.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
								}`}
							>
								{isSubmitting || mutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}