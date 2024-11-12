<template>
	<div>
		<template v-if="isLoading">
			<KvLoadingPlaceholder class="tw-my-2 lg:tw-mb-4 !tw-w-full md:!tw-w-1/2 !tw-h-6" />
			<KvLoadingPlaceholder
				class="tw-mb-2 lg:tw-mb-3 !tw-w-full md:!tw-w-1/2"
				:style="{ height: '17rem' }"
			/>
		</template>
		<template v-else>
			<h2 v-html="title" class="tw-mb-3.5"></h2>
			<div :class="{'tw-flex tw-justify-center': !loans.length }">
				<KvButton
					v-kv-track-event="[
						'portfolio',
						'click',
						btnEventLabel
					]" v-if="!loans.length || !hasActiveLoans"
					:to="link"
				>
					{{ btnCta }}
				</KvButton>
			</div>
		</template>
		<div v-if="hasActiveLoans && !isLoading">
			<KvTabs ref="tabs" @tab-changed="handleChange" v-if="loans.length > 1" class="tabs">
				<template #tabNav>
					<KvTab
						v-for="(loan, index) in filteredLoans"
						:key="index"
						:label="index + 1"
						:for-panel="`${loan.id}`"
					>
						<div class="tw-flex tw-flex-col tw-justify-start tw-items-center tw-w-10">
							<div
								class="tw-w-8 tw-h-8 tw-mx-auto md:tw-mx-0 tw-border-white tw-border-4
									tw-rounded-full tw-shadow"
							>
								<BorrowerImage
									class="tw-w-full tw-rounded-full"
									:alt="getBorrowerName(loan)"
									:aspect-ratio="1"
									:default-image="{ width: 80, faceZoom: 50 }"
									:hash="getBorrowerHash(loan)"
									:images="[
										{ width: 80, faceZoom: 50, viewSize: 1024 },
										{ width: 72, faceZoom: 50, viewSize: 734 },
										{ width: 64, faceZoom: 50 },
									]"
								/>
							</div>
							<h5 class="tw-text-center tw-text-ellipsis tw-line-clamp-2 tw-whitespace-normal tw-pt-0.5">
								{{ getBorrowerName(loan) }}
							</h5>
						</div>
					</KvTab>
					<KvTab v-if="loans.length > 9" for-panel="view-more">
						<a
							href="/portfolio/loans" v-kv-track-event="[
								'portfolio',
								'click',
								'view-all'
							]"
						>View all</a>
					</KvTab>
				</template>
				<template #tabPanels>
					<KvTabPanel
						v-for="(loan, index) in loans"
						:key="index"
						:id="`${loan.id}`"
					>
						<p class="tw-hidden" :id="loan.id"></p>
					</KvTabPanel>
				</template>
			</KvTabs>
			<div class="carousel-container">
				<KvCarousel
					ref="carousel"
					class="borrower-carousel tw-w-full md:tw-overflow-visible"
					:multiple-slides-visible="true"
					:slide-max-width="singleSlideWidth"
					:embla-options="{ loop: false, align: 'center'}"
					@change="onInteractCarousel"
				>
					<template v-for="(loan, index) in loans" #[`slide${index+1}`] :key="loan.id || index">
						<BorrowerStatusCard :loan="loan" class="tw-h-full" />
					</template>
				</KvCarousel>
			</div>
			<div class="tw-text-right" v-if="hasCompletedBorrowers">
				<a
					class="tw-text-h5"
					href="/portfolio/loans" v-kv-track-event="[
						'portfolio',
						'click',
						'see-all-borrowers'
					]"
				>See all borrowers</a>
			</div>
		</div>
	</div>
</template>

