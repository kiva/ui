<template>
	<kv-lightbox
		title="Matched lending"
		:visible="showLightbox"
		@lightbox-closed="closeLightbox"
	>
		<p class="tw-mb-2">
			<!-- eslint-disable-next-line max-len -->
			Matching loans with new deposits is the best way to responsibly use funds from matching partnerships in support of borrowers around the world.
		</p>
		<!-- eslint-disable-next-line max-len -->
		<p>Loan matching only applies when you deposit the full amount with Card, PayPal, Google Pay, or ApplePay. Loans made using Kiva Credit or Free Credit do not qualify.</p>
	</kv-lightbox>
</template>

<script>
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	name: 'MatchedLoansLightbox',
	components: {
		KvLightbox,
	},
	props: {
		showLightbox: {
			type: Boolean,
			required: true
		},
		closeLightbox: {
			type: Function,
			default: () => {}
		}
	},
	mounted() {
		this.$kvTrackEvent('Basket', 'view-must-deposit-message-cta', '');
	}
};
</script>
