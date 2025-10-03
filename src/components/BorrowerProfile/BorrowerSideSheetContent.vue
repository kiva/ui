<template>
	<div class="tw--mx-2 tw-bg-secondary">
		<div class="tw-px-4 tw-py-2">
			<SideSheetHeader />
			<SideSheetLoanTags
				:enable-ai-loan-pills="enableAiLoanPills"
			/>
			<LoanProgress
				:loading="loading"
				:loan-status="loanStatus"
				:money-left="unreservedAmount"
				:number-of-lenders="numLenders"
				:pfp-min-lenders="pfpMinLenders"
				:progress-percent="fundraisingPercent"
				:time-left="timeLeft"
				:loan-id="loanId"
				class="tw-mt-2 tw-mb-3"
				:class="{ '!tw-mb-1.5': showNextSteps }"
				data-testid="bp-summary-progress"
			/>
			<LoanNextSteps
				v-if="!loading && showNextSteps"
				class="tw-py-2 tw-mb-1"
				:loan-id="loanId"
				:weeks-to-repay="weeksToRepay"
				:current-step="currentStep"
				:repayments-started="!isFundraising"
				no-animation
			/>
			<SideSheetLoanHowMoneyHelps />
			<SideSheetLoanStory />
		</div>
		<div class="tw-bg-primary tw-px-4">
			<CommentsAndWhySpecial :loan-id="loanId" />
		</div>
		<div class="tw-px-4 tw-py-2 tw-space-y-6">
			<MoreAboutLoan :loan-id="loanId" />
			<BorrowerCountry :loan-id="loanId" />
			<LendersAndTeams v-if="!!lenderCount" :loan-id="loanId" />
			<LendersAndTeams v-if="!!teamCount" :loan-id="loanId" display-type="teams" />
		</div>
		<div v-if="loanId && loan?.name" class="tw-bg-white tw-px-4">
			<DetailsTabs :loan-id="loanId" :name="loan.name" />
		</div>
		<div v-if="!loading" class="cta-container">
			<KvLendCta
				:loan="loan"
				:is-loading="false"
				:kv-track-function="$kvTrackEvent"
				:get-cookie="cookieStore?.get"
				:set-cookie="cookieStore?.set"
				:user-balance="userBalance"
				:basket-items="basketItems"
				:route="currentRoute"
				:is-adding="isAdding"
				:show-preset-amounts="true"
				:kv-track-category="'borrower-profile'"
				:external-links="true"
				:unreserved-amount="unreservedAmount"
				:is-visitor="isGuest"
				@add-to-basket="addToBasket"
			/>
		</div>
	</div>
</template>

<script>
import {
	computed,
	inject,
	onBeforeUnmount,
	onMounted,
	provide
} from 'vue';
import { useRouter } from 'vue-router';
import { KvLendCta } from '@kiva/kv-components';
import useBorrowerProfileData from '#src/composables/useBorrowerProfileData';
import logFormatter from '#src/util/logFormatter';

