<template>
	<kv-lightbox
		@lightbox-closed="closeLightbox"
		:visible="visible"
		title="You are leaving the promotion"
		style="z-index: 1199 !important;"
	>
		<div class="content" style="max-width: 30rem;">
			<p class="tw-mb-4">
				<strong>WARNING:</strong> If you proceed, your {{ appliedPromoTotal }} credit from
				the {{ promoFundDisplayName }} promotion will be removed, and you will have to lend
				using your own money.
			</p>
			<p>Click "Cancel" to use your free loan, or click "Remove Credit" to pay using your own money.</p>
		</div>
		<template #controls>
			<kv-button
				variant="secondary"
				v-kv-track-event="['promoCampaign', 'Cancel Promo Opt-out Button']"
				@click="closeLightbox"
				data-testid="remove-promo-cancel-opt-out"
			>
				Cancel
			</kv-button>
			<kv-button
				v-kv-track-event="['promoCampaign', 'Promo Opt-out Button']"
				@click="removePromoCredit"
				data-testid="remove-promo-credit-confirmation"
			>
				Remove Credit
			</kv-button>
		</template>
	</kv-lightbox>
</template>

<script>
import { removeCredit } from '#src/util/checkoutUtils';
import logFormatter from '#src/util/logFormatter';
import { KvButton, KvLightbox } from '@kiva/kv-components';

export default {
	name: 'VerifyRemovePromoCredit',
	inject: ['apollo'],
	components: {
		KvButton,
		KvLightbox,
	},
	emits: ['credit-removed', 'promo-opt-out-lightbox-closed', 'updating-totals'],
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
			this.$emit('promo-opt-out-lightbox-closed');
		}
	}
};
</script>
