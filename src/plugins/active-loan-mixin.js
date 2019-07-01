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
			try {
				return JSON.parse(this.activeLoan.loan);
			} catch (e) {
				return {};
			}
		},
		hoverLoanId() {
			return this.activeLoan.hoverLoanId;
		},
		hoverLoanXCoordinate() {
			return this.activeLoan.xCoordinate;
		},
		hoverLoanYCoordinate() {
			return this.activeLoan.yCoordinate;
		},
		tracking() {
			try {
				return JSON.parse(this.activeLoan.tracking);
			} catch (e) {
				return {};
			}
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
