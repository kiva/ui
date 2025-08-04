<template>
	<div class="www-page">
		<global-promo-contentful v-show="!isKivaAppReferral" />
		<the-new-header v-if="isNavUpdateExp" />
		<the-header
			v-else
			v-show="!isKivaAppReferral"
			:hide-search-in-header="hideSearchInHeader"
		/>
		<slot name="secondary" v-if="!isKivaAppReferral"></slot>

		<main :class="mainClasses">
			<slot name="tertiary"></slot>
			<slot></slot>
		</main>
		<the-footer	/>
		<the-basket-bar />
		<cookie-banner />
	</div>
</template>

<script setup>
import {
	ref, computed, inject, onMounted
} from 'vue';
import hasEverLoggedInQuery from '#src/graphql/query/shared/hasEverLoggedIn.graphql';
import { userHasEverLoggedInBefore } from '#src/util/optimizelyUserMetrics';
import logReadQueryError from '#src/util/logReadQueryError';
import experimentAssignmentQuery from '#src/graphql/query/experimentAssignment.graphql';

import CookieBanner from '#src/components/WwwFrame/CookieBanner';
import GlobalPromoContentful from './PromotionalBanner/GlobalPromotionalBannerContentful';
import TheNewHeader from './TheNewHeader';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';
import TheBasketBar from './TheBasketBar';

const NAV_UPDATE_EXP_KEY = 'kiva_nav_update';

const apollo = inject('apollo');
const route = inject('route'); // If using vue-router's provide/inject, otherwise use useRoute()
const grayBackground = ref(false);
const hideSearchInHeader = ref(false);
const mainClass = ref('');

const isKivaAppReferral = ref(route?.query?.kivaAppReferral === 'true');
const isNavUpdateExp = ref(false);

try {
	const cachedData = apollo.readQuery({
		query: experimentAssignmentQuery,
		variables: { id: NAV_UPDATE_EXP_KEY }
	});
	if (cachedData?.experiment) {
		isNavUpdateExp.value = cachedData.experiment.version === 'b';
	}
} catch (e) {
	// fallback: stick with default
}

onMounted(() => {
	try {
		const data = apollo.readQuery({
			query: hasEverLoggedInQuery,
		});
		userHasEverLoggedInBefore(data?.hasEverLoggedIn);
	} catch (e) {
		logReadQueryError(e, 'User has ever logged in');
	}
});

const mainClasses = computed(() => [
	mainClass.value,
	{ 'tw-bg-secondary': grayBackground.value },
]);
</script>

<style lang="scss">
@use '#src/assets/scss/settings' as *;

.www-page {
	display: flex;
	flex-flow: column nowrap;
	min-height: 100vh;

	@media print {
		display: block;
	}

	& > * {
		flex-shrink: 0; // Handle IE defaulting flex-shrink to 1
	}

	main {
		flex-grow: 1;
	}
}
</style>
