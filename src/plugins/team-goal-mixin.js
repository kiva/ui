import { formatDistanceToNowStrict } from 'date-fns';

export default {
	props: {
		goal: {
			type: Object,
			required: true,
			default: () => ({}),
		},
	},
	computed: {
		challengeName() {
			return this.goal?.name ?? '';
		},
		challengeEndDate() {
			return this.goal?.endDate ?? null;
		},
		loansFunded() {
			const loans = this.goal?.targets?.values ?? [];
			// filter out loans where status is not complete
			const completedLoans = loans.filter(
				loan => loan.status === 'COMPLETE'
			);
			return completedLoans.length ?? 0;
		},
		totalLoans() {
			return this.goal?.targets?.totalCount ?? 0;
		},
		percentageFunded() {
			const targetAmount = this.goal?.targets?.values?.[0]?.targetLendAmount ?? 0;
			const fundedAmount = this.goal?.participation?.amountLent
				? Number(this.goal?.participation?.amountLent)
				: 0;

			return Math.floor((fundedAmount / targetAmount) * 100) || 0;
		},
		participationTotalCount() {
			return this.goal?.participation?.totalCount ?? 0;
		},
		fundedAmount() {
			return this.goal?.participation?.amountLent
				? Number(this.goal?.participation?.amountLent)
				: 0;
		},
		totalAmount() {
			return this.goal?.targets?.values?.[0]?.targetLendAmount ?? 0;
		},
		daysLeft() {
			const end = this.goal?.endDate ? new Date(this.goal?.endDate) : new Date();
			return formatDistanceToNowStrict(
				end,
				{
					unit: 'day',
					roundingMethod: 'ceil'
				}
			);
		},
		challengeDescription() {
			return this.goal?.description ?? '';
		},
		authorName() {
			return this.goal?.descriptionAuthor?.name ?? '';
		},
		authorImageUrl() {
			return this.goal?.descriptionAuthor?.image?.url ?? '';
		},
		participants() {
			return this.goal?.participation ?? {};
		},
		challengeActivity() {
			const activities = this.goal?.participation?.values ?? [];
			const data = [];

			activities
				// Show one activity item per lender with the amounts summed
				.forEach(activity => {
					const existing = data.find(a => a?.lender?.id === activity?.lender?.id);
					if (existing) {
						const existingAmount = parseFloat(existing?.amountLent ?? 0);
						const activityAmount = parseFloat(activity?.amountLent ?? 0);
						existing.amountLent = existingAmount + activityAmount;
					} else {
						// Shallow copy the read-only object so we can sum the amountLent
						data.push({ ...activity });
					}
				});

			return data;
		},
	},
};
