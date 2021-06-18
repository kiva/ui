<template>
	<www-page
		id="borrower-profile"
		:header-theme="headerTheme"
	>
		<div class="tw-relative tw-overflow-hidden md:tw-py-6 lg:tw-py-8 tw-bg-gray-50">
			<hero-background class="tw-absolute tw-top-0" />
			<kv-page-container class="tw-relative tw-mb-12">
				<kv-grid class="tw-grid-cols-12 tw-gap-x-2">
					<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-7">
						<summary-card />
					</div>
					<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-5">
						<lend-cta :loan-id="loanId" />
					</div>
				</kv-grid>
			</kv-page-container>
			<kv-page-container>
				<kv-grid class="tw-grid-cols-12 tw-gap-x-2">
					<div class="tw-col-span-12 md:tw-col-start-2 md:tw-col-span-10 lg:tw-col-span-7">
						<loan-story :loan-id="loanId" />
					</div>
				</kv-grid>
			</kv-page-container>
		</div>
	</www-page>
</template>

<script>
import { lightHeader } from '@/util/siteThemes';

import WwwPage from '@/components/WwwFrame/WwwPage';
import HeroBackground from '@/components/BorrowerProfile/HeroBackground';
import SummaryCard from '@/components/BorrowerProfile/SummaryCard';
import LendCta from '@/components/BorrowerProfile/LendCta';
import LoanStory from '@/components/BorrowerProfile/LoanStory';

import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		HeroBackground,
		KvGrid,
		KvPageContainer,
		LendCta,
		LoanStory,
		SummaryCard,
		WwwPage,
	},
	data() {
		return {
			headerTheme: lightHeader,
			loanId: Number(this.$route.params.id || 0),
		};
	},
};
</script>
