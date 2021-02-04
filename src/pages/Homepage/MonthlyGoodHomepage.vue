<template>
	<div class="monthly-good-homepage">
		<section class="featured-loans section">
			<div class="row align-center">
				<div
					class="small-12 medium-10 large-6 xlarge-5 small-order-2 large-order-1 columns"
				>
					<router-link
						:to="heroButton.link"
						v-kv-track-event="[
							'homepage',
							'click-hero-loancards',
							heroImage.description,
						]"
					>
						<img
							v-if="heroImage.url"
							class="featured-loans__img"
							:src="heroImage.url"
							:alt="heroImage.description"
						>
					</router-link>
				</div>
				<!-- eslint-disable-next-line max-len -->
				<div class="small-10 large-6 xlarge-7 small-order-1 large-order-2 align-self-middle columns featured-loans__cta_wrapper">
					<h1 class="featured-loans__header" v-html="heroHeadline">
					</h1>
					<div class="featured-loans__body" v-html="heroBody">
					</div>
					<kv-button
						class="show-for-large rounded"
						:to="heroButton.link"
						v-kv-track-event="[
							'homepage',
							'click-hero-cta',
							heroButton.text,
						]"
					>
						{{ heroButton.text }}
					</kv-button>
				</div>
			</div>
			<!-- Button in different element order for mobile only -->
			<div class="row align-center hide-for-large">
				<div class="small-10">
					<kv-button
						class="rounded expanded"
						:to="heroButton.link"
						v-kv-track-event="[
							'homepage',
							'click-hero-cta',
							heroButton.text,
						]"
					>
						{{ heroButton.text }}
					</kv-button>
				</div>
			</div>
		</section>

		<section
			v-if="showMonthlyGoodSelectorSection"
			class="monthly-good-info section"
		>
			<div class="row align-center">
				<div class="small-10 large-12 columns">
					<h1 class="monthly-good-info__header" v-html="infoHeadline">
					</h1>
				</div>
			</div>
			<div class="row align-center">
				<div
					class="small-10 large-6 columns monthly-good-info__block"
				>
					<kv-icon
						class="monthly-good-info__icon-choose"
						name="choose"
					/>
					<div class="monthly-good-info__body" v-html="infoLeft">
					</div>
				</div>
				<div
					class="small-10 large-6 columns monthly-good-info__block"
				>
					<kv-icon
						class="monthly-good-info__icon-report"
						name="report"
					/>
					<div class="monthly-good-info__body" v-html="infoRight">
					</div>
				</div>
			</div>
		</section>

		<!-- MG Selector Desktop -->
		<section
			v-if="showMonthlyGoodSelectorSection"
			class="monthly-good-selector show-for-medium"
			:class="{ 'sticky': isSticky}"
			:style="{bottom: mgStickBarOffset + 'px'}"
		>
			<monthly-good-selector />
		</section>

		<!-- MG Selector Mobile -->
		<section
			v-if="showMonthlyGoodSelectorSection"
			class="monthly-good-selector section hide-for-large"
		>
			<div class="row align-center hide-for-large">
				<div class="small-10 columns">
					<kv-button
						class="classic hollow expanded"
						to="/monthlygood"
						v-kv-track-event="[
							'homepage',
							'click-mgpromo-cta',
							'Join today'
						]"
					>
						Join today <kv-icon
							class="right-arrow-icon"
							name="fat-chevron"
							:from-sprite="true"
							title="Next Loans"
						/>
					</kv-button>
				</div>
			</div>
		</section>

		<section class="loan-categories section">
			<div class="row">
				<div class="columns">
					<h2 class="loan-categories__header text-center">
						Support causes you care about.
					</h2>
					<loan-categories-section />
				</div>
			</div>
		</section>

		<section class="how-it-works section text-center">
			<div class="row">
				<h2 class="how-it-works__header small-12 columns">
					How it works
				</h2>
				<p class="large-6 large-offset-3 columns">
					By lending as little as $25 on Kiva, you can support the
					causes you care about and make a real personal impact.
				</p>
			</div>
			<ol class="how-it-works__list row">
				<li class="how-it-works__li small-12 xxlarge-3 columns">
					<kv-responsive-image
						class="how-it-works__img how-it-works__img--borrower"
						:images="howItWorksImgs.borrower"
						loading="lazy"
						alt=""
					/>
					<h3 class="how-it-works__subtitle">
						Choose a borrower
					</h3>
					<p>Browse by category and find an entrepeneur to support</p>
				</li>
				<li class="how-it-works__li small-12 xxlarge-3 columns">
					<kv-responsive-image
						class="how-it-works__img how-it-works__img--loan"
						:images="howItWorksImgs.loan"
						loading="lazy"
						alt=""
					/>
					<h3 class="how-it-works__subtitle">
						Make a loan
					</h3>
					<p>
						Help fund a loan <br class="xxlu">
						with as little as $25.
					</p>
				</li>
				<li class="how-it-works__li small-12 xxlarge-3 columns">
					<kv-responsive-image
						class="how-it-works__img how-it-works__img--repaid"
						:images="howItWorksImgs.repaid"
						loading="lazy"
						alt=""
					/>
					<h3 class="how-it-works__subtitle">
						Get repaid
					</h3>
					<p>
						Kiva borrowers have a 96% repayment rate historically.
					</p>
				</li>
				<li class="how-it-works__li small-12 xxlarge-3 columns">
					<kv-responsive-image
						class="how-it-works__img how-it-works__img--repeat"
						:images="howItWorksImgs.repeat"
						loading="lazy"
						alt=""
					/>
					<h3 class="how-it-works__subtitle">
						Repeat
					</h3>
					<p>Relend your money or withdraw your funds.</p>
				</li>
			</ol>
		</section>

		<section class="statistics section text-center">
			<div class="row">
				<div class="small-12 columns">
					<kv-responsive-image
						class="statistics__img"
						:images="statistics"
						loading="lazy"
						alt=""
					/>
				</div>
				<div class="small-12 columns">
					<h2 class="statistics__header">
						<span>100%</span>
						<span class="statistics__header-small">of your loan goes to the field.</span>
					</h2>
					<p class="statistics__body">
						We don't take a penny.
					</p>
				</div>
				<homepage-statistics />
			</div>
		</section>

		<section class="lender-quotes section">
			<div class="row">
				<h2 class="lender-quotes__header text-center small-12 columns">
					What our lending <br class="so mo">
					community thinks
				</h2>
				<div
					v-for="lenderQuote in lenderQuotes"
					:key="lenderQuote.name"
					:class="`quote-card small-10 medium-8 large-5 columns`"
					v-kv-track-event="[
						'homepage',
						'click-lender-testimonial',
						lenderQuote.attribution,
					]"
				>
					<img
						:src="lenderQuote.image"
						class="quote-card__lender-img"
						loading="lazy"
						:alt="lenderQuote.attribution"
					>
					<p class="quote-card__quote">
						{{ lenderQuote.quote }}
					</p>
					<p class="quote-card__attribution">
						{{ lenderQuote.attribution }},
					</p>
					<p class="quote-card__title">
						{{ lenderQuote.title }}
					</p>
				</div>
			</div>
		</section>

		<section class="final-cta section text-center">
			<div class="row">
				<div class="columns">
					<p class="final-cta__body">
						Make a loan today!
					</p>
					<kv-button
						class="rounded"
						:to="heroButton.link"
						v-kv-track-event="[
							'homepage',
							'click-bottom-cta',
							heroButton.text,
						]"
					>
						{{ heroButton.text }}
					</kv-button>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';

