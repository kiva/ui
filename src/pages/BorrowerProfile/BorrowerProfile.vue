<template>
	<www-page
		id="borrower-profile"
		:header-theme="headerTheme"
		:main-class="'tw-bg-gray-50'"
	>
		<article class="tw-relative">
			<div class="tw-relative" style="max-height: 460px;">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
					<hero-background />
				</div>
				<content-container class="md:tw-pt-6 lg:tw-pt-8">
					<summary-card class="tw-relative lg:tw--mb-1.5" />
				</content-container>
			</div>
			<div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8">
				<sidebar-container class="lg:tw-sticky lg:tw-top-12 lg:tw-mt-10 lg:tw-pb-8">
					<lend-cta :loan-id="loanId" />
				</sidebar-container>
			</div>
			<content-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-12">
				<loan-story :loan-id="loanId" />
			</content-container>
		</article>
		<!-- <aside>Similar loans</aside> -->
	</www-page>
</template>

<script>
import { lightHeader } from '@/util/siteThemes';

import WwwPage from '@/components/WwwFrame/WwwPage';
import ContentContainer from '@/components/BorrowerProfile/ContentContainer';
import SidebarContainer from '@/components/BorrowerProfile/SidebarContainer';
import HeroBackground from '@/components/BorrowerProfile/HeroBackground';
import SummaryCard from '@/components/BorrowerProfile/SummaryCard';
import LendCta from '@/components/BorrowerProfile/LendCta';
import LoanStory from '@/components/BorrowerProfile/LoanStory';

export default {
	components: {
		ContentContainer,
		HeroBackground,
		LendCta,
		LoanStory,
		SidebarContainer,
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
