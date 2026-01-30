<template>
	<section
		class="tw-w-full tw-px-2 md:tw-pr-3 impact-insight-slide"
		:class="isLoanPartner ? 'md:tw-pl-7' : 'md:tw-pl-10'"
	>
		<div class="tw-mx-auto md:!tw-max-w-4xl">
			<div
				class="tw-flex tw-flex-col tw-items-center
						md:tw-flex-row md:tw-items-center md:!tw-justify-center"
				:class="isLoanPartner ? 'four-rings-gap' : 'three-rings-gap'"
			>
				<!-- 4 rings layout (when partner exists) -->
				<div
					v-if="isLoanPartner"
					class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-stone-2
							tw-bg-stone-1 tw-text-center min-stone-circle-size"
				>
					<div
						class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4
							tw-border-desert-rose-2 tw-text-center min-rose-circle-size"
					>
						<div
							class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4
							tw-border-marigold tw-text-center min-marigold-circle-size"
						>
							<div
								class="tw-flex tw-items-center tw-justify-center tw-rounded-full
							tw-border-4 tw-border-brand-500 tw-text-center min-circle-size"
							>
								<div class="tw-items-center tw-gap-3">
									<div
										class="tw-h-6 tw-w-6 tw-overflow-hidden tw-my-0
											tw-mx-auto md:!tw-h-7 md:!tw-w-7"
									>
										<IconGlobeDark
											class="tw-w-full tw-h-full tw-object-cover" viewBox="0 0 56 56"
										/>
									</div>

									<div class="tw-text-lg tw-font-semibold tw-text-slate-900">
										<strong>Global change</strong>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 3 rings layout (when no partner) -->
				<div
					v-else
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
									<IconGlobeDark
										class="tw-w-full tw-h-full tw-object-cover" viewBox="0 0 56 56"
									/>
								</div>

								<div class="tw-text-lg tw-font-semibold tw-text-slate-900">
									<strong>Global change</strong>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					class="tw-px-0 screen-description"
				>
					<p
						v-html="description"
						class="tw-rounded-2xl tw-bg-slate-100 tw-py-2 tw-px-2 md:!tw-px-3
							tw-text-base tw-leading-relaxed tw-bg-gray-100 tw-rounded-md md:tw-text-lg"
					></p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import IconGlobeDark from '#src/assets/images/icon-globe-dark.svg';

const props = defineProps({
	latestLoan: {
		type: Object,
		default: null,
	}
});

const isLoanPartner = computed(() => {
	return !!props.latestLoan?.partner?.loansPosted;
});

const description = computed(() => {
	const text = props.latestLoan?.gender === 'female'
		? '<strong class="tw-text-brand">8 out of 10 women</strong> earned more income after getting their loan'
		// eslint-disable-next-line max-len
		: '<strong class="tw-text-brand">89%</strong> of people said their <strong class="tw-text-brand">quality of life improved</strong> after their loan';

	return `${text}.`;
});

</script>

<style lang="postcss" scoped>
/* 4 rings styles */
.min-stone-circle-size {
	min-height: 291px;
	min-width: 291px;

	@screen md {
		min-height: 318px;
		min-width: 318px;
	}
}

.min-rose-circle-size {
	min-height: 243px;
	min-width: 243px;

	@screen md {
		min-height: 268px;
		min-width: 268px;
	}
}

.min-marigold-circle-size {
	min-height: 194px;
	min-width: 194px;

	@screen md {
		min-height: 218px;
		min-width: 218px;
	}
}

/* 3 rings styles (same as Screen3) */
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

/* Shared inner circle */
.min-circle-size {
	min-height: 145px;
	min-width: 145px;

	@screen md {
		min-height: 168px;
		min-width: 168px;
	}
}

/* Gap styles for 4 rings */
.four-rings-gap {
	gap: 2rem;

	@screen md {
		gap: 5.5rem;
	}
}

/* Gap styles for 3 rings (same as Screen3) */
.three-rings-gap {
	gap: 3.5rem;

	@screen md {
		gap: 7rem;
	}
}

.screen-description {
	width: 289px;

	@screen md {
		width: 400px;
	}
}
</style>
