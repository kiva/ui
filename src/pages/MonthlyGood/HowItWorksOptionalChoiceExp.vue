<template>
	<kv-theme-provider :theme="darkGreenTheme">
		<div
			class="how-works-section-wrapper
			tw-bg-primary
			tw-py-4 md:tw-py-6 lg:tw-py-8"
			id="how-it-works"
		>
			<div class="row">
				<h1 class="column small-12 tw-text-center tw-mb-4">
					How Monthly Good works
				</h1>
				<div class="small-12 large-4 column tw-mb-4 tw-text-center">
					<icon-auto-deposit-alternate class="mg-image tw-text-brand-700" />
					<h3 class="tw-mb-2">
						Start supporting
					</h3>
					<p class="tw-mb-2">
						Subscribe by choosing a monthly amount and category. You can change these or cancel any time.
					</p>
				</div>
				<div class="small-12 large-4 column tw-mb-4 tw-text-center">
					<icon-lend class="mg-image tw-text-brand" />
					<h3 class="tw-mb-2">
						Pick a borrower or let us do it.
					</h3>
					<p class="tw-mb-2">
						Pick from three recommended borrowers this month or let us make a loan for you.
					</p>
				</div>
				<div class="small-12 large-4 column tw-mb-4 tw-text-center">
					<icon-updates-alternate class="mg-image tw-text-brand-700" />
					<h3 class="tw-mb-2">
						Stay updated
					</h3>
					<p class="tw-mb-2">
						Get monthly updates about your loans and borrowers on Kiva.
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
import { darkGreenTheme } from '~/@kiva/kv-tokens/configs/kivaColors.cjs';

import KvThemeProvider from '~/@kiva/kv-components/vue/KvThemeProvider';

export default {
	components: {
		IconAutoDepositAlternate,
		IconLend,
		IconUpdatesAlternate,
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
