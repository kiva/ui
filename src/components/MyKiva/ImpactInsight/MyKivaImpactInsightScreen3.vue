<template>
	<section class="tw-w-full tw-px-2 md:!tw-pr-3 impact-insight-slide">
		<div class="tw-mx-auto md:!tw-max-w-4xl">
			<div
				class="tw-flex tw-flex-col tw-items-center
						md:tw-flex-row md:tw-items-center md:!tw-justify-center"
			>
				<div
					class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-desert-rose-2
							tw-bg-danger-highlight tw-text-center min-ext-circle-size"
				>
					<div
						class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-marigold
							tw-text-center min-big-circle-size"
					>
						<div
							class="tw-flex tw-items-center tw-justify-center tw-rounded-full
							tw-border-4 tw-border-brand-500 tw-text-center min-circle-size"
						>
							<div class="tw-items-center tw-gap-3">
								<div
									class="tw-h-6.5 tw-w-6.5 tw-overflow-hidden tw-my-0
											tw-mx-auto md:!tw-h-8 md:!tw-w-8"
								>
									<IconFarmBgWhite
										class="tw-w-full tw-h-full tw-object-cover" viewBox="0 0 56 69"
									/>
								</div>

								<div class="tw-text-lg tw-font-semibold tw-text-slate-900">
									<strong>Their community</strong>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					class="tw-px-4 md:!tw-px-0 screen-description"
				>
					<p
						class="tw-rounded-2xl tw-bg-slate-100 tw-py-2 tw-px-2 md:!tw-px-3
							tw-text-base tw-leading-relaxed tw-bg-gray-100 tw-rounded-md md:tw-text-lg"
					>
						{{ name }} isn't on this journey alone. They're working with a
						Kiva lending partner that's already helped
						<strong class="tw-text-brand">{{ helpedPeopleInCountry }}</strong> people in their region.
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import numeral from 'numeral';
import { computed } from 'vue';

import IconFarmBgWhite from '#src/assets/images/icon-farm-bg-white.svg';

const props = defineProps({
	latestLoan: {
		type: Object,
		default: null,
	}
});

const name = computed(() => {
	return props.latestLoan?.name || '';
});

const helpedPeopleInCountry = computed(() => {
	// pending BE change to get helpedPeopleInCountry field, on MP-2431 (update storybook when done)
	return numeral(46716).format('0,0[.]00');
});

</script>

<style lang="postcss" scoped>
.min-ext-circle-size {
	min-height: 243px;
	min-width: 243px;

	@screen md {
		min-height: 268px;
		min-width: 268px;
	}
}

.min-big-circle-size {
	min-height: 194px;
	min-width: 194px;

	@screen md {
		min-height: 218px;
		min-width: 218px;
	}
}

.min-circle-size {
	min-height: 145px;
	min-width: 145px;

	@screen md {
		min-height: 168px;
		min-width: 168px;
	}
}

.impact-insight-slide {
	@screen md {
		padding-left: 79px;
	}
}

div:has(.screen-description) {
	gap: 7rem;
}

.screen-description {
	width: 400px;
}
</style>
