<template>
	<AsyncPortfolioSection
		@visible="fetchAsyncData"
	>
		<div
			v-if="isLoading"
			class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center tw-gap-2.5"
		>
			<KvLoadingPlaceholder class="loader" />
			<KvLoadingPlaceholder class="loader" />
			<KvLoadingPlaceholder class="loader" />
			<KvLoadingPlaceholder class="loader lg:tw-hidden" />
		</div>
		<BadgesSection
			v-else
			:badge-data="badgeData"
			@badge-clicked="handleBadgeSectionClicked"
		/>
		<BadgeModal
			v-if="selectedBadgeData"
			:show="showBadgeModal"
			:badge="selectedBadgeData"
			:lender="lender"
			:state="state"
			:tier="tier"
			:is-earned-section="false"
			:loans="loans"
			@badge-modal-closed="handleBadgeModalClosed"
			@badge-level-clicked="handleBadgeJourneyLevelClicked"
			@back-to-journey="handleBackToJourney"
		/>
	</AsyncPortfolioSection>
</template>

<script setup>
import {
	computed,
	inject,
	ref
} from 'vue';
import { gql } from 'graphql-tag';
import logReadQueryError from '#src/util/logReadQueryError';
import useBadgeData from '#src/composables/useBadgeData';
import { STATE_JOURNEY, STATE_EARNED, STATE_IN_PROGRESS } from '#src/composables/useBadgeModal';
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import BadgesSection from '#src/components/MyKiva/BadgesSection';
import BadgeModal from '#src/components/MyKiva/BadgeModal';
import AsyncPortfolioSection from './AsyncPortfolioSection';

// Query to gather user Teams
const userQuery = gql`query userQuery {
	my {
    id
    loans(limit: 50) {
        totalCount
        values {
            id
            name
            gender
            image {
                id
                url
                hash
            }
            geocode {
                city
                state
                country {
                    id
                    name
                    isoCode
                    region
                }
            }
            tags
            ... on LoanPartner {
                themes
            }
        }
    }
    lender {
        id
        name
        image {
            id
            url
        }
        memberSince
    }
  }
}`;

const apollo = inject('apollo');

const {
	fetchAchievementData,
	fetchContentfulData,
	badgeData,
} = useBadgeData(apollo);

const lender = ref(null);
const loans = ref([]);
const showBadgeModal = ref(false);
const selectedBadgeData = ref();
const state = ref(STATE_JOURNEY);
const tier = ref(null);

const isLoading = computed(() => badgeData.value.length === 0);

const handleBadgeSectionClicked = badge => {
	selectedBadgeData.value = badge;
	showBadgeModal.value = true;
};

const handleBadgeJourneyLevelClicked = payload => {
	const { tier: clickedTier } = payload;

	tier.value = clickedTier;
	state.value = clickedTier?.completedDate ? STATE_EARNED : STATE_IN_PROGRESS;
};

const handleBadgeModalClosed = () => {
	selectedBadgeData.value = undefined;
	showBadgeModal.value = false;
	state.value = STATE_JOURNEY;
};

const handleBackToJourney = () => {
	state.value = STATE_JOURNEY;
};

const fetchUserData = () => {
	return apollo.query({ query: userQuery })
		.then(result => {
			lender.value = result.data?.my?.lender ?? null;
			loans.value = result.data?.my?.loans?.values ?? [];
		}).catch(e => {
			logReadQueryError(e, 'Portfolio Page Journeys userQuery');
		});
};

const fetchAsyncData = () => {
	fetchUserData();
	fetchAchievementData(apollo);
	fetchContentfulData(apollo);
};
</script>

<style lang="postcss" scoped>
.loader {
    @apply  tw-rounded;

    width: 157px;
    height: 245px;

	@media (width >= 410px) {
		width: 175px;
	}

    @screen md {
        width: 220px;
    }
}
</style>
