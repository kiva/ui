import updateActiveLoan from '@/graphql/mutation/updateActiveLoan.graphql';

const emptyActiveLoan = {
	xCoordinate: 0,
	yCoordinate: 0,
	loan: JSON.stringify({
		activity: {},
		userProperties: {},
		loanFundraisingInfo: {},
		geocode: {
			country: {},
		},
		image: {},
	}),
	hoverLoanId: 0,
	tracking: JSON.stringify({}),
};

export default {
	inject: ['apollo'],
	data() {
		return {
			activeLoan: emptyActiveLoan,
		};
	},
	computed: {
		hoverLoan() {
			return JSON.parse(this.activeLoan.loan);
		},
		hoverLoanXCoordinate() {
			return this.activeLoan.xCoordinate;
		},
		hoverLoanYCoordinate() {
			return this.activeLoan.yCoordinate;
		},
		tracking() {
			return JSON.parse(this.activeLoan.tracking);
		},
	},
	methods: {
		setHoverLoan({
			xCoordinate,
			yCoordinate,
			hoverLoanId,
			loan,
			tracking,
		}) {
			this.apollo.mutate({
				mutation: updateActiveLoan,
				variables: Object.assign({}, this.activeLoan, {
					xCoordinate,
					yCoordinate,
					hoverLoanId,
					loan,
					tracking,
				}),
			});
		},
		clearHoverLoan() {
			this.apollo.mutate({
				mutation: updateActiveLoan,
				variables: emptyActiveLoan,
			});
		},
	},
};
