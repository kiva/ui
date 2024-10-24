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
		</MyKivaContainer>
		<section class="tw-my-2">
			<MyKivaStats
				:user-achievements="userAchievements"
			/>
			<MyKivaContainer>
				<div class="tw-flex tw-flex-col tw-w-full lg:tw-hidden tw-mt-2">
					<router-link
						v-kv-track-event="['portfolio', 'click', 'countries-supported-details']"
						to="/portfolio/lending-stats"
						class="tw-text-action tw-mx-auto tw-mb-2 hover:tw-text-action tw-font-medium"
					>
						See all lending stats
					</router-link>
					<button
						class="tw-w-full tw-rounded tw-min-h-6 tw-border tw-font-medium tw-text-center tw-text-white
							tw-bg-action hover:tw-bg-secondary tw-border-tertiary hover:tw-border-primary"
						v-kv-track-event="['portfolio', 'click', 'find-a-loan']"
						@click="$router.push('/lend-by-category')"
						variant="secondary"
					>
						Make a loan
					</button>
				</div>
			</MyKivaContainer>
		</section>
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
						BADGES AND ACHIEVEMENTS
					</span>
				</div>
				<div class="tw-mt-3">
					<h3
						class="tw-text-center tw-mb-2"
					>
						My impact journeys
					</h3>
					<BadgesSection
						:badges-data="badgesData"
						:user-achievements="userAchievements"
						@badge-clicked="handleBadgeClicked"
					/>

					<BadgeModal
						v-if="selectedBadgeData"
						:show="showBadgeModal"
						:badge="selectedBadgeData"
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
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import MyKivaBorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel';
import BadgeModal from '#src/components/MyKiva/BadgeModal';
import BadgesSection from '#src/components/MyKiva/BadgesSection';
import MyKivaStats from '#src/components/MyKiva/MyKivaStats';

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
const selectedBadgeData = ref();
const userAchievements = ref([]);
const badgesData = ref([]);

const isLoading = computed(() => !lender.value);

const userBalance = computed(() => userInfo.value?.userAccount?.balance ?? '');

const handleShowNavigation = () => {
	showNavigation.value = true;
	$kvTrackEvent('SecondaryNav top level', 'click', 'MyKiva-Settings-icon');
};

const handleBadgeClicked = badge => {
	selectedBadgeData.value = badge;
	showBadgeModal.value = true;
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

const fetchUserAchievements = () => {
	apollo.query({ query: userAchievementProgressQuery })
		.then(result => {
			userAchievements.value = result.data?.userAchievementProgress?.tieredLendingAchievements ?? [];
		}).catch(e => {
			logReadQueryError(e, 'MyKivaPage userAchievementProgressQuery');
		});
};

const fetchBadgesData = () => {
	apollo.query({
		query: contentfulEntriesQuery,
		variables: {
			contentType: 'challenge',
			limit: 200,
		}
	})
		.then(result => {
			badgesData.value = result.data?.contentful?.entries?.items ?? [];
		}).catch(e => {
			logReadQueryError(e, 'MyKivaPage contentfulEntriesQuery');
		});
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

	fetchBadgesData();
	fetchUserAchievements();
});
</script>
