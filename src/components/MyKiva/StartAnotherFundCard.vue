<template>
	<div
		class="tw-flex tw-flex-col tw-justify-center tw-gap-0.5 tw-h-full tw-min-h-11 tw-px-2 tw-py-1
			tw-bg-white tw-rounded"
	>
		<p class="tw-text-base">
			Have another event?
		</p>
		<a
			class="tw-self-start tw-text-button-link tw-text-link"
			:href="FUNDRAISER_LANDING_PAGE"
			v-kv-track-event="['giving-funds', 'click', 'mykiva-start-another-fund']"
		>
			Start another fund here
		</a>
	</div>
</template>

<script setup>
import { FUNDRAISER_LANDING_PAGE } from '#src/util/fundraiserOccasions';
</script>
