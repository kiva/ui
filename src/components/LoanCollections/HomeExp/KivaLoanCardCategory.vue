<template>
	<div class="tw-pt-4">
		<transition name="kvfade">
			<div
				v-if="isLoading"
				class="spinner tw-text-center"
			>
				<kv-loading-spinner />
			</div>
		</transition>
		<template>
			<div class="tw-hidden md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
				<template v-for="(loanId, index) in augmentedLoanIds">
					<new-home-page-loan-card
						:item-index="index"
						:key="`loan-${loanId}`"
						:loan-id="loanId"
					/>
				</template>
			</div>
			<div class="tw-mt-4 tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-w-auto tw-mx-auto">
				<kv-button
					class="tw-mx-1 tw-mb-3 tw-whitespace-nowrap"
					:variant="categoryButtonStyle"
					:to="cleanUrl"
				>
					{{ viewAllLoansCategoryTitle }}
				</kv-button>
			</div>
		</template>
	</div>
</template>

<script>
import { getCategoryName } from '@/util/categoryUtils';
import NewHomePageLoanCard from '@/components/LoanCards/NewHomePageLoanCard';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'KivaLoanCardCategory',
	components: {
		KvLoadingSpinner,
		NewHomePageLoanCard,
		KvButton
	},
	props: {
		loanIds: {
			type: Array,
			default: () => [],
		},
		selectedChannel: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			name: '',
			id: 0,
			url: '',
			browseButtonStyle: 'primary',
			categoryButtonStyle: 'secondary',
			lendByCategoryUrl: 'lend-by-category'
		};
	},
	computed: {
		isLoading() {
			return this.augmentedLoanIds.length === 0;
		},
		augmentedLoanIds() {
			const clonedLoanIds = [...this.loanIds];
			// const promoCardId = 1;
			// const loadMoreCardId = 2;
			// TODO: splice if promoCard if active on row
			// if (this.showPromoCard) {
			// 	clonedLoanIds.splice(1, 0, promoCardId);
			// }
			// TODO: append loadMoreCard if active
			// if (this.showLoadMoreCard) {
			// 	clonedLoanIds.push(loadMoreCardId);
			// 	return clonedLoanIds;
			// }
			return clonedLoanIds;
		},
		cleanUrl() {
			// Convert LoanChannel Url to use first path segment /lend-by-category instead of /lend
			// grab last segment of url
			const lastPathIndex = this.url.lastIndexOf('/');
			const urlSegment = this.url.slice(lastPathIndex);
			// ensure string type
			let cleanUrl = String(urlSegment);

			// empty url value for certain urls and if no url is passed in
			if (
				this.url.includes('loans-with-research-backed-impact') === true
				|| this.url.includes('recently-viewed-loans') === true
				|| this.url === '') {
				cleanUrl = '';
			}

			// retain countries not lent to location in /lend
			if (this.url.includes('new-countries-for-you')) {
				return '/lend/countries-not-lent';
			}

			// otherwise transform to use /lend-by-category as root path
			return `/lend-by-category${cleanUrl}`;
		},
		viewAllLoansCategoryTitle() {
			return `View all ${this.cleanCategoryName(this.id)}`;
		},
	},
	watch: {
		selectedChannel: {
			handler(channel) {
				this.name = channel?.name || '';
				this.url = channel?.url || '';
				this.id = channel?.id || '';
			},
			immediate: true,
		},
	},
	methods: {
		// TODO: consider deprecating in favor of Contentful controlled value similar to shortName
		cleanCategoryName(categoryId) {
			return getCategoryName(categoryId, this.name);
		},
	},
};
</script>
<style lang="postcss" scoped>
	div.card-container {
		max-width: 242px !important;
		min-width: 242px !important;
	}
</style>
