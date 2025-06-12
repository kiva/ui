<template>
	<section class="tw-bg-secondary md:tw-bg-secondary" style="margin: -16px">
		<div v-if="loan" class="tw-flex tw-flex-col tw-px-4 tw-py-2">
			<SideSheetHeader />
			<SideSheetLoanTags :loan-id="loan.id" />
			<LoanProgress
				class="tw-mb-2 tw-mt-1.5" data-testid="bp-summary-progress" :money-left="unreservedAmount"
				:progress-percent="fundraisingPercent" :time-left="timeLeft"
				:loan-status="inPfp ? 'pfp' : 'fundraising'" :number-of-lenders="numLenders"
				:pfp-min-lenders="pfpMinLenders"
			/>
			<SideSheetLoanHowMoneyHelps />
			<SideSheetLoanStory />
			<CommentsAndWhySpecial />
			<MoreAboutLoan :loan-id="loan.id" />
			<SideSheetCountry />
			<LendersAndTeams :loan-id="loan.id" />
			<LendersAndTeams :loan-id="loan.id" :is-lender="false" />
			<DetailsTabs :name="loan.name" />
		</div>
	</section>
</template>

<script>
import useBorrowerProfileData from '#src/composables/useBorrowerProfileData';

import CommentsAndWhySpecial from './CommentsAndWhySpecial';
import LendersAndTeams from './LendersAndTeams';
import LoanProgress from './LoanProgress';
import MoreAboutLoan from './MoreAboutLoan';
import SideSheetCountry from './SideSheetCountry';
import SideSheetHeader from './SideSheetHeader';
import SideSheetLoanHowMoneyHelps from './SideSheetLoanHowMoneyHelps';
import SideSheetLoanStory from './SideSheetLoanStory';
import SideSheetLoanTags from './SideSheetLoanTags';
import DetailsTabs from './DetailsTabs';

export default {
	name: 'BorrowerSideSheetContent',
	inject: ['apollo', 'cookieStore'],
	components: {
		CommentsAndWhySpecial,
		DetailsTabs,
		LendersAndTeams,
		LoanProgress,
		MoreAboutLoan,
		SideSheetCountry,
		SideSheetHeader,
		SideSheetLoanHowMoneyHelps,
		SideSheetLoanStory,
		SideSheetLoanTags,
	},
	props: {
		loanId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			borrowerProfile: null // Initialize as null, set in created
		};
	},
	created() {
		// Initialize composable after injections are available
		if (!this.apollo || !this.cookieStore) {
			console.error('Apollo or cookieStore is undefined in created hook');
			return;
		}
		try {
			this.borrowerProfile = useBorrowerProfileData(this.apollo, this.cookieStore);
			console.log('BorrowerProfile initialized:', this.borrowerProfile);
		} catch (e) {
			console.error('Error initializing useBorrowerProfileData:', e);
		}
	},
	computed: {
		loan() {
			return this.borrowerProfile?.loan ?? null;
		},
		inPfp() {
			return this.borrowerProfile?.inPfp ?? false;
		},
		pfpMinLenders() {
			return this.borrowerProfile?.pfpMinLenders ?? 0;
		},
		numLenders() {
			return this.borrowerProfile?.lenders?.totalCount ?? 0;
		},
		fundraisingPercent() {
			if (this.borrowerProfile?.unreservedAmount === '0') return '0';
			return this.borrowerProfile?.fundraisingPercent ?? 0;
		},
		timeLeft() {
			return this.borrowerProfile?.fundraisingTimeLeft ?? '';
		},
		unreservedAmount() {
			return this.borrowerProfile?.unreservedAmount ?? '0';
		}
	},
	mounted() {
		if (!this.borrowerProfile) {
			console.error('BorrowerProfile not initialized, skipping loadBPData');
			return;
		}
		try {
			console.log('Loading data for loanId:', this.loanId);
			this.borrowerProfile.loadBPData(this.loanId);
		} catch (e) {
			console.error('Error in loadBPData:', e);
		}
	},
	beforeUnmount() {
		if (this.borrowerProfile) this.borrowerProfile.clearBPData();
	}
};
</script>