<script setup>
import _throttle from 'lodash/throttle';
import KvTabs from '@kiva/kv-components/vue/KvTabs';
import KvTab from '@kiva/kv-components/vue/KvTab';
import KvTabPanel from '@kiva/kv-components/vue/KvTabPanel';
import KvCarousel from '@kiva/kv-components/vue/KvCarousel';
import KvButton from '@kiva/kv-components/vue/KvButton';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import KvLoadingPlaceholder from '@kiva/kv-components/vue/KvLoadingPlaceholder';
import {
	defineProps,
	ref,
	computed,
	toRefs,
	inject,
	onMounted,
	onBeforeUnmount
} from 'vue';
import {
	PAYING_BACK,
	ENDED,
	DEFAULTED,
	FUNDED,
	FUNDRAISING,
	RAISED
} from '#src/api/fixtures/LoanStatusEnum';
import BorrowerStatusCard from './BorrowerStatusCard';

const props = defineProps({
	/**
   * Array of loans
   * */
	loans: {
		type: Array,
		default: () => ([]),
		required: true,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
});

const $kvTrackEvent = inject('$kvTrackEvent');
const emit = defineEmits(['selected-loan']);

const { loans, totalLoans } = toRefs(props);
const carousel = ref(null);
const tabs = ref(null);
const windowWidth = ref(0);

const hasActiveLoans = computed(() => {
	return loans.value.some(loan => [FUNDED, FUNDRAISING, PAYING_BACK, RAISED].includes(loan?.status));
});

const handleChange = event => {
	emit('selected-loan', loans.value[event]);
	carousel.value.goToSlide(event);
};

const getBorrowerName = loan => {
	return loan?.name ?? '';
};

const getBorrowerHash = loan => {
	return loan?.image?.hash ?? '';
};

const title = computed(() => {
	if (!hasActiveLoans.value) {
		return `You changed <u>${totalLoans.value} lives</u>!`;
	}
	if (loans.value.length) {
		if (totalLoans.value === 1) {
			return 'You’re <u>changing a life</u> right now!';
		}
		return `You’re <u>changing ${totalLoans.value} lives</u> right now!`;
	}
	return 'Change a life <u>today</u>!';
});

const btnCta = computed(() => {
	if (!hasActiveLoans.value) {
		return 'See previously supported borrowers';
	}
	return 'Make a loan';
});

const link = computed(() => {
	if (!hasActiveLoans.value) {
		return '/portfolio';
	}
	return '/lend-by-category';
});

const btnEventLabel = computed(() => {
	if (!hasActiveLoans.value) {
		return 'see-previously-supported-borrowers';
	}
	return 'Make-a-loan-no-loans-state';
});

const filteredLoans = computed(() => {
	return loans.value.slice(0, 9);
});

const singleSlideWidth = computed(() => {
	const viewportWidth = typeof window !== 'undefined' ? windowWidth.value : 520;

	// Handle small mobile screens
	if (viewportWidth < 450) {
		return '100%';
	}
	if (window.innerWidth < 1024) {
		return '468px';
	}
	return '520px';
});

const hasCompletedBorrowers = computed(() => {
	return loans.value.some(loan => loan?.status === ENDED || loan?.status === DEFAULTED);
});

const handleResize = () => {
	windowWidth.value = window.innerWidth;
};

const throttledResize = _throttle(handleResize, 200);

const onInteractCarousel = interaction => {
	tabs.value.tabContext.selectedIndex = interaction.value;
};

onMounted(() => {
	if (!hasActiveLoans.value) {
		$kvTrackEvent('portfolio', 'view', 'no-active-borrowers');
	} else {
		$kvTrackEvent('portfolio', 'view', 'active-borrowers', loans.value.length);
	}

	window.addEventListener('resize', throttledResize);

	handleResize();
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', throttledResize);
});

</script>

<style lang="postcss" scoped>

.carousel-container {
	max-width: 100%;

	@screen md {
		max-width: 468px;
	}

	@screen lg {
		max-width: 520px;
	}
}

:deep(.borrower-carousel) div.kv-carousel__controls {
	@apply tw-hidden;
}

:deep(.tabs) div[role=tablist] {
	@apply md:tw-gap-3.5 tw-items-baseline;
}
</style>
