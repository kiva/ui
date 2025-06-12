<template>
	<section class="tw-bg-secondary md:tw-bg-secondary" style="margin: -16px">
		<div class="tw-flex tw-flex-col tw-px-4 tw-py-2">
			<SideSheetHeader />
			<SideSheetLoanTags :loan-id="bpLoanId" />
			<LoanProgress
				class="tw-mb-2 tw-mt-1.5"
				data-testid="bp-summary-progress"
				:money-left="unreservedAmount"
				:progress-percent="fundraisingPercent"
				:time-left="timeLeft"
				:loan-status="inPfp ? 'pfp' : 'fundraising'"
				:number-of-lenders="numLenders"
				:pfp-min-lenders="pfpMinLenders"
			/>
			<SideSheetLoanHowMoneyHelps />
			<SideSheetLoanStory />
			<CommentsAndWhySpecial />
			<MoreAboutLoan :loan-id="bpLoanId" />
			<SideSheetCountry />
			<LendersAndTeams :loan-id="bpLoanId" />
			<LendersAndTeams :loan-id="bpLoanId" :is-lender="false" />
			<DetailsTabs :name="name" />
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
		// Initialize the composable with the injected apollo client
		console.log('this.apollo', this.apollo);
		const borrowerProfile = useBorrowerProfileData(this.apollo);
		return {
			borrowerProfile
		};
	},
	computed: {
		bpLoanId() {
			return this.borrowerProfile?.loan?.id;
		},
		inPfp() {
			return this.borrowerProfile?.loan?.inPfp ?? false;
		},
		pfpMinLenders() {
			return this.borrowerProfile?.loan?.pfpMinLenders ?? 0;
		},
		numLenders() {
			return this.borrowerProfile?.loan?.lenders?.totalCount ?? 0;
		},
		fundraisingPercent() {
			if (this.unreservedAmount === '0') return '0';
			return this.borrowerProfile?.loan?.fundraisingPercent ?? 0;
		},
		timeLeft() {
			return this.borrowerProfile?.loan?.fundraisingTimeLeft ?? '';
		},
		unreservedAmount() {
			return this.borrowerProfile?.loan?.unreservedAmount ?? '0';
		},
		name() {
			return this.borrowerProfile?.loan?.name;
		}
	},
	async mounted() {
		try {
			this.borrowerProfile.loadBPData(this.loanId);
		} catch (e) {
			console.error('Error:', e);
		}
	},
	beforeUnmount() {
		this.borrowerProfile.clearBPData();
	}
};
</script>
