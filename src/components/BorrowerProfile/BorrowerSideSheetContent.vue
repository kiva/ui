<template>
	<section class="tw-bg-secondary md:tw-bg-secondary" style="margin: -16px">
		<div v-if="loan" class="tw-flex tw-flex-col">
			<div class="tw-px-4 tw-py-2">
				<SideSheetHeader />
				<SideSheetLoanTags />
				<LoanProgress
					:loan-status="inPfp ? 'pfp' : 'fundraising'" :money-left="unreservedAmount"
					:number-of-lenders="numLenders" :pfp-min-lenders="pfpMinLenders"
					:progress-percent="fundraisingPercent" :time-left="timeLeft" class="tw-mb-2 tw-mt-1.5"
					data-testid="bp-summary-progress"
				/>
				<SideSheetLoanHowMoneyHelps />
				<SideSheetLoanStory />
			</div>
			<div class="tw-bg-white tw-px-4">
				<CommentsAndWhySpecial :loan-id="loanId" />
			</div>
			<div class="tw-px-4 tw-py-2 tw-space-y-6">
				<MoreAboutLoan :loan-id="loanId" />
				<BorrowerCountry :loan-id="loanId" />
				<LendersAndTeams :loan-id="loanId" />
				<LendersAndTeams :loan-id="loanId" display-type="teams" />
				<DetailsTabs :name="loan.name" />
			</div>
		</div>
	</section>
</template>

<script>
import {
	computed,
	inject,
	onBeforeUnmount,
	onMounted,
	provide
} from 'vue';
import useBorrowerProfileData from '#src/composables/useBorrowerProfileData';

import CommentsAndWhySpecial from './CommentsAndWhySpecial';
import BorrowerCountry from './BorrowerCountry';
import DetailsTabs from './DetailsTabs';
import LendersAndTeams from './LendersAndTeams';
import LoanProgress from './LoanProgress';
import MoreAboutLoan from './MoreAboutLoan';
import SideSheetHeader from './SideSheetHeader';
import SideSheetLoanHowMoneyHelps from './SideSheetLoanHowMoneyHelps';
import SideSheetLoanStory from './SideSheetLoanStory';
import SideSheetLoanTags from './SideSheetLoanTags';

export default {
	name: 'BorrowerSideSheetContent',
	components: {
		CommentsAndWhySpecial,
		BorrowerCountry,
		DetailsTabs,
		LendersAndTeams,
		LoanProgress,
		MoreAboutLoan,
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
	setup(props) {
		const apollo = inject('apollo');
		const cookieStore = inject('cookieStore');
		if (!apollo || !cookieStore) {
			console.error('Apollo or cookieStore is undefined in setup');
			return {};
		}
		const borrowerProfile = useBorrowerProfileData(apollo, cookieStore);
		// Provide borrower profile data to child components
		provide('borrowerProfile', borrowerProfile);
		const inPfp = computed(() => borrowerProfile.inPfp.value);
		const loan = computed(() => borrowerProfile.loan.value);
		const numLenders = computed(() => (borrowerProfile.lenders.value?.totalCount ?? undefined));
		const pfpMinLenders = computed(() => borrowerProfile.pfpMinLenders.value);
		const timeLeft = computed(() => (borrowerProfile.timeLeft.value ?? ''));
		const unreservedAmount = computed(() => borrowerProfile.unreservedAmount.value ?? undefined);
		const fundraisingPercent = computed(() => {
			if (borrowerProfile.unreservedAmount.value === '0') return '0';
			return borrowerProfile.fundraisingPercent.value ?? undefined;
		});
		onMounted(() => {
			try {
				borrowerProfile.loadBPData(props.loanId);
			} catch (e) {
				console.error('Error in loadBPData:', e);
			}
		});
		onBeforeUnmount(() => {
			borrowerProfile.clearBPData();
		});
		return {
			fundraisingPercent,
			inPfp,
			loan,
			numLenders,
			pfpMinLenders,
			timeLeft,
			unreservedAmount,
		};
	}
};
</script>
