/**
 * This is a helper function to update cookies values for user metrics.
 * it is going to be used for Optimizely A/B experiment.
 * @param cookieStore
 * @param loans
 * @param receipt
 */
export default function handleUserMetricsCookies(cookieStore, loans, receipt) {
	const depositTotal = receipt?.totals?.depositTotals?.depositTotal;
	const hasLentBefore = loans?.length > 0;
	const hasDepositBefore = parseFloat(depositTotal) > 0;

	if (hasLentBefore || hasDepositBefore) {
		cookieStore.remove('kvu_lb');
		cookieStore.remove('kvu_db');

		cookieStore.set('kvu_lb', hasLentBefore);
		cookieStore.set('kvu_db', hasDepositBefore);
	}
}
