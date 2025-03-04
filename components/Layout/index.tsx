"use client";
import {ReactNode, useState} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {getQueryClient} from "@/utils/queryClient";

export const Layout = ({children}: { children: ReactNode }) => {
	const [queryClient] = useState(() => getQueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<header className="bg-white shadow-sm p-4 flex justify-between items-center">
				<h5 className="text-2xl font-semibold">Order Manager</h5>
				<div className="text-sm text-gray-500">User: Admin</div>
			</header>
			<main className="min-h-screen p-6">{children}</main>
		</QueryClientProvider>
	)
}