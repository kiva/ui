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

			<section class="campaign-status section">
				<div class="row campaign-status__border">
					<div v-if="loadingPromotion" class="campaign-status__validating-promo">
						<loading-overlay />
						<p>Validating Promotion...</p>
					</div>

					<div v-if="promoErrorMessage" class="small-12 columns campaign-status__error-text-container">
						<span class="message-content text-center">
							<div class="icon-wrapper">
								<kv-icon name="error" />
							</div>
							<p class="message">{{ promoErrorMessage }}</p>
						</span>
					</div>

					<div v-if="promoApplied" class="small-12 large-6 columns campaign-status__text-container">
						<h3 class="campaign-status__header">
							How it works:
						</h3>
						<ul>
							<li>Choose your borrower below.</li>
							<li>Click "Add to basket"</li>
							<li>Click "Checkout" to complete your loan</li>
						</ul>
					</div>
					<div v-if="promoApplied" class="small-12 large-6 columns campaign-status__text-container">
						<h3 class="campaign-status__header">
							Find your first <br>borrower
						</h3>
						<p class="campaign-status__body">
							You have ... to lend...
						</p>
					</div>
				</div>
			</section>

			<section class="campaign-loans row align-center"></section>

			<section class="campaign-checkout row align-center"></section>
		</div>
	</www-page-minimal>
</template>

<script>
import gql from 'graphql-tag';

import { processPageContentFlat } from '@/util/contentfulUtils';
import { validateQueryParams } from '@/util/campaignUtils';
import { lightHeader, lightFooter } from '@/util/siteThemes';
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';
import NoClickLoanCard from '@/components/Homepage/LendByCategory/NoClickLoanCard';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';
import KvIcon from '@/components/Kv/KvIcon';
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
		LoadingOverlay,
		KvIcon,
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
			rawPageData: null,
			pageData: null,
			hasFreeCredits: null,
			lendingRewardOffered: null,
			promoApplied: null,
			promoErrorMessage: null,
			promoData: null,
			loadingPromotion: false,
		};
	},
	metaInfo() {
		return {
			title: `${this.pageTitle}`,
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
		if (this.$route.query) {
			this.applyPromotion();
		}

		// TODO: Fetch promo campaign information
		// TODO: Translate LSC and Fetch loans
	},
	computed: {
		pageTitle() {
			// TODO: add field on Contentful Page for this
			return this.pageData?.page?.pageLayout?.name;
		},
		headerAreaContent() {
			return this.pageData?.page?.contentGroups?.promoCampaignTestCg;
		},
		headerLogo() {
			const mediaObject = this.headerAreaContent?.media[0];
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
		applyPromotion() {
			this.loadingPromotion = true;
			const applyPromo = validateQueryParams(this.$route.query, this.apollo);
			console.log(applyPromo);
			applyPromo.then(result => {
				console.log(result);
				// failed to apply promotion
				if (result.errors) {
					this.promoErrorMessage = result.errors[0].message;
					this.promoApplied = false;
				} else {
					this.promoApplied = true;
					this.promoData = result.data;
				}
				this.loadingPromotion = false;
			}).catch(error => {
				console.error(error);
				this.loadingPromotion = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.campaign-header {
	padding: 2rem 0 2rem;

	@include breakpoint(large) {
		padding: 4rem 0 2rem;
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
}

.campaign-status {
	padding: 2rem;

	&__border {
		min-height: 10rem;
		position: relative;
		border-radius: 1rem;
		z-index: 1;
		box-shadow: 0 0 1.2rem 1rem rgb(153, 153, 153, 0.1);
		margin: 0 rem-calc(10);
		padding: 1rem;

		@include breakpoint(xga) {
			margin: 0 auto;
		}
	}

	&__validating-promo {
		text-align: center;
		width: 100%;

		p {
			position: relative;
		}
	}

	&__error-text-container {
		.icon-wrapper {
			padding: 1rem 1rem 0.3rem;

			.wrapper {
				height: rem-calc(30);
				width: rem-calc(30);

				::v-deep .icon {
					fill: $kiva-accent-red;
				}
			}
		}
	}

	&__header {
		font-weight: bold;
		margin-top: rem-calc(20);
	}

	// &__body {
	// 	@include breakpoint(large) {
	// 		padding-right: 1rem;
	// 		@include featured-text();
	// 	}
	// }
}

</style>
