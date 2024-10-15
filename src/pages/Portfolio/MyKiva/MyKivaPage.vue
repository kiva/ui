<template>
	<www-page main-class="tw-bg-secondary tw-overflow-hidden" class="tw-relative">
		<MyKivaNavigation
			:visible="showNavigation"
			:user-balance="userBalance"
			@navigation-closed="showNavigation = false"
		/>
		<MyKivaHero
			:user-info="userInfo"
			@show-navigation="handleShowNavigation"
		/>
		<MyKivaProfile
			:lender="lender"
			:is-loading="isLoading"
		/>
		<MyKivaContainer>
			<section class="tw-py-2">
				<div
					class="tw-w-full tw-text-center tw-border-t tw-border-eco-green-3 tw-my-3"
					style="line-height: 0;"
				>
					<span
						class="tw-bg-secondary tw-text-primary tw-px-1 tw-text-h4"
						style="line-height: 0; font-weight: 600;"
					>
						MY IMPACT
					</span>
				</div>
				<div
					:class="[
						'tw-flex',
						{ 'tw-flex-col': !showSingleArray },
						{ 'tw-flex-col lg:tw-flex-row lg:tw-gap-3': showSingleArray }
					]"
				>
					<MyKivaBorrowerCarousel
						:loans="loans"
						:is-loading="isLoading"
						@selected-loan="handleSelectedLoan"
					/>
					<JournalUpdatesCarousel
						:loan="activeLoan"
						:updates="loanUpdates"
						:lender="lender"
					/>
				</div>
			</section>
			<section class="tw-py-2">
				<div
					class="tw-w-full tw-text-center tw-border-t tw-border-eco-green-3 tw-my-3"
					style="line-height: 0;"
				>
					<span
						class="tw-bg-secondary tw-text-primary tw-px-1 tw-text-h4"
						style="line-height: 0; font-weight: 600;"
					>
						BADGES AND ACHIEVEMENTS
					</span>
				</div>
				<div>
					<button
						@click="showBadgeModal = true"
					>
						Show Modal
					</button>

					<BadgeModal
						:show-lightbox="showBadgeModal"
						@badge-modal-closed="showBadgeModal = false"
					/>
				</div>
			</section>
		</MyKivaContainer>
	</www-page>
</template>

<script setup>
import logReadQueryError from '#src/util/logReadQueryError';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaNavigation from '#src/components/MyKiva/MyKivaNavigation';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import updatesQuery from '#src/graphql/query/loanUpdates.graphql';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import MyKivaBorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel';
import BadgeModal from '#src/components/MyKiva/BadgeModal';

import {
	ref,
	computed,
	inject,
	onMounted,
} from 'vue';

const MY_KIVA_EXP_KEY = 'my_kiva_page';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');

const lender = ref(null);
const showNavigation = ref(false);
const userInfo = ref({});
const loans = ref([]);
const activeLoan = ref({});
const loanUpdates = ref([]);
const showBadgeModal = ref(false);

const isLoading = computed(() => !lender.value);

const userBalance = computed(() => userInfo.value?.userAccount?.balance ?? '');

const handleShowNavigation = () => {
	showNavigation.value = true;
	$kvTrackEvent('SecondaryNav top level', 'click', 'MyKiva-Settings-icon');
};

const fetchLoanUpdates = loanId => {
	apollo.query({ query: updatesQuery, variables: { loanId } })
		.then(result => {
			loanUpdates.value = result.data?.lend?.loan?.updates?.values ?? [];
		}).catch(e => {
			logReadQueryError(e, 'MyKivaPage updatesQuery');
		});
};

const showSingleArray = computed(() => loans.value.length === 1 && loanUpdates.value.length === 1);

const handleSelectedLoan = loan => {
	activeLoan.value = loan;
	fetchLoanUpdates(activeLoan.value.id);
};

apollo.query({ query: myKivaQuery })
	.then(result => {
		userInfo.value = result.data?.my ?? {};
		lender.value = result.data?.my?.lender ?? null;
		loans.value = result.data?.my?.loans?.values ?? [];
		if (loans.value.length > 0) {
			// eslint-disable-next-line prefer-destructuring
			activeLoan.value = loans.value[0];
			fetchLoanUpdates(activeLoan.value.id);
		}
	}).catch(e => {
		logReadQueryError(e, 'MyKivaPage myKivaQuery');
	});

onMounted(() => {
	trackExperimentVersion(
		apollo,
		$kvTrackEvent,
		'event-tracking',
		MY_KIVA_EXP_KEY,
		'EXP-MP-623-Sept2024'
	);

	$kvTrackEvent('portfolio', 'view', 'new-my-kiva');
});
</script>
