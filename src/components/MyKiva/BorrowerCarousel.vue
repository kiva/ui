<template>
	<MyKivaContainer>
		<h2 v-html="title" class="tw-mb-3.5"></h2>
		<div :class="{'tw-flex tw-justify-center': !loans.length }">
			<KvButton v-if="!loans.length || !hasActiveLoans" :to="link">
				{{ btnCta }}
			</KvButton>
		</div>
		<div v-if="hasActiveLoans">
			<KvTabs @tab-changed="handleChange" v-if="loans.length > 1" class="tabs">
				<template #tabNav>
					<KvTab v-for="(loan, index) in filteredLoans" :key="index" :label="index + 1" :for-panel="loan.id">
						<div class="tw-flex tw-flex-col tw-justify-center">
							<div
								class="tw-w-8 tw-h-8 tw-mx-auto md:tw-mx-0 tw-border-white tw-border-4
									tw-rounded-full tw-shadow"
							>
								<BorrowerImage
									class="tw-w-full tw-rounded-full tw-bg-brand"
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
							<h5 class="tw-text-center">
								{{ getBorrowerName(loan) }}
							</h5>
						</div>
					</KvTab>
					<KvTab>
						<a href="/portfolio/loans">View all</a>
					</KvTab>
				</template>
				<template #tabPanels>
					<kv-tab-panel v-for="(loan, index) in loans" :key="index" :id="loan.id">
						<p class="tw-hidden" :id="loan.id"></p>
					</kv-tab-panel>
				</template>
			</KvTabs>
			<div class="carousel-container">
				<KvCarousel
					ref="carousel"
					class="borrower-carousel tw-w-full md:tw-overflow-visible"
					:multiple-slides-visible="true"
					:slide-max-width="singleSlideWidth"
					:embla-options="{ loop: false, align: 'center'}"
				>
					<template v-for="(loan, index) in loans" #[`slide${index+1}`] :key="loan.id || index">
						<BorrowerStatusCard :loan="loan" />
					</template>
				</KvCarousel>
			</div>
		</div>
	</MyKivaContainer>
</template>

<script setup>
import KvTabs from '@kiva/kv-components/vue/KvTabs';
import KvTab from '@kiva/kv-components/vue/KvTab';
import KvCarousel from '@kiva/kv-components/vue/KvCarousel';
import KvButton from '@kiva/kv-components/vue/KvButton';
import BorrowerImage from '#src/components/BorrowerProfile/BorrowerImage';
import { defineProps, ref, computed } from 'vue';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
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
	hasActiveLoans: {
		type: Boolean,
		default: true,
	},
});

const { loans, hasActiveLoans } = props;

const carousel = ref(null);

const handleChange = event => {
	carousel.value.goToSlide(event);
};

const getBorrowerName = loan => {
	return loan?.name ?? '';
};

const getBorrowerHash = loan => {
	return loan?.image?.hash ?? '';
};

const title = computed(() => {
	if (!hasActiveLoans) {
		return `You changed <u>${loans.length} lives</u>!`;
	}
	if (loans.length) {
		if (loans.length === 1) {
			return 'You’re changing a life right now!';
		}
		return `You’re <u>changing ${loans.length} liv</u>es right now!`;
	}
	return 'Change a life <u>today</u>!';
});

const btnCta = computed(() => {
	if (!hasActiveLoans) {
		return 'See previously supported borrowers';
	}
	return 'Make a loan';
});

const link = computed(() => {
	if (!hasActiveLoans) {
		return '/portfolio';
	}
	return '/lend-by-category';
});

const filteredLoans = computed(() => {
	return loans.slice(0, 9);
});

const singleSlideWidth = computed(() => {
	const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 520;

	if (viewportWidth < 768) {
		return '288px';
	} if (window.innerWidth < 1024) {
		return '468px';
	}
	return '520px';
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
:deep(.tabs) div[role="tablist"] {
	@apply md:tw-gap-3.5;
}
</style>
