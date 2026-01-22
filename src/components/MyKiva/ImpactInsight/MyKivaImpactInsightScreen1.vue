<template>
	<section class="tw-w-full tw-px-2 md:!tw-py-10 md:!tw-px-10">
		<div class="tw-mx-auto tw-max-w-6xl">
			<!-- Title -->
			<h2 class="">
				A closer look at <u>{{ borrowerName }} world</u>
			</h2>
			<div
				class="tw-mt-10 tw-flex tw-flex-col tw-items-center tw-gap-10
						md:tw-mt-14 md:tw-flex-row md:tw-items-center md:!tw-justify-center"
			>
				<div
					class="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-4 tw-border-brand-500
							tw-bg-eco-green-1 tw-text-center min-circle-size"
				>
					<div class="tw-items-center tw-gap-3">
						<div
							class="borrower-img-size tw-overflow-hidden tw-rounded-full
									tw-border-4 tw-border-white tw-my-0 tw-mx-auto"
						>
							<KvBorrowerImage
								class="tw-w-full tw-h-full tw-object-cover"
								:alt="name"
								:hash="hash"
								:aspect-ratio="2 / 2"
								:default-image="{ width: 60 }"
								:images="[{ width: 60 }]"
								:photo-path="$appConfig.photoPath"
							/>
						</div>

						<div class="tw-text-lg tw-font-semibold tw-text-slate-900">
							<strong>{{ name }}</strong>
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
						Your {{ amount }} loan helps {{ name }} build stability and success in
						<strong class="tw-text-brand">{{ countryName }}</strong>
						<template v-if="countryPPP">
							, where the average
							<strong class="tw-text-brand">annual income is {{ countryPPP }} USD</strong>
						</template>.
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import {
	KvBorrowerImage,
} from '@kiva/kv-components';
import { computed } from 'vue';
import numeral from 'numeral';

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

const name = computed(() => {
	return props.latestLoan?.name || '';
});

const hash = computed(() => {
	return props.latestLoan?.image?.hash || '';
});

const countryName = computed(() => {
	return props.latestLoan?.geocode?.country?.name || '';
});

const countryPPP = computed(() => {
	return props.latestLoan?.geocode?.country?.ppp
		? numeral(props.latestLoan.geocode.country.ppp).format('$0,0[.]00') : null;
});

const amount = computed(() => {
	const initialAmount = Math.abs(props.latestLoan?.amount) || 0;
	if (props.latestLoan?.otherLoans?.length > 0 && props.latestLoan?.id) {
		const totalAmount = props.latestLoan.otherLoans.reduce((sum, item) => {
			return props.latestLoan?.id === item?.loan.id ? sum + Math.abs(item?.loan.amount || 0) : sum;
		}, initialAmount);
		return numeral(totalAmount).format('$0,0[.]00');
	}
	return props.latestLoan?.amount ? numeral(initialAmount).format('$0,0[.]00') : null;
});

</script>

<style lang="postcss" scoped>
.min-circle-size {
	min-height: 145px;
	min-width: 145px;

	@screen md {
		min-height: 168px;
		min-width: 168px;
	}
}

.borrower-img-size {
	height: 45px;
	width: 45px;

	@screen md {
		height: 60px;
		width: 60px;
	}
}
</style>
