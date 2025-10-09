import { useEffect, useState } from "react";

interface Subscription {
	subscription_status: boolean;
	subscription_type: string | null;
	has_incomplete_payment: boolean;
}

interface User {
	access_black_friday_bonus: number;
	access_instagram_advantage: number;
	access_without_subscription: boolean;
	active_trials: number;
	avatar: string;
	awebber_account_id: number | null;
	awebber_list_id: number | null;
	awebber_list_name: string | null;
	awebber_refresh_token: string | null;
	awebber_send_instagram: number;
	bf_funnel_step_24: number;
	calendar_booking_link: string | null;
	email: string;
	first_name: string;
	id: number;
	initial_purchase_ends_at: string | null;
	last_active_subscription: string | null;
	last_name: string;
	lifetime_trials: number;
	locked_module_access: number[];
	members: number;
	phone: string | null;
	sales_lifetime: number;
	sales_mtd: number;
	status: string;
	status_label: string;
	subs_current_end: string | null;
	subscription: Subscription;
	url_large: string;
	url_medium: string;
	url_small: string;
	username: string | null;
	zapier_lead_webhook: string | null;
	zapier_sale_webhook: string | null;
	zapier_webhook: string | null;
}
const useAuth = () => {
	const logout = () => {
		console.log("logout");
	};
	const exchangeCodeForSessionToken = () => {
		console.log("exchangeCodeForSessionToken");
	};
	const [user, setUser] = useState<User | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	const [isPending, setIsPending] = useState<boolean>(true);
	const getUser = () => {
		setIsPending(true);
		const authToken = localStorage.getItem("authTokens");
		const token = JSON.parse(authToken || "{}");
		setUser(token.user);
		setIsAdmin(token.isAdmin);
		setIsPending(false);
	};
	useEffect(() => {
		getUser();
	}, []);
	// console.log("token", token);

	return {
		logout,
		exchangeCodeForSessionToken,
		user,
		isAdmin,
		isPending,
	};
};

export default useAuth;
