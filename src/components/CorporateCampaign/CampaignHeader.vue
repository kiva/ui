<template>
	<section
		class="campaign-header section"
	>
		<div class="row align-center">
			<div class="small-12 medium-10 large-6 xlarge-5 small-order-2 large-order-1 columns">
				<!-- <featured-loans-carousel
					:disable-redirects="true"
					:show-view-loan-cta="false"
					@add-to-basket="handleAddToBasket"
				/> -->
				<no-click-loan-card />
			</div>
			<!-- eslint-disable-next-line max-len -->
			<div class="small-10 large-6 xlarge-7 small-order-1 large-order-2 align-self-middle columns featured-loans__cta_wrapper">
				<h1 class="campaign-header__header">
					<template v-if="headline">
						{{ headline }}
					</template>
					<template v-else>
						Make a loan, <br class="so mo"> change a life.
					</template>
				</h1>
				<div v-if="bodyCopy" class="campaign-header__body" v-html="bodyCopy"></div>
				<p v-else class="campaign-header__body">
					With Kiva you can lend as little as $25 and make a big change in someone's life.
				</p>
				<kv-button
					class="text-link"
					@click.native.prevent="jumpToLoans"
					v-kv-track-event="[
						'Campaign',
						'click-hero-cta',
						'Find a borrower'
					]"
				>
					Find a borrower
				</kv-button>
			</div>
		</div>
	</section>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
// import FeaturedLoansCarousel from '@/components/Homepage/LendByCategory/FeaturedLoansCarousel';
import NoClickLoanCard from '@/components/Homepage/LendByCategory/NoClickLoanCard';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		// FeaturedLoansCarousel,
		KvButton,
		NoClickLoanCard,
	},
	props: {
		headerAreaContent: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {};
	},
	computed: {
		headerLogo() {
			const mediaObject = this.headerAreaContent?.media?.[0];
			if (mediaObject) {
				return {
					title: mediaObject.title,
					url: mediaObject.file?.url
				};
			}
			return {
				title: '',
				url: ''
			};
		},
		headline() {
			if (this.headerAreaContent) {
				return this.headerAreaContent.contents[0].headline;
			}
			return '';
		},
		bodyCopy() {
			if (this.headerAreaContent) {
				return documentToHtmlString(this.headerAreaContent.contents[0].bodyCopy);
			}
			return '';
		},
	},
	methods: {
		jumpToLoans() {
			this.$emit('jump-to-loans');
		},
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.campaign-header {
	padding: 2rem 0 2rem;

	@include breakpoint(large) {
		padding: 4rem 0;
	}

	&__cta_wrapper {
		padding: 0 0 2rem;

		@include breakpoint(medium) {
			padding: 0 2rem 2rem;
		}

		@include breakpoint(large) {
			padding: 0 2rem;
		}
	}

	&__logo {
		image {
			display: block;
			outline: none;
			width: 100%;
		}
	}

	&__header {
		@include large-text();
		// padding-top: 1rem;

		@include breakpoint(xlarge) {
			@include huge-headline();
		}
	}

	&__body,
	&__cta {
		@include medium-text();

		@include breakpoint(xlarge) {
			@include featured-text();
		}
	}
}
</style>
