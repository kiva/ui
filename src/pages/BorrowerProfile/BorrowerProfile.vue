<template>
	<www-page
		id="borrower-profile"
		:header-theme="headerTheme"
	>
		<article class="tw-relative tw-bg-secondary">
			<div class="tw-relative">
				<div class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-overflow-hidden">
					<hero-background />
				</div>
				<content-container class="md:tw-pt-6 lg:tw-pt-8">
					<summary-card class="tw-relative lg:tw--mb-1.5 tw-z-1" />
				</content-container>
			</div>
			<div class="lg:tw-absolute lg:tw-w-full lg:tw-h-full lg:tw-top-0 lg:tw-pt-8 tw-pointer-events-none">
				<sidebar-container class="lg:tw-sticky lg:tw-top-12 lg:tw-mt-10 lg:tw-pb-8">
					<lend-cta class="tw-pointer-events-auto" :loan-id="loanId" />
				</sidebar-container>
			</div>
			<content-container class="tw-mt-4 md:tw-mt-6 lg:tw-mt-8">
				<loan-story id="loanStory" class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8" :loan-id="loanId" />
			</content-container>
			<div class="tw-bg-primary tw-mb-5 md:tw-mb-6 lg:tw-mb-8">
				<content-container>
					<why-special :loan-id="loanId" />
				</content-container>
			</div>
			<content-container>
				<more-about-loan class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8" :loan-id="loanId" />
				<borrower-country class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8" :loan-id="loanId" />
				<lenders-and-teams
					v-if="showLenders"
					key="lenders"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
					:loan-id="loanId"
					display-type="lenders"
					@hide-section="showLenders = false"
				/>
				<lenders-and-teams
					v-if="showTeams"
					key="teams"
					class="tw-mb-5 md:tw-mb-6 lg:tw-mb-8"
					:loan-id="loanId"
					display-type="teams"
					@hide-section="showTeams = false"
				/>
			</content-container>
			<div class="tw-bg-primary">
				<content-container>
					<details-tabs id="loanDetails" :loan-id="loanId" name="bp-details" />
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
	inject: ['cookieStore'],
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
			showLenders: true,
			showTeams: true,
		};
	},
	mounted() {
		// EXP-GROW-655-Aug2021
		// This is cookie is set during the redirect and signifies the exp is active when landing on this page
		const expCookieSignifier = this.cookieStore.get('kvlendborrowerbeta');
		if (expCookieSignifier === 'b') {
			this.$kvTrackEvent('Borrower Profile', 'EXP-GROW-655-Aug2021', expCookieSignifier);
		}
	}
};
</script>