import KvButton from '@/components/Kv/KvButton';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import LoanCategoriesSection from '@/components/Homepage/LendByCategory/LoanCategoriesSection';
import MonthlyGoodSelector from '@/components/Homepage/MonthlyGoodSelector';
import KvIcon from '@/components/Kv/KvIcon';

import HomepageStatistics from './HomepageStatistics';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const imgRequire = require.context('@/assets/images/lend-by-category-homepage/', true);

export default {
	components: {
		HomepageStatistics,
		KvButton,
		KvIcon,
		KvResponsiveImage,
		LoanCategoriesSection,
		MonthlyGoodSelector,
	},
	props: {
		content: {
			type: Object,
			default() {
				return {
					page: {
						contentGroups: {},
						pageLayout: {}
					}
				};
			}
		},
	},
	data() {
		return {
			howItWorksImgs: {
				borrower: [
					['small', imgRequire('./how-it-works-borrower.png')],
					['small retina', imgRequire('./how-it-works-borrower_2x.png')],
				],
				loan: [
					['small', imgRequire('./how-it-works-loan.png')],
					['small retina', imgRequire('./how-it-works-loan_2x.png')],
				],
				repaid: [
					['small', imgRequire('./how-it-works-repaid.png')],
					['small retina', imgRequire('./how-it-works-repaid_2x.png')],
				],
				repeat: [
					['small', imgRequire('./how-it-works-repeat.png')],
					['small retina', imgRequire('./how-it-works-repeat_2x.png')],
				],
			},
			lenderQuotes: [
				{

					image: imgRequire('./lender-quote-heather.jpg'),
					// eslint-disable-next-line max-len
					quote: 'Being able to lend, then get repaid, and lend over and over again gives great satisfaction. My funds have been lent 12 times over.',
					attribution: 'Heather McLaughlin',
					title: 'Kiva lender',
					background: imgRequire('./lender-quote-card-texture-yellow.png'),
				},
				{
					image: imgRequire('./lender-quote-jenae.jpg'),
					// eslint-disable-next-line max-len
					quote: 'Just made my 11th loan to a single mother in Nicaragua. Constantly blown away by the impact from the same $25 being lent over and over again.',
					attribution: 'Jenae Journot',
					title: 'Kiva lender',
					background: imgRequire('./lender-quote-card-texture-red.png'),
				},
			],
			statistics: [
				['small', imgRequire('./stats.png')],
				['small retina', imgRequire('./stats_2x.png')],
			],
			isSticky: false,
			initialBottomPosition: 0,
			mgStickBarOffset: 0,
			showMonthlyGoodSelectorSection: false,
		};
	},
	computed: {
		heroContentGroup() {
			return this.content?.page?.contentGroups?.homepageHero ?? null;
		},
		heroText() {
			return this.heroContentGroup?.contents?.find(contentItem => contentItem.key === 'mg-homepage-hero-text');
		},
		heroImage() {
			const mediaObject = this.heroContentGroup?.media?.[0];
			return {
				title: mediaObject?.title ?? '',
				url: mediaObject?.file?.url ?? ''
			};
		},
		heroButton() {
			return {
				text: this.heroText?.primaryCtaText ?? '',
				link: this.heroText?.primaryCtaLink ?? '',
			};
		},
		heroHeadline() {
			return this.heroText?.headline ?? '';
		},
		heroBody() {
			const text = this.heroText?.bodyCopy ?? '';
			return documentToHtmlString(text).replace(/\n/g, '<br />');
		},
		infoContentGroup() {
			return this.content?.page?.contentGroups?.homepageContentBlock ?? null;
		},
		infoHeadline() {
			const content = this.infoContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'mg-homepage-info-text-header';
			});
			const text = content?.richText;
			// contentful wraps all richText fields with a <p> tag,
			// which makes them difficult to style as headers,
			// this removes that wrapping tag
			const options = {
				renderNode: {
					paragraph: (node, next) => `${next(node.content)}`
				}
			};
			return documentToHtmlString(text, options).replace(/\n/g, '<br />');
		},
		infoLeft() {
			const content = this.infoContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'mg-homepage-info-text-left';
			});
			const text = content?.richText;
			return documentToHtmlString(text).replace(/\n/g, '<br />');
		},
		infoRight() {
			const content = this.infoContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'mg-homepage-info-text-right';
			});
			const text = content?.richText;
			return documentToHtmlString(text).replace(/\n/g, '<br />');
		},
		throttledScroll() {
			// prevent onScroll from being called more than once every 100ms
			return _throttle(this.onScroll, 100);
		}
	},
	methods: {
		// Determine if MG desktop selector should be sticky or not
		onScroll() {
			if ((document.documentElement.scrollTop + window.innerHeight) <= this.initialBottomPosition) {
				this.isSticky = false;
			} else {
				this.isSticky = true;
				this.setMgStickyBarOffset();
			}
		},
		initStickyBehavior() {
			// Initial position down the page of element before mg selector element
			const { bottom } = this.$el.getElementsByClassName('monthly-good-info')[0].getBoundingClientRect();
			const heightOfMgSelector = this.$el.getElementsByClassName('monthly-good-selector')[0].offsetHeight;
			const scrollPositionOfPage = window.scrollY;

			this.initialBottomPosition = bottom + scrollPositionOfPage + heightOfMgSelector;
			this.onScroll();
		},
		setMgStickyBarOffset() {
			let offsetHeight = 0;
			const basketBar = document.getElementsByClassName('basket-bar')[0];
			const cookieBanner = document.getElementsByClassName('cookie-banner-container')[0];
			// Height of basket bar if present
			if (typeof basketBar !== 'undefined' && basketBar.clientHeight > 0) {
				offsetHeight = basketBar.clientHeight;
			}
			// Height of Cookie banner if present (overrides basket bar if present)
			if (typeof cookieBanner !== 'undefined' && cookieBanner.clientHeight > 0) {
				offsetHeight = cookieBanner.clientHeight;
			}
			// set offset
			this.mgStickBarOffset = offsetHeight;
		}
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.throttledScroll);
		window.removeEventListener('resize', _throttle(() => {
			this.initStickyBehavior();
		}, 200));
	},
	mounted() {
		window.addEventListener('scroll', this.throttledScroll);
		window.addEventListener('resize', _throttle(() => {
			this.initStickyBehavior();
		}, 200));
		this.initStickyBehavior();
	},
};
</script>
<style lang="scss">
@import 'settings';
// Hack to allow the entire footer to still be visible when the MG sticky is active
.www-footer {
	padding-bottom: 20rem;
	@include breakpoint(large) {
		padding-bottom: 15rem;
	}

	@include breakpoint(xlarge) {
		padding-bottom: 10rem;
	}

	@include breakpoint(xxlarge) {
		padding-bottom: 7rem;
	}
}
</style>

