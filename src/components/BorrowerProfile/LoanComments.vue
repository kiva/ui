<template>
	<section>
		<a id="loanComments"></a>
		<h2 class="tw-text-headline tw-mb-2">
			Comments ({{ comments.length }})
		</h2>

		<!-- Comment form -->
		<div class="tw-mb-3">
			<template v-if="canAddComment">
				<label for="bp-comment-field" class="tw-sr-only">
					Comment
				</label>
				<textarea
					id="bp-comment-field"
					v-model="newCommentText"
					class="tw-w-full tw-border tw-border-tertiary tw-rounded tw-p-1 tw-mb-1"
					rows="4"
					data-testid="bp-comment-form-textarea"
				></textarea>
			</template>
			<p
				v-else-if="showMustBeLenderMessage"
				class="tw-text-secondary tw-mb-1"
				data-testid="bp-comment-must-be-lender"
			>
				You must be a lender to comment on this loan.
			</p>
			<div class="tw-flex tw-items-center tw-gap-2">
				<kv-button
					v-if="canAddComment"
					variant="secondary"
					data-testid="bp-comment-form-submit"
					:state="isSubmitting ? 'loading' : ''"
					@click="submitComment"
				>
					Comment
				</kv-button>
				<div class="tw-flex tw-items-center tw-gap-1">
					<kv-button
						v-if="!isSubscribed"
						variant="link"
						data-testid="bp-comment-subscribe"
						@click="setSubscription(true)"
					>
						Subscribe
					</kv-button>
					<kv-button
						v-else
						variant="link"
						data-testid="bp-comment-unsubscribe"
						@click="setSubscription(false)"
					>
						Unsubscribe
					</kv-button>
					<small class="tw-text-secondary">
						{{ isSubscribed ? 'you are notified of replies' : 'to be notified of replies' }}
					</small>
				</div>
			</div>
		</div>

		<!-- Conversation guidelines -->
		<p class="tw-mb-3">
			<kv-text-link
				data-testid="bp-comment-guidelines-link"
				@click="showGuidelines"
			>
				Kiva conversation guidelines
			</kv-text-link>
		</p>

		<!-- Comment list -->
		<ul v-if="visibleComments.length" class="tw-list-none tw-p-0 tw-m-0">
			<li
				v-for="comment in visibleComments"
				:key="comment.id"
				:id="`comment-${comment.id}`"
				class="tw-flex tw-gap-2 tw-mb-3"
				:class="{ 'tw-bg-brand-25 tw-rounded tw-p-1': comment.isBorrower }"
			>
				<!-- Avatar -->
				<div class="tw-flex-none tw-w-5 tw-h-5">
					<img
						v-if="comment.authorImageUrl"
						:src="comment.authorImageUrl"
						:alt="comment.authorName"
						class="tw-rounded-full tw-w-full tw-h-full tw-object-cover"
					>
					<div
						v-else
						class="tw-rounded-full tw-bg-brand tw-w-full tw-h-full
							tw-flex tw-items-center tw-justify-center tw-text-primary-inverse"
					>
						{{ comment.authorName?.charAt(0) }}
					</div>
				</div>
				<!-- Content -->
				<div class="tw-flex-auto">
					<div class="tw-text-small tw-text-secondary tw-mb-0.5">
						{{ comment.authorName }}<!--
						-->{{ comment.authorRole ? `, ${comment.authorRole}` : '' }}
						| {{ formatDate(comment.date) }}
					</div>
					<!-- comment.body is sanitized -->
					<div class="tw-text-base" v-html="comment.body"></div>
					<!-- Actions -->
					<div class="tw-flex tw-gap-2 tw-mt-0.5 tw-text-small">
						<kv-text-link
							v-if="isAdmin"
							class="!tw-text-danger hover:!tw-text-danger-highlight"
							data-testid="bp-comment-delete"
							@click="openDeleteConfirm(comment.id)"
						>
							Delete
						</kv-text-link>
						<kv-text-link
							v-if="!comment.isFlagged"
							class="!tw-text-secondary"
							data-testid="bp-comment-flag"
							@click="openReportLightbox(comment.id)"
						>
							Flag as inappropriate
						</kv-text-link>
						<span
							v-if="comment.isFlagged"
							class="tw-text-secondary"
						>
							Flagged on {{ formatDate(comment.timeFlagged) }}
						</span>
					</div>
				</div>
			</li>
		</ul>

		<!-- Show all / hide -->
		<div v-if="hasSpillover" class="tw-text-center tw-mb-2">
			<kv-button
				variant="secondary"
				data-testid="bp-comment-show-all"
				@click="toggleShowAll"
			>
				<template v-if="!showAll">
					Show all comments
				</template>
				<template v-else>
					Hide
				</template>
			</kv-button>
		</div>

		<kv-lightbox
			:visible="isDeleteConfirmVisible"
			title="Delete this comment?"
			@lightbox-closed="isDeleteConfirmVisible = false"
		>
			This action cannot be undone.
			<template #controls>
				<kv-button variant="secondary" data-testid="bp-comment-delete-cancel" @click="cancelDeleteComment">
					Cancel
				</kv-button>
				<kv-button @click="confirmDeleteComment">
					Delete comment
				</kv-button>
			</template>
		</kv-lightbox>

		<comment-report-lightbox
			:visible="isReportLightboxVisible"
			:loan-id="loanId"
			:comment-id="reportingCommentId"
			@close="isReportLightboxVisible = false"
			@reported="onCommentReported"
		/>
	</section>
