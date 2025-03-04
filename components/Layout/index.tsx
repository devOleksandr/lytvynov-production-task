"use client";
import {ReactNode, useState} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {getQueryClient} from "@/utils/queryClient";
import Link from "next/link";

export const Layout = ({children}: { children: ReactNode }) => {
	const [queryClient] = useState(() => getQueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<header className="bg-white shadow-sm p-4 flex justify-between items-center">
				<Link href="/" className="text-h5 font-semibold hover:text-blue-500">Order Manager</Link>
				<div className="text-sm text-gray-500">Користувач: Admin</div>
			</header>
			<main className="min-h-screen p-6">{children}</main>
		</QueryClientProvider>
	)
}