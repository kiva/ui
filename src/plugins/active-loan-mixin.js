import _get from 'lodash/get';
import activeLoanClient from '@/graphql/query/activeLoanClient.graphql';
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
		activeLoanWillChange() {},
		activeLoanWillClear() {},
		activeLoanDidChange() {},
		activeLoanDidClear() {},
	},
	mounted() {
		this.apollo.watchQuery({ query: activeLoanClient }).subscribe({
			next: ({ data }) => {
				const activeLoanState = _get(data, 'activeLoan');
				if (activeLoanState.hoverLoanId) {
					this.activeLoanWillChange();
				} else {
					this.activeLoanWillClear();
				}
				this.activeLoan = Object.assign({}, this.activeLoan, {
					xCoordinate: activeLoanState.xCoordinate,
					yCoordinate: activeLoanState.yCoordinate,
					loan: activeLoanState.loan,
					hoverLoanId: activeLoanState.hoverLoanId,
					tracking: activeLoanState.tracking,
				});
				if (activeLoanState.hoverLoanId) {
					this.activeLoanDidChange();
				} else {
					this.activeLoanDidClear();
				}
			},
		});
	},
};
