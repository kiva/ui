<template>
	<kv-lightbox
		title="Loan matching for new deposits"
		:visible="isLightboxVisible"
		@lightbox-closed="closeLightbox"
	>
		<div>
			<!-- eslint-disable-next-line max-len -->
			Matching loans made with new funds allows Kiva to make the most of our matching partnerships and is the best way to responsibly use these funds in support of borrowers around the world.
			<!-- eslint-disable-next-line max-len -->
			This dollar for dollar matching by Milwaukee 7 / MUSIC matches loans purchased in full with new funds Card, Paypal, Google Pay, or Apple Pay. Loans made using Kiva Credit or Free Credit do not qualify.
		</div>
	</kv-lightbox>
</template>

<script>
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	name: 'MatchedLoansLightbox',
	components: {
		KvLightbox,
	},
	data() {
		return {
			isLightboxVisible: false,
		};
	},
	methods: {
		closeLightbox() {
			this.isLightboxVisible = false;
			this.$kvTrackEvent('Basket', 'close-must-deposit-message', 'Dismiss');
		},
	},
};
</script>