<style lang="scss" scoped>
@import "settings";

// utils
.section {
	position: relative;
	padding: 2rem 0;

	@include breakpoint(large) {
		padding: 2rem 0;
	}
}

.monthly-good-homepage {
	overflow: hidden;
}

.featured-loans,
.monthly-good-info {
	&__header {
		font-size: rem-calc(48);
		line-height: rem-calc(54);
		font-weight: 500;

		@include breakpoint(xlarge) {
			@include huge-headline();
		}

		// This text field from contentful can include an em tag or an i tag
		::v-deep em,
		::v-deep i {
			font-style: normal;
			color: $kiva-green;
		}
	}

	&__body {
		::v-deep p {
			@include medium-text();

			@include breakpoint(xlarge) {
				@include featured-text();

				line-height: rem-calc(36);
			}
		}
	}
}

.monthly-good-info {
	&__block {
		display: flex;
		margin-top: 1.75rem;
	}

	&__icon-report,
	&__icon-choose {
		margin-top: 0.65rem;
		flex-shrink: 0;
	}

	&__icon-choose {
		height: rem-calc(56);
		width: rem-calc(56);
	}

	&__icon-report {
		height: rem-calc(56);
		width: rem-calc(56);
	}

	&__body {
		padding: 0 0.75rem 1rem 1.5rem;
		flex-grow: 1;
	}
}

