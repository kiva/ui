import { parseISO, differenceInDays } from 'date-fns';

export default {
	props: {
		goal: {
			type: Object,
			required: true,
			default: () => ({}),
		},
	},
	computed: {
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
			return Math.round((this.loansFunded / this.totalLoans) * 100);
		},
		// calculate days remaining between now and the challengeEndDate using the the datefns library
		daysRemaining() {
			// Get planned expiration time as Date
			const plannedExpirationDate = parseISO(this.challengeEndDate);
			const diffInDays = differenceInDays(
				plannedExpirationDate,
				new Date()
			);
			return diffInDays;
		},
	},
};
