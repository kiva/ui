<template>
	<div class="component-wrapper">
		<transition name="kvfade">
			<div
				v-if="isLoading"
				class="spinner"
			>
				<kv-loading-spinner />
			</div>
		</transition>
		<kv-carousel
			v-if="this.loans.length > 0 && this.isVisible"
			slides-to-scroll="visible"
			:autoplay="false"
			indicator-style="none"
			:embla-options="{
				loop: false,
				align: 'start'
			}"
			@interact-carousel="onInteractCarousel"
		>
			<kv-carousel-slide
				v-for="(loan, index) in loans"
				:key="`loan-${loan.id}`"
				class="column cards-wrap"
			>
				<!-- <promo-grid-loan-card
							v-if="index === 2 && monthlyGoodPromoData"
							class="cards-mg-promo"
							:category-url="monthlyGoodPromoData.url"
							:category-label="monthlyGoodPromoData.label"
							compact
						/> -->
				<loan-card-controller
					class="cards-loan-card"
					loan-card-type="LendHomepageLoanCard"
					:loan="loan"
					:items-in-basket="itemsInBasket"
					:category-id="loanChannel.id"
					:category-set-id="`lbc-hp-v1-category-${loanChannel.id}`"
					:row-number="rowNumber"
					:card-number="index + 1"
					:enable-tracking="true"
					:is-visitor="!isLoggedIn"
					:show-view-loan-cta="true"
				/>
			</kv-carousel-slide>
			<kv-carousel-slide class="column cards-wrap">
				<router-link
					class="see-all-card"
					:to="cleanUrl"
					v-kv-track-event="[
						'Homepage',
						'click-carousel-view-all-category-loans',
						`${viewAllLoansCategoryTitle}`]"
				>
					<div class="see-all-card__link">
						<h3>{{ viewAllLoansCategoryTitle }}</h3>
					</div>
				</router-link>
			</kv-carousel-slide>
		</kv-carousel>
	</div>
</template>

<script>
import KvCarousel from '@/components/Kv/KvCarousel';
import KvCarouselSlide from '@/components/Kv/KvCarouselSlide';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LoanCardController from '@/components/LoanCards/LoanCardController';
// import PromoGridLoanCard from '@/components/LoanCards/PromoGridLoanCard';

export default {
	components: {
		KvCarousel,
		KvCarouselSlide,
		KvLoadingSpinner,
		LoanCardController,
		// PromoGridLoanCard,
	},
	props: {
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		loanChannel: {
			type: Object,
			default: () => {},
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isVisible: {
			type: Boolean,
			default: false
		},
		loans: {
			type: Array,
			default: () => [],
		},
		rowNumber: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			name: '',
			id: 0,
			url: '',
			preventUpdatingDetailedCard: false,
		};
	},
	computed: {
		isLoading() {
			return this.loans.length === 0 && this.isVisible;
		},
		monthlyGoodPromoData() {
			switch (this.id) {
				case 52:
					return { url: '/monthlygood?category=women', label: 'women' };
				case 96:
					return { url: '/covid19response', label: 'COVID-19-affected businesses' };
				case 87:
					return { url: '/monthlygood?category=agriculture', label: 'farmers' };
				default:
					return null;
			}
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
		loanChannel: {
			handler(channel) {
				this.name = channel?.name || '';
				this.url = channel?.url || '';
				this.id = channel?.id || '';
			},
			immediate: true,
		},
	},
	methods: {
		cleanCategoryName(categoryId) {
			switch (categoryId) {
				case 52:
					return 'loans to women';
				case 96:
					return 'COVID-19 loans';
				case 93:
					return 'shelter loans';
				case 89:
					return 'arts loans';
				case 87:
					return 'agriculture loans';
				case 102:
					return 'technology loans';
				case 4:
					return 'education loans';
				case 25:
					return 'health loans';
				case 32:
					return 'loans to refugees and IDPs';
				default:
					// remove any text contained within square brackets, including the brackets
					return String(this.name).replace(/\s\[.*\]/g, '');
			}
		},
		onInteractCarousel(interaction) {
			this.$kvTrackEvent('homepage', 'click-carousel-horizontal-scroll', interaction);
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'foundation';

$card-width: rem-calc(297);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(14/2);

.component-wrapper {
	min-height: rem-calc(465); // prevents layout shift as loans load in
	display: flex;
	align-items: flex-start;
	justify-content: center;
	position: relative;

	// extra specificity to ensure width: auto is respected when bundling css
	.cards-wrap {
		display: flex;
		width: auto;
	}
}

.cards-loan-card,
.cards-mg-promo,
.see-all-card {
	border-radius: 0.65rem;
	box-shadow: 0 0.65rem $card-margin $card-half-space rgb(153, 153, 153, 0.1);
	width: $card-width;
	max-width: calc(100vw - 4rem); // ensure some extra card is shown on mobile
	margin: 1rem 0 2rem 0;
}

.cards-mg-promo {
	border: 0;
}

// Customize styles for touch screens ie. No Arrows
@media (hover: none) {
	::v-deep .kv-carousel__arrows-btn {
		display: none;
	}
}

.see-all-card {
	display: block;

	&:hover {
		box-shadow: 0 0 $card-half-space rgba(0, 0, 0, 0.2);
	}

	&__link {
		align-items: center;
		display: flex;
		height: 100%;
		justify-content: center;
	}
}

::v-deep .lend-homepage-loan-card__image-wrapper {
	padding-bottom: 62.5%;
}

.spinner {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	left: 0;
	z-index: 1;
	width: 100%;
	height: 100%;
	background: #fff;
}
</style>
