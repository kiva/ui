/**
 * This mixin is used to submit a comment on a loan that
 * was left as a guest before they created their account.
 * If the cookie values are present, and the user is logged in,
 * we can now leave the comment and remove the cookiies
 */
import { gql } from '@apollo/client';
import logFormatter from '@/util/logFormatter';

export const GUEST_COMMENT_COMMENT = 'guestCommentComment';
export const GUEST_COMMENT_LOANID = 'guestCommentLoanId';

export default {
	mounted() {
		const guestCommentComment = this.cookieStore.get(GUEST_COMMENT_COMMENT);
		const guestCommentLoanId = this.cookieStore.get(GUEST_COMMENT_LOANID);
		const currentLoanId = this.$route?.params?.id;
		const isTargetBorrowerProfile = currentLoanId.toString() === guestCommentLoanId.toString();
		if (isTargetBorrowerProfile && guestCommentComment) {
			this.submitComment();
		}
	},
	methods: {
		submitComment() {
			this.apollo.mutate({
				mutation: gql`mutation commentOnLoan($id: Int!, $body: String) {
					loan(id: $id) {
						addComment(body: $body)
					}
				}`,
				variables: {
					id: Number(this.$route?.params?.id ?? 0),
					body: this.cookieStore.get(GUEST_COMMENT_COMMENT)
				}
			}).then(({ data }) => {
				// comment was added successfully
				if (data.loan.addComment) {
					this.$showTipMsg('Thank you for leaving a comment!');
					// remove cookie values so we don't post the comment again
					this.cookieStore.remove(GUEST_COMMENT_COMMENT);
					this.cookieStore.remove(GUEST_COMMENT_LOANID);
				} else {
					throw new Error('Comment not added');
				}
			}).catch(e => {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem commenting on this loan', 'error');
			});
		}
	},

};
