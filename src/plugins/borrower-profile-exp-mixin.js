// mixins/borrowerProfileMixin.js
import borrowerProfileSideSheetQuery from '#src/graphql/query/borrowerProfileSideSheet.graphql';

export default {
	methods: {
		loadBPData(loanId) {
			this.apollo.query({
				query: borrowerProfileSideSheetQuery,
				variables: {
					loanId
				}
			});
		},

		getCustomHref(loanId) {
			const resolvedRoute = this.$router.resolve({
				query: { ...this.$route.query, loanId },
			});
			return resolvedRoute.href;
		},
	},
};
