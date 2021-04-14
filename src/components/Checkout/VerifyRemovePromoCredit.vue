<template>
	<kv-lightbox
		@lightbox-closed="closeLightbox"
		:visible="visible"
		title="You are leaving the promotion"
	>
		<div class="content">
			<p>
				<strong>WARNING:</strong> If you proceed, your {{ appliedPromoTotal }} credit from
				the {{ promoFundDisplayName }} promotion will be removed, and you will have to lend
				using your own money.
			</p>
			<p>Click "Cancel" to use your free loan, or click "Remove Credit" to pay using your own money.</p>
		</div>
		<template #controls>
			<div class="controls">
				<kv-button
					class="smallest secondary controls__cancel-btn"
					v-kv-track-event="['promoCampaign', 'Cancel Promo Opt-out Button']"
					@click.native="closeLightbox"
				>
					Cancel
				</kv-button>
				<kv-button
					class="smallest"
					v-kv-track-event="['promoCampaign', 'Promo Opt-out Button']"
					@click.native="removePromoCredit"
				>
					Remove Credit
				</kv-button>
			</div>
		</template>
	</kv-lightbox>
</template>

<script>
import removeCreditByType from '@/graphql/mutation/shopRemoveCreditByType.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		KvLightbox,
	},
	props: {
		activeCreditType: {
			type: String,
			default: '',
		},
		appliedPromoTotal: {
			type: String,
			default: ''
		},
		promoFundDisplayName: {
			type: String,
			default: ''
		},
		visible: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		removePromoCredit() {
			if (this.activeCreditType) {
				this.removeCredit(this.activeCreditType);
			}
			this.closeLightbox();
		},
		removeCredit(type) {
			// TODO: Setup removing "promo_credit" type
			this.setUpdating(true);
			this.apollo.mutate({
				mutation: removeCreditByType,
				variables: {
					creditType: type
				}
			}).then(() => {
				this.setUpdating(false);
				this.$kvTrackEvent('basket', 'Kiva Credit', 'Remove Credit Success');
				this.$emit('credit-removed');
			}).catch(error => {
				console.error(error);
				this.setUpdating(false);
			});
		},
		setUpdating(state) {
			this.$emit('updating-totals', state);
		},
		closeLightbox() {
			this.$emit('lightbox-closed');
		}
	}
};
</script>

<style lang="scss" scoped>
	.content {
		max-width: 30rem;
	}

	.controls {
		display: flex;
		justify-content: flex-end;
	}

	.controls__cancel-btn {
		margin-right: 0.5rem;
	}
</style>
