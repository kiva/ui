export default function getMonthsCount(startTimestamp, endTimestamp = null) {
	const endDate = endTimestamp ? new Date(endTimestamp) : new Date();
	const startDate = new Date(startTimestamp);
	let monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12;
	monthsDiff -= startDate.getMonth();
	monthsDiff += endDate.getMonth() + 1; // +1 counting the first month

	if (endDate.getDate() < startDate.getDate()) {
		monthsDiff -= 1;
	}

	return monthsDiff;
}
