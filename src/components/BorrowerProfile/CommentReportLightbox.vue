<template>
	<Teleport to="body">
		<kv-lightbox
			:visible="visible"
			title="Report comment"
			@lightbox-closed="$emit('close')"
		>
			<template #header>
				<h2>
					Report Comment
				</h2>
				<h3 class="tw-mt-2">
					Why are you reporting this comment?
				</h3>
			</template>

			<fieldset class="tw-flex tw-flex-col tw-gap-2 tw-mt-1 tw-mb-2">
				<kv-radio
					value="I find it offensive"
					name="reportReason"
					v-model="selectedReason"
				>
					I find it offensive
				</kv-radio>
				<kv-radio
					value="It's spam or misleading"
					name="reportReason" v-model="selectedReason"
				>
					It's spam or misleading
				</kv-radio>
				<kv-radio
					value="It is harmful, violent, or could cause harm"
					name="reportReason" v-model="selectedReason"
				>
					It is harmful, violent, or could cause harm
				</kv-radio>
			</fieldset>

			<template #controls>
				<kv-button
					variant="secondary"
					@click="$emit('close')"
				>
					Cancel
				</kv-button>
				<kv-button
					variant="primary"
					:state="buttonState"
					@click="reportComment"
				>
					Submit report
				</kv-button>
			</template>
		</kv-lightbox>
	</Teleport>
</template>

<script>
import { KvLightbox, KvRadio, KvButton } from '@kiva/kv-components';
import reportLoanCommentMutation from '#src/graphql/mutation/reportLoanComment.graphql';
import logFormatter from '#src/util/logFormatter';

export default {
	name: 'CommentReportLightbox',
	inject: ['apollo'],
	components: {
		KvButton,
		KvLightbox,
		KvRadio,
	},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		loanId: {
			type: Number,
			required: true,
		},
		commentId: {
			type: Number,
			default: null,
		},
	},
	emits: ['close', 'reported'],
	data() {
		return {
			selectedReason: '',
			isSubmitting: false,
		};
	},
	computed: {
		buttonState() {
			if (this.isSubmitting) return 'loading';
			if (!this.selectedReason) return 'disabled';
			return '';
		},
	},
	watch: {
		visible(newVal) {
			if (!newVal) {
				this.selectedReason = '';
			}
		},
	},
	methods: {
		reportComment() {
			// KvButton's click handler emits regardless of state, so the visual
			// disabled/loading state alone doesn't prevent a second submission.
			if (this.isSubmitting) return;
			this.isSubmitting = true;
			this.apollo.mutate({
				mutation: reportLoanCommentMutation,
				variables: {
					loanId: this.loanId,
					commentId: this.commentId,
					description: this.selectedReason,
				}
			}).then(({ data, errors }) => {
				if (data?.loan?.flagComment) {
					this.$showTipMsg('Thank you for reporting this comment!');
					this.$emit('reported', this.commentId);
				} else if (errors?.[0]?.message) {
					this.$showTipMsg(errors[0].message);
				} else {
					throw new Error('There was a problem reporting this comment');
				}
			}).catch(e => {
				logFormatter(e, 'error');
				this.$showTipMsg('There was a problem reporting this comment', 'error');
			}).finally(() => {
				this.$emit('close');
				this.isSubmitting = false;
			});
		},
	},
};
</script>