.featured-loans {
	padding: 2rem 0;

	@include breakpoint(large) {
		padding: 4rem 0 2rem;
	}

	&__cta_wrapper {
		padding: 0;

		@include breakpoint(medium) {
			padding: 0 2rem;
		}
	}

	&__img {
		display: block;
		margin: 0 auto 2rem;

		@include breakpoint(large) {
			margin: 0 auto;
		}
	}

	&__body {
		margin: 2.25rem auto 0;

		@include breakpoint(medium) {
			margin: 2.25rem auto 2.25rem;
		}
	}
}

.loan-categories {
	& .row {
		max-width: 69.15rem;
	}

	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}

.how-it-works {
	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	&__list {
		list-style: none;
		margin-top: 1rem;
		margin-bottom: 0;
		padding: 0;
	}

	&__li {
		margin-bottom: 1rem;
	}

	&__img {
		width: rem-calc(81);
		height: rem-calc(100);
		margin: 0 auto 1rem;

		&--borrower {
			width: rem-calc(81);
		}

		&--loan {
			width: rem-calc(124);
		}

		&--repaid {
			width: rem-calc(87);
		}

		&--repeat {
			width: rem-calc(94);
		}
	}

	&__subtitle {
		font-weight: bold;

		@include breakpoint(large) {
			@include featured-text();
		}
	}
}

