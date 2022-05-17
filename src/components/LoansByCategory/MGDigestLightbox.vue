<template>
	<kv-lightbox
		:visible="isLightboxVisible"
		title=""
		@lightbox-closed="closeLightbox"
	>
		<h2 class="tw-text-h2 tw-text-center">
			Thank you for the feedback!
		</h2>
		<div class="tw-text-center tw-flex tw-flex-col tw-gap-3 tw-my-8 tw-w-full">
			<!-- eslint-disable-next-line max-len -->
			<p class="LightboxText">
				We'll continue to do our best to pick the loans you'll love.
			</p>
			<div class="tw-flex tw-flex-col tw-gap-2 tw-self-center tw-w-full LightboxButtons">
				<kv-button
					@click="redirectExploreLoans"
					v-kv-track-event="[
						'Lending',
						'click-personalized-MG-feedback-CTA',
						'Explore Loans'
					]"
				>
					Explore Loans
				</kv-button>
				<kv-button
					variant="secondary"
					@click="redirectPortfolio"
					v-kv-track-event="[
						'Lending',
						'click-personalized-MG-feedback-CTA',
						'Continue to portfolio'
					]"
				>
					Continue to portfolio
				</kv-button>
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	components: {
		KvButton,
		KvLightbox,
	},
	data() {
		return {
			isLightboxVisible: true,
		};
	},
	methods: {
		closeLightbox() {
			this.isLightboxVisible = false;
			this.$kvTrackEvent('Lending', 'close-personalized-MG-feedback', 'Close');
		},
		redirectExploreLoans() {
			this.$router.push({
				path: '/lend-by-category',
			});
		},
		redirectPortfolio() {
			this.$router.push({
				path: '/portfolio',
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

@media (min-width: 1024px) {
	.LightboxText {
		min-width: 800px;
	}
	.LightboxButtons {
		max-width: 342px;
	}
}

@media (max-width: 480px) {
	::v-deep #kvLightboxBody {
		min-height: 750px;
	}
}
</style>
