<template>
	<section class="tw-w-full tw-px-2 md:tw-py-10 md:tw-px-10">
		<div class="tw-mx-auto tw-max-w-6xl">
			<h2 class="">
				A closer look at <u>{{ borrowerName }} world</u>
			</h2>
			<div
				class="tw-mt-10 tw-flex tw-flex-col tw-items-center tw-gap-10
						md:tw-mt-14 md:tw-flex-row md:tw-items-center md:!tw-justify-center"
			>
				<div
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
				<div
					class="tw-w-full tw-max-w-xl tw-px-4 md:!tw-px-0"
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
import { formatPossessiveName } from '#src/util/stringParserUtils';

const props = defineProps({
	latestLoan: {
		type: Object,
		default: null,
	}
});

const borrowerName = computed(() => {
	return formatPossessiveName(props.latestLoan?.name) || '';
});

const description = computed(() => {
	let text = '';
	if (props.latestLoan?.gender === 'female') {
		text += '<strong class="tw-text-brand">8 out of 10 women</strong> '
		+ 'earned more income after getting their loan';
	} else {
		text += '<strong class="tw-text-brand">89%</strong> of people said their '
		+ '<strong class="tw-text-brand">quality of life improved</strong> after their loan';
	}

	text += '.';

	return text;
});

</script>

<style lang="postcss" scoped>
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

.min-circle-size {
	min-height: 145px;
	min-width: 145px;

	@screen md {
		min-height: 168px;
		min-width: 168px;
	}
}
</style>
