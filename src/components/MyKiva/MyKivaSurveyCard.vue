<template>
	<div
		class="tw-w-full tw-rounded tw-shadow tw-p-2 tw-flex tw-flex-col tw-justify-between
			tw-shrink-0 tw-overflow-hidden tw-h-full tw-select-none tw-bg-center tw-bg-cover tw-bg-no-repeat"
		style="background-image: url('/src/assets/images/my-kiva/survey-card-background.jpg');"
	>
		<div>
			<span
				class="tw-inline-flex tw-items-center tw-gap-1 tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5"
			>
				<KvMaterialIcon
					class="tw-w-2 tw-h-2 tw-shrink-0"
					:icon="mdiLightningBoltOutline"
				/>
				<span
					class="tw-text-primary tw-font-medium tw-align-middle"
					style="font-size: 0.875rem;"
				>
					10-second poll
				</span>
			</span>
		</div>

		<div class="tw-flex tw-flex-col tw-items-center tw-gap-2">
			<MyKivaLightningImg />
			<h3 class="tw-text-center">
				<u>Help Kiva</u> by answering one question
			</h3>
		</div>

		<KvButton
			variant="secondary"
			v-kv-track-event="['portfolio', 'click', 'next-step-qualitative-feedback']"
			class="tw-w-full tw-mt-1"
			@click="goToSurvey"
		>
			Your voice matters
		</KvButton>
	</div>
</template>

<script setup>
import { inject, onMounted } from 'vue';
import { KvMaterialIcon, KvButton } from '@kiva/kv-components';
import { mdiLightningBoltOutline } from '@mdi/js';
import MyKivaLightningImg from '#src/assets/images/my-kiva/mykiva-lightning.svg';

const $kvTrackEvent = inject('$kvTrackEvent');

const goToSurvey = () => {
	window.location.href = '/lp/mykiva-input';
};

onMounted(() => {
	$kvTrackEvent('portfolio', 'show', 'next-step-qual-feedback');
});
</script>
