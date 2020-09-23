<template>
	<www-page-minimal
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="corporate-campaign-landing">
			<section class="campaign-header section row align-center">
				<div class="small-12 medium-10 large-6 xlarge-5 small-order-2 large-order-1 columns">
					<no-click-loan-card />
				</div>
				<!-- eslint-disable-next-line max-len -->
				<div class="small-10 large-6 xlarge-7 small-order-1 large-order-2 align-self-middle columns campaign-header__cta_wrapper">
					<div v-if="headerLogo.url" class="campaign-header__logo">
						<img :title="headerLogo.title" :src="headerLogo.url">
					</div>
					<hr v-if="headerLogo.url">
					<h1 class="campaign-header__header">
						{{ headline }}
					</h1>
					<div class="campaign-header__body" v-html="bodyCopy"></div>
					<a
						class="campaign-header__cta"
						@click.prevent="jumpToLoans"
						v-kv-track-event="[
							'Campaign',
							'click-hero-cta',
							'Find someone to lend to',
						]"
					>
						Find someone to lend to &xrarr;
					</a>
				</div>
			</section>

			<section class="campaign-status row align-center"></section>

			<section class="campaign-loans row align-center"></section>

			<section class="campaign-checkout row align-center"></section>
		</div>
	</www-page-minimal>
</template>

<script>
import gql from 'graphql-tag';

import { processPageContentFlat } from '@/util/contentfulUtils';
import { applyUpcCode, applyRedemptionCode, applyLendingReward } from '@/util/campaignUtils';
import { lightHeader, lightFooter } from '@/util/siteThemes';
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';
import NoClickLoanCard from '@/components/Homepage/LendByCategory/NoClickLoanCard';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const pageQuery = gql`query pageContent($basketId: String!, $contentKey: String) {
	contentful {
		entries(contentType: "page", contentKey: $contentKey)
	}
	shop(basketId: $basketId) {
		basket {
			hasFreeCredits
		}
		lendingRewardOffered
	}
}`;

export default {
	inject: ['apollo'],
	components: {
		WwwPageMinimal,
		NoClickLoanCard,
	},
	props: {
		dynamicRoute: {
			type: String,
			default: ''
		},
		upc: {
			type: String,
			default: ''
		},
		promoCode: {
			type: String,
			default: ''
		},
		lendingReward: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: lightFooter,
			pageTitle: 'Welcome',
			rawPageData: null,
			pageData: null,
			hasFreeCredits: null,
			lendingRewardOffered: null,
		};
	},
	apollo: {
		preFetch: true,
		query: pageQuery,
		// TODO: Convert to prefetch function and check for page path before fetching all content
		// - Requires extended contentful graphql query options for include depth and query by addtional fields
		preFetchVariables({ route }) {
			return { contentKey: route.params.dynamicRoute };
		},
		variables() {
			return { contentKey: this.$route.params.dynamicRoute };
		},
		result({ data }) {
			// extract dynamicRoute param for contentful query
			const { dynamicRoute } = this.$route.params;
			// redirect if missing page data and/or route
			if (typeof dynamicRoute === 'undefined') {
				this.$router.push('/');
			}
			this.rawPageData = data;
			const pageEntry = data.contentful?.entries?.items[0] || null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;

			this.lendingRewardOffered = data.shop?.lendingRewardOffered;
			this.hasFreeCredits = data.shop?.basket?.hasFreeCredits;
		}
	},
	mounted() {
		// console.log('raw page data: ', this.rawPageData);
		// console.log('page data: ', this.pageData);

		// TODO: Apply promotions with some type of loading state
		this.validateQueryParams();
		// TODO: Fetch promo campaign information
		// TODO: Translate LSC and Fetch loans
	},
	computed: {
		headerAreaContent() {
			return this.pageData?.page?.contentGroups?.promoCampaignTestCg;
		},
		headerLogo() {
			const mediaObject = this.headerAreaContent.media[0];
			return {
				title: mediaObject.title,
				url: mediaObject.file?.url
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
		validateQueryParams() {
			console.log(this.$route.query);
			const { upc, promoCode, lendingReward } = this.$route.query;
			console.log(upc, promoCode, lendingReward);
			if (upc) {
				this.handleUpcCode(upc);
			} else if (promoCode) {
				this.handlePromoCode(promoCode);
			} else if (lendingReward) {
				this.handleLendingReward(lendingReward);
			}
		},
		handleUpcCode(upc) {
			applyUpcCode(upc, this.apollo).then(result => {
				console.log(result);
			}).catch(error => {
				console.error(error);
			});
		},
		handlePromoCode(promoCode) {
			applyRedemptionCode(promoCode, this.apollo).then(result => {
				console.log(result);
			}).catch(error => {
				console.error(error);
			});
		},
		handleLendingReward(lendingReward) {
			applyLendingReward(lendingReward, this.apollo).then(result => {
				console.log(result);
			}).catch(error => {
				console.error(error);
			});
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.section {
	position: relative;
	padding: 3rem 0;

	@include breakpoint(large) {
		padding: 6rem 0;
	}
}

.campaign-header {
	padding: 2rem 0 6rem;

	@include breakpoint(large) {
		padding: 4rem 0 11rem;
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

		padding-top: 1rem;
	}

	&__body,
	&__cta {
		@include medium-text();

		@include breakpoint(xlarge) {
			@include featured-text();
		}
	}

	&__flourish {
		position: absolute;
		width: 40%;
		max-width: rem-calc(436);
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: -1;

		@include breakpoint(medium) {
			width: 31%;
		}
	}
}

</style>
