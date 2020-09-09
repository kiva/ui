import {
	differenceInMinutes,
	differenceInHours,
	differenceInDays,
	parseISO
} from 'date-fns';

function checkLoanProps(loan) {
	if (!loan.plannedExpirationDate) {
		return false;
	}
	return true;
}

export default {
	computed: {
		timeLeftMessage() {
			if (!this.loan || !checkLoanProps(this.loan)) {
				return '';
			}

			const days = differenceInDays(parseISO(this.loan.plannedExpirationDate), Date.now());
			if (days >= 6) {
				return `${days} days left`;
			}
			if (days >= 2) {
				return `Only ${days} days left! `;
			}
			const hours = differenceInHours(parseISO(this.loan.plannedExpirationDate), Date.now());
			if (hours >= 2) {
				return `Only ${hours} hours left! `;
			}
			const mins = differenceInMinutes(parseISO(this.loan.plannedExpirationDate), Date.now());
			if (mins >= 2) {
				return `Only ${mins} minutes left! `;
			}
			return 'Ending now!';
		},
		expiringSoonMessage() {
			if (!this.loan || !checkLoanProps(this.loan)) {
				return '';
			}

			const days = differenceInDays(parseISO(this.loan.plannedExpirationDate), Date.now());
			// Send empty message if expiration is greater than 6 days
			// > This matches the wwwApp implmentation
			if (days >= 6) {
				return '';
			}
			return this.timeLeftMessage;
		},
	},
};