</template>

<script>
import { gql } from 'graphql-tag';
import DOMPurify from 'dompurify';
import { format, parseISO } from 'date-fns';
import { KvButton, KvLightbox, KvTextLink } from '@kiva/kv-components';
import CommentReportLightbox from '#src/components/BorrowerProfile/CommentReportLightbox';
import addCommentMutation from '#src/graphql/mutation/loanAddComment.graphql';
import logFormatter from '#src/util/logFormatter';

const INITIAL_COMMENT_COUNT = 15;

const commentsQuery = gql`query loanCommentsFullList($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
			status
			comments {
				values {
					id
					author {
						name
						imageUrl
						role
					}
					body
					date
				}
			}
			userProperties {
				isPrivileged
				lentTo
				subscribed
			}
			... on LoanDirect {
				trustee {
					id
				}
			}
		}
	}
	my {
		id
		isAdmin
		borrowedLoans {
			id
		}
		trustee {
			id
		}
		lender {
			id
			loanCount
		}
	}
}`;

const removeCommentMutation = gql`mutation removeCommentOnLoan($loanId: Int!, $commentId: Int!) {
	loan(id: $loanId) {
		removeComment(commentId: $commentId)
	}
}`;

const loanSubscribeMutation = gql`mutation subscribeLoan($loanId: Int!, $subscribe: Boolean!) {
	loan(id: $loanId) {
		subscribe(subscribe: $subscribe)
	}
}`;

