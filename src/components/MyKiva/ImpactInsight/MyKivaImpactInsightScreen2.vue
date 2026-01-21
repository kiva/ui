<template>
	<section class="tw-w-full tw-px-2 md:!tw-py-10 md:!tw-px-10">
		<div class="tw-mx-auto tw-max-w-6xl">
			<h2 class="">
				A closer look at <u>{{ borrowerName }} world</u>
			</h2>
			<div
				class="tw-mt-10 tw-flex tw-flex-col tw-items-center tw-gap-10
						md:tw-mt-14 md:tw-flex-row md:tw-items-center md:!tw-justify-center"
			>
				<div
					class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-marigold
							tw-bg-caution-highlight tw-text-center min-big-circle-size"
				>
					<div
						class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-brand-500
							tw-text-center min-circle-size"
					>
						<div class="tw-items-center tw-gap-3">
							<div
								class="tw-h-6.5 tw-w-6.5 tw-overflow-hidden tw-my-0 tw-mx-auto md:!tw-h-8 md:!tw-w-8"
							>
								<IconHeartBgWhite
									class="tw-w-full tw-h-full tw-object-cover" viewBox="15 10 100 100"
								/>
							</div>

							<div class="tw-text-lg tw-font-semibold tw-text-slate-900">
								<strong>Their loan</strong>
							</div>
						</div>
					</div>
				</div>
				<div
					class="tw-w-full tw-max-w-xl tw-px-4 md:!tw-px-0"
				>
					<p
						class="tw-rounded-2xl tw-bg-slate-100 tw-py-2 tw-px-2 md:!tw-px-3
							tw-text-base tw-leading-relaxed tw-bg-gray-100 tw-rounded-md md:tw-text-lg"
					>
						<strong class="tw-text-brand">This loan is special because</strong>
						{{ whySpecial }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import IconHeartBgWhite from '#src/assets/images/icon-heart-bg-white.svg';
import { computed } from 'vue';

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

const whySpecial = computed(() => {
	return props.latestLoan?.whySpecial || '';
});

</script>

<style lang="postcss" scoped>
.min-big-circle-size {
	min-height: 218px;
	min-width: 218px;

	@screen md {
		min-height: 194px;
		min-width: 194px;
	}
}

.min-circle-size {
	min-height: 168px;
	min-width: 168px;

	@screen md {
		min-height: 145px;
		min-width: 145px;
	}
}
</style>
