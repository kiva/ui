<template>
	<div class="tw-w-full">
		<div class="tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<h2 class="tw-text-h2 tw-text-primary tw-mb-1">
				{{ title }}
			</h2>
			<p v-if="subtitle" class="tw-text-subhead tw-text-primary">
				{{ subtitle }}
			</p>
			<kv-carousel
				class="tw-w-full tw-overflow-hidden tw-my-3"
				:class="{ 'tw-px-1 tw-pt-1' : enableLoanCardExp }"
				id="customizedCarousel"
				:multiple-slides-visible="true"
				slides-to-scroll="visible"
				:slide-max-width="singleSlideWidth"
				:embla-options="{ loop: false }"
			>
				<template v-for="(loan, index) in loans" #[`slide${index}`]>
					<kiva-classic-basic-loan-card-exp
						v-if="enableLoanCardExp"
						:key="`new-card-${index}`"
						:loan-id="loan.id"
						:show-action-button="true"
						:show-tags="true"
						:use-full-width="true"
						:per-row="perStep"
						@add-to-basket="addToBasket"
						class="tw-h-full"
					/>
					<kiva-classic-basic-loan-card
						v-else
						:key="index"
						:item-index="index"
						:loan-id="loan.id"
						:show-action-button="true"
						:show-tags="true"
						:use-full-width="true"
						class="tw-mr-2"
						@add-to-basket="addToBasket"
					/>
				</template>
			</kv-carousel>
		</div>
	</div>
</template>

<script>
import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
import KivaClassicBasicLoanCard from '@/components/LoanCards/KivaClassicBasicLoanCard';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	name: 'LendingCategorySection',
	components: {
		KvCarousel,
		KivaClassicBasicLoanCardExp,
		KivaClassicBasicLoanCard
	},
	props: {
		title: {
			type: String,
			default: '',
			required: true
		},
		subtitle: {
			type: String,
			default: ''
		},
		loans: {
			type: Array,
			default: () => []
		},
		perStep: {
			type: Number,
			default: 3
		},
		enableLoanCardExp: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		singleSlideWidth() {
			const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
			// handle tiny screens
			if (viewportWidth < 414) {
				return `${viewportWidth - 80}px`;
			}
			if (viewportWidth >= 414 && viewportWidth < 768) return '278px';
			if (viewportWidth >= 768 && viewportWidth < 1024) {
				if (this.enableLoanCardExp) return '328px'; return '336px';
			}
			if (viewportWidth >= 1024) {
				if (this.enableLoanCardExp) {
					if (this.perStep === 2) return '512px'; return '328px';
				}
				if (this.perStep === 2) return '520px'; return '336px';
			}
			return '336px';
		},
	},
	methods: {
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		}
	},
};
</script>

<style lang="postcss" scoped>
#customizedCarousel >>> .kv-carousel__controls {
	justify-content: center;
}

#customizedCarousel >>> .kv-carousel__controls div {
	visibility: visible;
}
</style>
