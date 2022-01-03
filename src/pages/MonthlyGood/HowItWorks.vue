<template>
	<kv-theme-provider :theme="darkGreenTheme">
		<div
			class="how-works-section-wrapper
			tw-bg-primary
			tw-py-4 md:tw-py-6 lg:tw-py-8"
			:class="{'experiment':isExperimentActive}"
			id="how-it-works"
		>
			<div class="row">
				<h1 class="column small-12 tw-text-center tw-mb-4">
					How it works
				</h1>
				<div class="small-12 large-4 column tw-mb-4 tw-text-center">
					<icon-auto-deposit-alternate class="mg-image tw-text-brand-700" />
					<h3 class="tw-mb-2">
						Contribute automatically
					</h3>
					<p class="tw-mb-2">
						Sign up once by choosing a monthly amount that works for you. Cancel anytime.
					</p>
				</div>
				<div class="small-12 large-4 column tw-mb-4 tw-text-center">
					<icon-lend class="mg-image tw-text-brand" />
					<h3 class="tw-mb-2">
						Help entrepreneurs in need
					</h3>
					<p class="tw-mb-2">
						<!-- eslint-disable-next-line max-len -->
						Kiva will automatically lend 100% of your funds to borrowers who need help reaching their goals. This could be anyone on Kiva, from farmers to students, artisans to shopkeepers.
					</p>
				</div>
				<div class="small-12 large-4 column tw-mb-4 tw-text-center">
					<icon-updates-alternate class="mg-image tw-text-brand-700" />
					<h3 class="tw-mb-2">
						Receive inspiring stories
					</h3>
					<p class="tw-mb-2">
						We’ll send you an update once a month, including who you supported and why it mattered.
					</p>
				</div>
				<div class="small-12 column tw-text-center">
					<p class="learn-more-text tw-mb-2">
						<!-- eslint-disable-next-line max-len -->
						As you’re repaid, your funds will be automatically relent to borrowers in need, multiplying your impact
					</p>
				</div>
			</div>
		</div>
	</kv-theme-provider>
</template>

<script>
import IconAutoDepositAlternate from '@/assets/icons/inline/auto-deposit-alternate.svg';
import IconLend from '@/assets/icons/inline/lend.svg';
import IconUpdatesAlternate from '@/assets/icons/inline/updates-alternate.svg';
import { darkGreenTheme } from '~/@kiva/kv-tokens/configs/kivaColors';

import KvThemeProvider from '~/@kiva/kv-components/vue/KvThemeProvider';

export default {
	components: {
		IconAutoDepositAlternate,
		IconLend,
		IconUpdatesAlternate,
		KvThemeProvider,
	},
	props: {
		isExperimentActive: {
			type: Boolean
		}
	},
	data() {
		return { darkGreenTheme };
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.how-works-section-wrapper {
	.mg-image {
		fill: $white;
		width: 3.125rem;
		display: block;
		margin: 0 auto 1rem auto;
	}
}

.how-works-section-wrapper.experiment {
	@include breakpoint(medium) {
		padding-top: 12rem;
	}

	@include breakpoint(large) {
		padding-top: 6rem;
	}

	@include breakpoint(xlarge) {
		padding-top: 1rem;
	}
}
</style>