export default {
	name: 'LoanComments',
	inject: {
		apollo: { from: 'apollo' },
		cookieStore: { from: 'cookieStore' },
		openDefinition: { from: 'openDefinition', default: () => () => {} },
	},
	components: {
		CommentReportLightbox,
		KvButton,
		KvLightbox,
		KvTextLink,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	watch: {
		// Reset the session overlays when the loan id changes
		loanId() {
			this.flaggedById = {};
			this.deletedIds = [];
		},
	},
	apollo: {
		lazy: true,
		query: commentsQuery,
		fetchPolicy: 'network-only',
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			this.applyCommentsData(data);
		},
	},
	data() {
		return {
			// Comment values from the last query result
			rawComments: [],
			flaggedById: {},
			deletedIds: [],
			isAdmin: false,
			isSubscribed: false,
			// Fields backing the add-comment permission check
			loanStatus: '',
			loanTrusteeId: null,
			isLoanPrivileged: false,
			lentToLoan: false,
			myBorrowedLoanIds: [],
			myTrusteeId: null,
			myLoanCount: 0,
			newCommentText: '',
			isSubmitting: false,
			showAll: false,
			isReportLightboxVisible: false,
			reportingCommentId: null,
			isDeleteConfirmVisible: false,
			pendingDeleteCommentId: null,
		};
	},
	computed: {
		comments() {
			return this.rawComments
				.filter(c => !this.deletedIds.includes(c.id))
				.map(c => ({
					id: c.id,
					authorName: c.author?.name,
					authorImageUrl: c.author?.imageUrl,
					authorRole: c.author?.role,
					body: c.body,
					date: c.date,
					isBorrower: c.author?.role === 'borrower',
					isFlagged: !!this.flaggedById[c.id],
					timeFlagged: this.flaggedById[c.id],
				}));
		},
		isFundraising() {
			return this.loanStatus === 'fundraising';
		},
		// The logged-in user is a trustee (of any loan)
		isTrustee() {
			return !!this.myTrusteeId;
		},
		// The logged-in user is the trustee for this specific loan
		isTrusteeToLoan() {
			return !!this.myTrusteeId && this.myTrusteeId === this.loanTrusteeId;
		},
		// The logged-in user is the borrower of this loan, i.e. this loan is in the full
		// collection of loans they have borrowed (my.borrowedLoans).
		isBorrowerOfLoan() {
			return this.myBorrowedLoanIds.includes(this.loanId);
		},
		// The logged-in user has lent to at least one loan
		hasLentToAnyLoan() {
			return this.myLoanCount >= 1;
		},
		// The logged-in user has lent to this specific loan
		isLenderOfLoan() {
			return this.lentToLoan;
		},
		canAddComment() {
			return (this.isFundraising && this.isLenderOfLoan)
				|| this.isTrustee
				|| this.isAdmin
				|| this.isTrusteeToLoan
				|| (this.isLoanPrivileged && (this.hasLentToAnyLoan || this.isBorrowerOfLoan));
		},
		// Prompt shown in place of the form on fundraising loans when the viewer
		// is not eligible to comment (i.e. has not lent to this loan).
		showMustBeLenderMessage() {
			return this.isFundraising && !this.canAddComment;
		},
		hasSpillover() {
			return this.comments.length > INITIAL_COMMENT_COUNT;
		},
		visibleComments() {
			if (this.showAll) return this.comments;
			return this.comments.slice(0, INITIAL_COMMENT_COUNT);
		},
	},
	methods: {
		applyCommentsData(data) {
			const loan = data?.lend?.loan;
			this.rawComments = (loan?.comments?.values ?? []).map(c => ({
				...c,
				body: DOMPurify.sanitize(c.body ?? '', {
					ALLOWED_TAGS: ['b', 'i', 'a', 'br'],
					ALLOWED_ATTR: ['href'],
				}),
			}));
			this.isSubscribed = loan?.userProperties?.subscribed ?? false;
			this.isAdmin = data?.my?.isAdmin ?? false;
			this.loanStatus = loan?.status ?? '';
			this.loanTrusteeId = loan?.trustee?.id ?? null;
			this.isLoanPrivileged = loan?.userProperties?.isPrivileged ?? false;
			this.lentToLoan = loan?.userProperties?.lentTo ?? false;
			this.myBorrowedLoanIds = (data?.my?.borrowedLoans ?? []).map(l => l.id);
			this.myTrusteeId = data?.my?.trustee?.id ?? null;
			this.myLoanCount = data?.my?.lender?.loanCount ?? 0;
		},
		async refreshComments() {
			if (!this.loanId) return;
			try {
				const { data } = await this.apollo.query({
					query: commentsQuery,
					variables: { loanId: this.loanId },
					fetchPolicy: 'network-only',
				});
				this.applyCommentsData(data);
			} catch (e) {
				logFormatter(e, 'error');
			}
		},
		formatDate(dateStr) {
			if (!dateStr) return '';
			return format(parseISO(dateStr), 'MMMM d, yyyy');
		},
		showGuidelines() {
			this.openDefinition({
				cid: 'bp-def-conversation-guidelines',
				sfid: '50150000000SmZE',
				track: ['Borrower Profile', 'click-Comments-tab-definition-link', 'Kiva conversation guidelines'],
			});
		},
		async submitComment() {
			if (!this.canAddComment) return;
			if (!this.newCommentText.trim()) return;
			this.isSubmitting = true;
			this.$kvTrackEvent('borrower-profile', 'click', 'comment-submit', null, this.loanId);
			try {
				await this.apollo.mutate({
					mutation: addCommentMutation,
					variables: { id: this.loanId, body: this.newCommentText },
				});
				this.newCommentText = '';
				await this.refreshComments();
			} catch (e) {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem posting your comment', 'error');
			} finally {
				this.isSubmitting = false;
			}
		},
		openDeleteConfirm(commentId) {
			this.pendingDeleteCommentId = commentId;
			this.isDeleteConfirmVisible = true;
			this.$kvTrackEvent('borrower-profile', 'view', 'comment-delete-lightbox', null, commentId);
		},
		cancelDeleteComment() {
			this.$kvTrackEvent('borrower-profile', 'click', 'comment-delete-cancel', null, this.pendingDeleteCommentId);
			this.isDeleteConfirmVisible = false;
		},
		async confirmDeleteComment() {
			const commentId = this.pendingDeleteCommentId;
			this.$kvTrackEvent('borrower-profile', 'click', 'comment-delete-confirm', null, commentId);
			this.isDeleteConfirmVisible = false;
			this.pendingDeleteCommentId = null;
			try {
				await this.apollo.mutate({
					mutation: removeCommentMutation,
					variables: { loanId: this.loanId, commentId },
				});
				this.deletedIds.push(commentId);
				this.$showTipMsg('Comment deleted');
			} catch (e) {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem deleting this comment', 'error');
			}
		},
		openReportLightbox(commentId) {
			this.$kvTrackEvent('borrower-profile', 'click', 'comment-flag-click', null, commentId);
			this.reportingCommentId = commentId;
			this.isReportLightboxVisible = true;
		},
		onCommentReported(commentId) {
			if (!this.rawComments.some(c => c.id === commentId)) return;
			this.flaggedById = { ...this.flaggedById, [commentId]: new Date().toISOString() };
		},
		async setSubscription(subscribe) {
			const label = subscribe ? 'comment-subscribe' : 'comment-unsubscribe';
			this.$kvTrackEvent('borrower-profile', 'click', label, null, this.loanId);
			try {
				await this.apollo.mutate({
					mutation: loanSubscribeMutation,
					variables: { loanId: this.loanId, subscribe },
				});
				this.isSubscribed = subscribe;
			} catch (e) {
				logFormatter(e, 'error');
				this.$showTipMsg(`There was a problem ${subscribe ? 'subscribing' : 'unsubscribing'}`, 'error');
			}
		},
		toggleShowAll() {
			this.showAll = !this.showAll;
			const label = this.showAll ? 'comment-show-all' : 'comment-hide';
			this.$kvTrackEvent('borrower-profile', 'click', label, null, this.loanId);
		},
	},
};
</script>