.statistics {
	&__img {
		width: rem-calc(235);
		margin: 0 auto 1rem;
	}

	&__header {
		font-size: 6rem;
		font-weight: bold;
		margin-bottom: 0;

		span {
			display: block;
		}
	}

	&__header-small {
		@include featured-text();

		font-weight: $global-weight-normal;
	}

	&__body {
		@include featured-text();

		margin-bottom: rem-calc(30);
	}
}

.lender-quotes {
	&__header {
		margin-bottom: 2rem;
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	.quote-card {
		@include featured-text();

		margin: 0 auto rem-calc(25) auto;
		text-align: center;
		border-radius: 1rem;
		background: $white;
		box-shadow: 0 0 1.2rem 1rem rgb(153, 153, 153, 0.1);
		position: relative;
		overflow: hidden;
		z-index: 1;

		@include breakpoint(large) {
			@include medium-text();
		}

		&__lender-img {
			margin: rem-calc(30) auto rem-calc(30) auto;
			width: 5.5rem;
			border-radius: 50%;

			@include breakpoint(large) {
				width: 4rem;
			}
		}

		&__quote {
			line-height: 1.3;
			margin-bottom: rem-calc(30);
		}

		&__attribution {
			line-height: 1.3;
			font-weight: bold;
			margin-bottom: 0;
			position: relative;
		}

		&__title {
			position: relative;
			margin-bottom: rem-calc(30);
		}
	}

	.quote-card:nth-child(even) {
		@include breakpoint(large) {
			margin-right: 0.9rem;
		}
	}

	.quote-card:nth-child(odd) {
		@include breakpoint(large) {
			margin-left: 0.9rem;
		}
	}
}

.final-cta {
	&__body {
		@include featured-text();

		margin-bottom: 1rem;

		@include breakpoint(large) {
			@include impact-text();

			font-weight: 300;
			margin-bottom: 2rem;
		}
	}
}

.monthly-good-selector {
	border-radius: rem-calc(20) rem-calc(20) 0 0;
	background-color: $white;

	&.sticky {
		position: fixed;
		bottom: 0;
		transition: bottom 0.4s;
		z-index: 1000;
		width: 100%;
		box-shadow: 0 -5px 80px rgba(0, 0, 0, 0.1);
	}

	.right-arrow-icon {
		width: rem-calc(21);
		height: rem-calc(23);
		transform: rotate(270deg);
		fill: $kiva-green;
		margin: 0 20px;
		position: absolute;
	}
}
</style>
