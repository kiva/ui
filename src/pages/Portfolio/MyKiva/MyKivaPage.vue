<template>
	<www-page main-class="tw-bg-secondary">
		<MyKivaNavigation
			:visible="showNavigation"
			:user-balance="userBalance"
			@navigation-closed="showNavigation = false"
		/>
		<MyKivaHero
			@show-navigation="handleShowNavigation"
		/>
		<MyKivaProfile :lender="lender" />
		<MyKivaBorrowerCarousel :loans="loans" @selected-loan="handleSelectedLoan" :is-loading="isLoading" />
	</www-page>
</template>

<script setup>
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaNavigation from '#src/components/MyKiva/MyKivaNavigation';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';
import MyKivaBorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';

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
const isLoading = computed(() => !lender.value);

const userBalance = computed(() => userInfo.value?.userAccount?.balance ?? '');

const handleShowNavigation = () => {
	showNavigation.value = true;
	$kvTrackEvent('SecondaryNav top level', 'click', 'MyKiva-Settings-icon');
};

const handleSelectedLoan = () => {
	// TODO: work with updates
};

apollo.query({ query: myKivaQuery })
	.then(result => {
		userInfo.value = result.data?.my ?? {};
		lender.value = result.data?.my?.lender ?? null;
		loans.value = result.data?.my?.loans?.values ?? [];
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
