import loanBookmarkMutation from '@/graphql/mutation/updateLoanFavorite.graphql';

/**
 * bookmarkLoan mutation
 * Adds or removes loan from user's saved loans list
 *
 * @param {Number} loanId
 * @param {Boolean} isBookmarked
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
export default function bookmarkLoan(apollo, loanId, isBookmarked) {
	return apollo.mutate({
		mutation: loanBookmarkMutation,
		variables: {
			loan_id: loanId,
			is_favorite: isBookmarked
		}
	});
}
