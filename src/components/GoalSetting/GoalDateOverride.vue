<template>
	<div
		v-if="isMounted && goalDateOverride"
		class="tw-fixed tw-bottom-1 tw-left-1 tw-z-modal tw-rounded tw-bg-caution tw-px-1.5 tw-py-0.5
			tw-text-small tw-text-primary tw-shadow"
		role="status"
		data-testid="goal-date-override-badge"
	>
		Goal date: {{ formattedDate }} ·
		<a
			:href="clearHref"
			class="tw-text-primary tw-underline"
			data-testid="goal-date-override-clear"
		>Clear</a>
	</div>
</template>

<script setup>
import {
	computed, onMounted, ref, watch,
} from 'vue';
import useGoalNow from '#src/composables/useGoalNow';
import { formatGoalDate } from '#src/util/goalDate';

// Keeps a ?goalDate QA override for the browser session and shows the tester it is on.
// Example: /mykiva?goalDate=2027-01-05 (YYYY-MM-DD) runs goal features as if it were January 5, 2027.
const { goalDateOverride, routeQuery, saveGoalDate } = useGoalNow();
const formattedDate = computed(() => (goalDateOverride.value ? formatGoalDate(goalDateOverride.value) : ''));

// Browser only: CDN-cached server renders have no cookie store, so the badge would not match.
const isMounted = ref(false);

// This page with ?goalDate=off. A full load, so everything set up for the override date starts over.
const clearHref = computed(() => {
	if (!isMounted.value) return '';
	const params = new URLSearchParams();
	Object.entries(routeQuery.value).forEach(([key, value]) => {
		[].concat(value ?? '').forEach(item => params.append(key, item ?? ''));
	});
	params.set('goalDate', 'off');
	return `${window.location.pathname}?${params}`;
});

onMounted(() => {
	isMounted.value = true;
	watch(routeQuery, saveGoalDate, { immediate: true });
});
</script>
