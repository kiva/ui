<template>
	<section>
		<a id="loanComments"></a>
		<h2 class="tw-text-h2 tw-mb-2">
			Comments ({{ comments.length }})
		</h2>

		<!-- Comment form -->
		<div class="tw-mb-3">
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
			<div class="tw-flex tw-items-center tw-gap-2">
				<kv-button
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
						@click="subscribe"
					>
						Subscribe
					</kv-button>
					<kv-button
						v-else
						variant="link"
						data-testid="bp-comment-unsubscribe"
						@click="unsubscribe"
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
			<button
				class="tw-text-action tw-underline"
				data-testid="bp-comment-guidelines-link"
				@click="showGuidelines"
			>
				Kiva conversation guidelines
			</button>
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
					<!-- comment.body is HTML sanitized server-side
						(same as old PHP BP which used triple-stash unescaped rendering) -->
					<div class="tw-text-base" v-html="comment.body"></div>
					<!-- Actions -->
					<div class="tw-flex tw-gap-2 tw-mt-0.5 tw-text-small">
						<button
							v-if="isAdmin"
							class="tw-text-danger hover:tw-underline"
							data-testid="bp-comment-delete"
							@click="pendingDeleteCommentId = comment.id; isDeleteConfirmVisible = true"
						>
							Delete
						</button>
						<button
							v-if="!comment.isFlagged"
							class="tw-text-secondary hover:tw-underline"
							data-testid="bp-comment-flag"
							@click="openReportLightbox(comment.id)"
						>
							Flag as inappropriate
						</button>
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
		<button
			v-if="hasSpillover && !showAll"
			class="tw-text-action tw-underline tw-block tw-mx-auto tw-mb-2"
			data-testid="bp-comment-show-all"
			@click="showAll = true"
		>
			Show all comments
		</button>
		<button
			v-if="hasSpillover && showAll"
			class="tw-text-action tw-underline tw-block tw-mx-auto tw-mb-2"
			@click="showAll = false"
		>
			Hide
		</button>

		<kv-lightbox
			:visible="isDeleteConfirmVisible"
			title="Delete this comment?"
			@lightbox-closed="isDeleteConfirmVisible = false"
		>
			This action cannot be undone.
			<template #controls>
				<kv-button variant="secondary" @click="isDeleteConfirmVisible = false">
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
import { format, parseISO } from 'date-fns';
import { KvButton, KvLightbox } from '@kiva/kv-components';
import CommentReportLightbox from '#src/components/BorrowerProfile/CommentReportLightbox';
import addCommentMutation from '#src/graphql/mutation/loanAddComment.graphql';
import logFormatter from '#src/util/logFormatter';

const INITIAL_COMMENT_COUNT = 15;

const commentsQuery = gql`query loanCommentsFullList($loanId: Int!) {
	lend {
		loan(id: $loanId) {
			id
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
				subscribed
			}
		}
	}
	my {
		id
		isAdmin
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
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
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
			comments: [],
			isAdmin: false,
			isSubscribed: false,
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
			this.comments = (loan?.comments?.values ?? []).map(c => ({
				id: c.id,
				authorName: c.author?.name,
				authorImageUrl: c.author?.imageUrl,
				authorRole: c.author?.role,
				body: c.body,
				date: c.date,
				isBorrower: c.author?.role === 'borrower',
				isFlagged: false,
			}));
			this.isSubscribed = loan?.userProperties?.subscribed ?? false;
			this.isAdmin = data?.my?.isAdmin ?? false;
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
			if (!this.newCommentText.trim()) return;
			this.isSubmitting = true;
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
		async confirmDeleteComment() {
			const commentId = this.pendingDeleteCommentId;
			this.isDeleteConfirmVisible = false;
			this.pendingDeleteCommentId = null;
			try {
				await this.apollo.mutate({
					mutation: removeCommentMutation,
					variables: { loanId: this.loanId, commentId },
				});
				this.comments = this.comments.filter(c => c.id !== commentId);
				this.$showTipMsg('Comment deleted');
			} catch (e) {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem deleting this comment', 'error');
			}
		},
		openReportLightbox(commentId) {
			this.reportingCommentId = commentId;
			this.isReportLightboxVisible = true;
		},
		onCommentReported(commentId) {
			const comment = this.comments.find(c => c.id === commentId);
			if (comment) {
				comment.isFlagged = true;
				comment.timeFlagged = new Date().toISOString();
			}
		},
		async subscribe() {
			try {
				await this.apollo.mutate({
					mutation: loanSubscribeMutation,
					variables: { loanId: this.loanId, subscribe: true },
				});
				this.isSubscribed = true;
			} catch (e) {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem subscribing', 'error');
			}
		},
		async unsubscribe() {
			try {
				await this.apollo.mutate({
					mutation: loanSubscribeMutation,
					variables: { loanId: this.loanId, subscribe: false },
				});
				this.isSubscribed = false;
			} catch (e) {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem unsubscribing', 'error');
			}
		},
	},
};
</script>
