<template>
	<kv-theme-provider :theme="darkGreenTheme">
		<div
			class="how-works-section-wrapper
			tw-bg-primary
			tw-py-2 md:tw-pt-6 md:tw-pb-5 lg:tw-py-7"
			id="how-it-works"
		>
			<div class="row">
				<h1 class="column small-12 tw-text-center tw-mb-4 tw-text-h2">
					How it works
				</h1>
				<div class="small-12 large-4 column tw-mb-4 tw-text-center">
					<icon-borrower-search class="mg-image tw-text-brand-700" />
					<h3 class="tw-mb-2 tw-text-h3">
						Subscribe & support
					</h3>
					<p class="tw-mb-2 tw-text-base">
						You decide who you want to support. Pick a category and we make sure 100%
						of your funds make it to them.
					</p>
				</div>
				<div class="small-12 large-4 column tw-mb-4 tw-text-center">
					<icon-megaphone class="mg-image tw-text-brand" />
					<h3 class="tw-mb-2 tw-text-h3">
						Stay up to date
					</h3>
					<p class="tw-mb-2 tw-text-base">
						<!-- eslint-disable-next-line max-len -->
						Every month, hear from your borrowers. Discover their stories and many others around the world.
					</p>
				</div>
				<div class="small-12 large-4 column md:tw-mb-4 tw-text-center">
					<icon-relend class="mg-image tw-text-brand-700" />
					<h3 class="tw-mb-2 tw-text-h3">
						Multiply your impact
					</h3>
					<p class="tw-mb-2 tw-text-base">
						<!-- eslint-disable-next-line max-len -->
						It's a loan, not a donation! Contributions and repayments let you help more people, month after month.
					</p>
				</div>
			</div>
		</div>
	</kv-theme-provider>
</template>

<script>
import IconBorrowerSearch from '@/assets/icons/inline/borrower_search.svg';
import IconMegaphone from '@/assets/icons/inline/megaphone.svg';
import IconRelend from '@/assets/icons/inline/relend.svg';
import { darkGreenTheme } from '~/@kiva/kv-tokens/configs/kivaColors.cjs';

import KvThemeProvider from '~/@kiva/kv-components/vue/KvThemeProvider';

export default {
	name: 'HowItWorks',
	components: {
		IconBorrowerSearch,
		IconMegaphone,
		IconRelend,
		KvThemeProvider,
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

</style>
