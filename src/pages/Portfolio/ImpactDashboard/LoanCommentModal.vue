<template>
	<kv-lightbox
		:visible="isVisible"
		:title="modalTitle"
		@lightbox-closed="() => closeModal()"
	>
		<div class="tw-text-center">
			<div class="tw-relative">
				<textarea
					ref="commentTextarea"
					class="tw-w-full tw-border tw-border-secondary tw-rounded-xs tw-h-7 tw-p-1 comment-input"
					v-model="userComment"
					:placeholder="commentPlaceholder"
				>
			</textarea>
				<kv-material-icon
					class="tw-w-2.5 tw-h-2.5 tw-absolute tw-bottom-2 tw-right-0"
					:icon="mdiPencilOutline"
				/>
			</div>
			<small
				class="tw-text-left tw-block"
			>Please follow our
				<a
					href="/kiva-community-guidelines" target="_blank"
					class="tw-text-action hover:tw-text-action-highlight"
				>
					community guidelines
				</a>
			</small>
		</div>
		<kv-button
			class="tw-mt-2"
			variant="primary"
			aria-label="Comment"
			:state="buttonState"
			@click="submitComment"
		>
			Save
		</kv-button>
		<p v-if="showError" class="tw-mt-1 tw-text-small tw-text-danger">
			There was a problem commenting on this loan, try again please.
		</p>
	</kv-lightbox>
</template>

<script>
import logFormatter from '#src/util/logFormatter';
import { mdiPencilOutline } from '@mdi/js';
import loanAddComment from '#src/graphql/mutation/loanAddComment.graphql';
import { KvLightbox, KvMaterialIcon, KvButton } from '@kiva/kv-components';

export default {
	name: 'LoanCommentModal',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvLightbox,
		KvMaterialIcon,
		KvButton,
	},
	emits: ['comment-modal-closed'],
	props: {
		loan: {
			type: Object,
			default: () => ({}),
		},
		isVisible: {
			type: Boolean,
			default: false
		},
		showTip: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			mdiPencilOutline,
			userComment: '',
			loading: false,
			showError: false,
		};
	},
	computed: {
		buttonState() {
			if (this.loading) return 'loading';
			if (!this.userComment) return 'disabled';
			return '';
		},
		modalTitle() {
			return `Tell others why you love this loan to ${this.loan.name}`;
		},
		commentPlaceholder() {
			return `Tell others why this loan to ${this.loan.name} is great!`;
		}
	},
	watch: {
		isVisible(newValue) {
			if (newValue) {
				this.$nextTick(() => {
					// Focus the textarea when the modal opens
					this.$refs.commentTextarea?.focus();
				});
			}
		}
	},
	methods: {
		submitComment() {
			this.loading = true;
			this.showError = false;
			this.apollo.mutate({
				mutation: loanAddComment,
				variables: {
					id: this.loan.id,
					body: this.userComment
				}
			}).then(({ data }) => {
				// comment was added successfully
				if (data.loan.addComment) {
					this.closeModal(true);
					this.$kvTrackEvent('portfolio', 'click', 'Leave a loan comment', this.loan.name, this.loan.id); // eslint-disable-line max-len
					if (this.showTip) {
						this.$showTipMsg(`Thank you for helping ${this.loan.name}!`, 'confirmation', true);
					}
				} else {
					throw new Error('Comment not added');
				}
			}).catch(e => {
				this.showError = true;
				logFormatter(e, 'error');
			}).finally(() => {
				this.loading = false;
			});
		},
		closeModal(wasCommentAdded = false) {
			this.userComment = '';
			this.$emit('comment-modal-closed', wasCommentAdded);
		}
	},
};
</script>

<style scoped lang="postcss">
.comment-input {
	height: 12rem;
}

@screen lg {
	.comment-input {
		min-width: 832px;
	}
}
</style>
