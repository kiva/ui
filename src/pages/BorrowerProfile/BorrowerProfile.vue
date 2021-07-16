<template>
	<www-page
		id="borrower-profile"
		:header-theme="headerTheme"
		:main-class="'tw-bg-gray-50'"
	>
		<article class="tw-relative">
			<div class="tw-relative">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
					<hero-background />
				</div>
				<content-container class="md:tw-pt-6 lg:tw-pt-8">
					<summary-card class="tw-relative lg:tw--mb-1.5 tw-z-1" />
				</content-container>
			</div>
			<div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8">
				<sidebar-container class="lg:tw-sticky lg:tw-top-12 lg:tw-mt-10 lg:tw-pb-8">
					<lend-cta class="tw-z-2" :loan-id="loanId" />
				</sidebar-container>
			</div>
			<content-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-8">
				<loan-story class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8 tw-relative" :loan-id="loanId" />
			</content-container>
			<div class="tw-bg-brand-50 tw-mb-5 md:tw-mb-6 lg:tw-mb-8">
				<content-container>
					<why-special class="tw-relative" :loan-id="loanId" />
				</content-container>
			</div>
			<content-container>
				<more-about-loan class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8 tw-relative" :loan-id="loanId" />
				<borrower-country class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8 tw-relative" :loan-id="loanId" />
				<lenders-and-teams
					key="lenders"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8 tw-relative"
					:loan-id="loanId"
					display-type="lenders"
				/>
				<lenders-and-teams
					key="teams"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8 tw-relative"
					:loan-id="loanId"
					display-type="teams"
				/>
			</content-container>
			<div class="tw-bg-brand-50 tw-mb-5 md:tw-mb-6 lg:tw-mb-8">
				<content-container>
					<details-tabs class="tw-relative" :loan-id="loanId" name="bp-details" />
				</content-container>
			</div>
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
import DetailsTabs from '@/components/BorrowerProfile/DetailsTabs';
import BorrowerCountry from '@/components/BorrowerProfile/BorrowerCountry';
import LendersAndTeams from '@/components/BorrowerProfile/LendersAndTeams';
import MoreAboutLoan from '@/components/BorrowerProfile/MoreAboutLoan';
import WhySpecial from '@/components/BorrowerProfile/WhySpecial';

export default {
	components: {
		BorrowerCountry,
		ContentContainer,
		DetailsTabs,
		HeroBackground,
		LendCta,
		LendersAndTeams,
		LoanStory,
		MoreAboutLoan,
		SidebarContainer,
		SummaryCard,
		WhySpecial,
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
