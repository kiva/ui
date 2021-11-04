<template>
	<kv-lightbox
		@lightbox-closed="closeLightbox"
		:visible="visible"
		title="You are leaving the promotion"
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
			>
				Cancel
			</kv-button>
			<kv-button
				v-kv-track-event="['promoCampaign', 'Promo Opt-out Button']"
				@click="removePromoCredit"
			>
				Remove Credit
			</kv-button>
		</template>
	</kv-lightbox>
</template>

<script>
import { removeCredit } from '@/util/checkoutUtils';
import logFormatter from '@/util/logFormatter';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

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