import { addMonths, differenceInWeeks } from 'date-fns';
import { FUNDRAISING } from '#src/api/fixtures/LoanStatusEnum';
import LoanNextSteps from '#src/components/Thanks/LoanNextSteps';
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
		BorrowerCountry,
		CommentsAndWhySpecial,
		DetailsTabs,
		KvLendCta,
		LendersAndTeams,
		LoanProgress,
		MoreAboutLoan,
		SideSheetHeader,
		SideSheetLoanHowMoneyHelps,
		SideSheetLoanStory,
		SideSheetLoanTags,
		LoanNextSteps,
	},
	emits: ['add-to-basket'],
	inject: ['$kvTrackEvent'],
	props: {
		loanId: {
			type: Number,
			required: true
		},
		isAdding: {
			type: Boolean,
			required: true
		},
		basketItems: {
			type: Array,
			default: () => []
		},
		showNextSteps: {
			type: Boolean,
			default: false
		},
		enableAiLoanPills: {
			type: Boolean,
			default: false
		},
	},
	setup(props, { emit }) {
		const apollo = inject('apollo');
		const cookieStore = inject('cookieStore');
		if (!apollo || !cookieStore) {
			logFormatter('Apollo or cookieStore is undefined in setup', 'error');
			return {};
		}

		const currentRoute = useRouter().currentRoute.value;

		const borrowerProfile = useBorrowerProfileData(apollo, cookieStore);
		// Provide borrower profile data to child components
		provide('borrowerProfile', borrowerProfile);

		const inPfp = computed(() => borrowerProfile.inPfp.value);
		const loan = computed(() => borrowerProfile.loan.value);
		const numLenders = computed(() => (borrowerProfile.lenders.value?.totalCount ?? undefined));
		const pfpMinLenders = computed(() => borrowerProfile.pfpMinLenders.value);
		const timeLeft = computed(() => borrowerProfile.timeLeft.value ?? '');
		const unreservedAmount = computed(() => borrowerProfile.unreservedAmount.value ?? undefined);
		const userBalance = computed(() => borrowerProfile?.userBalance?.value);
		const teamCount = computed(() => borrowerProfile?.teamCount?.value);
		const lenderCount = computed(() => borrowerProfile?.lenderCount?.value);
		const loading = computed(() => borrowerProfile?.loading?.value);
		const isGuest = computed(() => borrowerProfile?.isGuest?.value);
		const isFundraising = computed(() => loan.value?.status === FUNDRAISING);
		const currentStep = computed(() => {
			if (isFundraising.value) return 1;
			return 4;
		});
		const fundraisingPercent = computed(() => {
			if (borrowerProfile.unreservedAmount.value === '0') return '0';
			return borrowerProfile.fundraisingPercent.value ?? undefined;
		});

		const addToBasket = payload => {
			emit('add-to-basket', payload);
		};

		const weeksToRepay = computed(() => {
			const today = new Date();
			const date = loan.value?.terms?.expectedPayments
				?.find(payment => differenceInWeeks(Date.parse(payment?.dueToKivaDate), today) > 0)
				?.dueToKivaDate ?? null;
			if (date) {
				// Get the number of weeks between the first repayment date (in the future) and now
				return `${differenceInWeeks(Date.parse(date), today)} weeks`;
			}
			// Calculating a possible range of weeks between the planned expiration date and a month after
			const expDate = Date.parse(loan.value?.plannedExpirationDate);
			const minDate = differenceInWeeks(addMonths(today, 1), today);
			const maxDate = differenceInWeeks(addMonths(expDate, 1), today);
			if (minDate === maxDate || maxDate < 0) {
				return `${minDate} weeks`;
			}
			return `${minDate} - ${maxDate} weeks`;
		});

		const loanStatus = computed(() => {
			if (inPfp.value) return 'pfp';
			return !isFundraising.value ? 'funded' : 'fundraising';
		});

		onMounted(() => {
			try {
				borrowerProfile.loadBPData(props.loanId);
			} catch (e) {
				logFormatter(`Error in loadBPData: ${e}`, 'error');
			}
		});

		onBeforeUnmount(() => {
			borrowerProfile.clearBPData();
		});

		return {
			addToBasket,
			cookieStore,
			currentRoute,
			currentStep,
			fundraisingPercent,
			inPfp,
			isFundraising,
			isGuest,
			lenderCount,
			loading,
			loan,
			numLenders,
			pfpMinLenders,
			teamCount,
			timeLeft,
			unreservedAmount,
			userBalance,
			weeksToRepay,
			loanStatus,
		};
	}
};
</script>

<style lang="postcss" scoped>
.cta-container {
	box-shadow: 2px 0 12px 0 #0000004D;
	@apply tw-sticky tw-bottom-0 tw-bg-white tw-py-1.5 lg:tw-py-2 tw-px-2.5 lg:tw-px-3;
}

:deep(.cta-container > div) {
	@apply tw-whitespace-normal;
}
</style>
