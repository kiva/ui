<template>
	<kv-lightbox
		title="Loan matching for new deposits"
		:visible="showLightbox"
		@lightbox-closed="closeLightbox"
	>
		<p class="tw-mb-2">
			<!-- eslint-disable-next-line max-len -->
			Matching loans made with new funds allows Kiva to make the most of our matching partnerships and is the best way to responsibly use these funds in support of borrowers around the world.
		</p>
		<!-- eslint-disable-next-line max-len -->
		<p>This dollar for dollar matching by {{ matchingText }} matches loans purchased in full with new funds Card, Paypal, Google Pay, or Apple Pay. Loans made using Kiva Credit or Free Credit do not qualify.</p>
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
		matchingText: {
			type: String,
			required: true,
		},
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
