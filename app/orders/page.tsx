import {OrdersPage} from "@/modules/Orders";
import {Metadata} from "next";

export async function generateMetadata(): Promise<Metadata>{
return {
		title: 'Order Manager',
		keywords: 'any',
		description: 'Project stack and technology: Next.js,TypeScript,React Query, TailwindCSS, Formik, Yuo',
		alternates: {
			canonical: `/orders`,
		},
		twitter: {
			description: '',
			creator: 'Oleksandr Oliinyk',
			card: 'summary'
		},
		openGraph: {
			title: 'Order Manager',
			type: 'website',
			description:  'Project stack and technology: Next.js,TypeScript,React Query, TailwindCSS, Formik, Yuo',
		}
	}
}

export default function Orders() {
	return (
		<OrdersPage/>
	)
}