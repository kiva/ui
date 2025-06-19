<template>
	<div v-if="!oading">
		<div class="tw-px-4 tw-py-2">
			<SideSheetHeader />
			<SideSheetLoanTags />
			<LoanProgress
				:loan-status="inPfp ? 'pfp' : 'fundraising'"
				:money-left="unreservedAmount"
				:number-of-lenders="numLenders"
				:pfp-min-lenders="pfpMinLenders"
				:progress-percent="fundraisingPercent"
				:time-left="timeLeft"
				class="tw-mb-2 tw-mt-1.5"
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
			<DetailsTabs :name="loan?.name" />
		</div>
		<div class="cta-container">
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
				:max-amount="maxAmount"
				:unreserved-amount="unreservedAmount"
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
import useBorrowerProfileData from '#src/composables/useBorrowerProfileData';

import { KvLendCta } from '@kiva/kv-components';

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
		}
	},
	setup(props, { emit }) {
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
		const timeLeft = computed(() => borrowerProfile.timeLeft.value ?? '');
		const unreservedAmount = computed(() => borrowerProfile.unreservedAmount.value ?? undefined);
		const userBalance = computed(() => borrowerProfile?.userBalance?.value);
		const fundraisingPercent = computed(() => {
			if (borrowerProfile.unreservedAmount.value === '0') return '0';
			return borrowerProfile.fundraisingPercent.value ?? undefined;
		});

		const addToBasket = payload => {
			emit('add-to-basket', payload);
		};

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
			addToBasket,
			fundraisingPercent,
			inPfp,
			loan,
			numLenders,
			pfpMinLenders,
			timeLeft,
			unreservedAmount,
			userBalance,
		};
	}
};
</script>

<style lang="postcss" scoped>
.cta-container {
	box-shadow: 2px 0px 12px 0px #0000004D;
	margin-left: -15px;
	margin-right: -15px;

	@apply tw-sticky tw-bottom-0 tw-bg-white tw-py-1.5 lg:tw-py-2 tw-px-2.5 lg:tw-px-3;
}

:deep(.cta-container > div) {
	@apply tw-whitespace-normal;
}
</style>
