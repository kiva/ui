<template>
	<kv-lightbox
		@lightbox-closed="closeLightbox"
		:visible="visible"
		title="You are leaving the promotion"
		style="z-index: 1199 !important;"
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
import { removeCredit } from '@/util/checkoutUtils';
import logFormatter from '@/util/logFormatter';
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
			this.setUpdating(true);
			removeCredit(this.apollo, type)
				.then(() => {
					this.$kvTrackEvent('basket', 'Kiva Credit', 'Remove Credit Success');
					this.$emit('credit-removed');
				}).catch(error => {
					logFormatter(error, 'error');
				}).finally(() => {
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
