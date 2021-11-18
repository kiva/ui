<template>
	<www-page id="homepage"
		class="lend-by-category-homepage"
	>
		<hero-slideshow
			v-if="heroPromoEnabled && heroPromoContent"
			:promo-enabled="heroPromoEnabled"
			:promo-content="heroPromoContent"
		/>
		<section
			v-if="!heroPromoEnabled || !heroPromoContent"
			class="featured-loans section"
		>
			<div class="row align-center">
				<div class="small-12 medium-10 large-6 xlarge-5 small-order-2 large-order-1 columns">
					<!-- <featured-loans-carousel :show-view-loan-cta="true" /> -->
					<no-click-loan-card />
				</div>
				<!-- eslint-disable-next-line max-len -->
				<div class="small-10 large-6 xlarge-7 small-order-1 large-order-2 align-self-middle columns featured-loans__cta_wrapper">
					<h1 class="featured-loans__header">
						Make a loan, <br class="so mo"> change a life.
					</h1>
					<p class="featured-loans__body">
						With Kiva you can lend as little as $25 and make a big change in someone's life.
					</p>
					<kv-button
						class="rounded"
						to="/lend-by-category"
						v-kv-track-event="[
							'Home',
							'click-hero-cta',
							'Find a borrower'
						]"
					>
						Find a borrower
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

		<!-- GROW-172 associated to the GROW-165 explicit lender preferences epic -->
		<!-- <section class="take-quiz section">
			<div class="row take-quiz__border">
				<div class="small-12 large-6 columns">
					<kv-responsive-image
						class="take-quiz__img"
						:images="takeQuizImgs.header"
						loading="lazy"
						alt=""
					/>
				</div>
				<div class="small-12 large-6 columns take-quiz__text-container">
					<h2 class="take-quiz__header">
						Find your first <br>borrower
					</h2>
					<p class="take-quiz__body">
						Take our 1-minute quiz based on causes you care about and
						we'll find the ideal person to support!
					</p>
					<kv-button
						:to="`/get-started`"
						class="smaller take-quiz__button"
						v-kv-track-event="[
							'Home',
							'click-quiz-card-cta',
							'Take quiz'
						]"
					>
						Take quiz
					</kv-button>
				</div>
			</div>
		</section> -->

		<section
			v-if="kivaCardPromoEnabled && kivaCardPromoContent"
			class="section"
		>
			<kiva-card-promo :promo-content="kivaCardPromoContent" />
		</section>

		<section class="how-it-works section text-center">
			<div class="row">
				<h2 class="how-it-works__header small-12 columns">
					How it works
				</h2>
				<p class="large-6 large-offset-3 columns">
					By lending as little as $25 on Kiva, you can support the causes you care
					about and make a real personal impact.
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
						Help fund a loan <br class="xxlu"> with as little as $25.
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
					<p>Kiva borrowers have a 96% repayment rate historically.</p>
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

		<section class="statistics section">
			<div class="small-12 columns">
				<kv-responsive-image
					class="statistics__img"
					:images="statistics"
					loading="lazy"
					alt=""
				/>
			</div>
			<div class="small-12 columns text-center">
				<h2 class="statistics__header">
					<span>100%</span>
					<span class="statistics__header-small">of your loan goes to the field.</span>
				</h2>
				<p class="statistics__body">
					We don't take a penny.
				</p>
			</div>

			<homepage-statistics
				v-if="statisticsContentfulContentGroup"
				:content="statisticsContentfulContentGroup"
			/>
		</section>

		<section class="lender-quotes section">
			<div class="row">
				<h2 class="lender-quotes__header text-center small-12 columns">
					What our lending <br class="so mo"> community thinks
				</h2>
				<div
					v-for="lenderQuote in lenderQuotes"
					:key="lenderQuote.name"
					:class="`quote-card small-10 medium-8 large-5 columns`"
					v-kv-track-event="[
						'homepage',
						'click-lender-testimonial',
						lenderQuote.attribution
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
						:to="`/lend-by-category`"
						v-kv-track-event="[
							'homepage',
							'click-bottom-cta',
							'Get started'
						]"
					>
						Get started
					</kv-button>
				</div>
			</div>
		</section>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import { settingEnabled } from '@/util/settingsUtils';
import { formatGenericContentBlock } from '@/util/contentfulUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '@/components/Kv/KvButton';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
// import FeaturedLoansCarousel from '@/components/Homepage/LendByCategory/FeaturedLoansCarousel';
import KivaCardPromo from '@/components/Homepage/LendByCategory/KivaCardPromo';
import LoanCategoriesSection from '@/components/Homepage/LendByCategory/LoanCategoriesSection';
import NoClickLoanCard from '@/components/Homepage/LendByCategory/NoClickLoanCard';
import HomepageStatistics from '@/components/Homepage/HomepageStatistics';
import HeroSlideshow from './HeroSlideshow';

const imgRequire = require.context('@/assets/images/lend-by-category-homepage/', true);

const promosQuery = gql`
	query promos {
		contentful {
			kivaCardPromo: entries(contentType: "uiSetting", contentKey: "ui-homepage-kiva-card-promo")
		}
	}
`;

export default {
	components: {
		WwwPage,
		// FeaturedLoansCarousel,
		HeroSlideshow,
		KivaCardPromo,
		KvButton,
		KvResponsiveImage,
		LoanCategoriesSection,
		NoClickLoanCard,
		HomepageStatistics,
	},
	inject: ['apollo', 'cookieStore'],
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
			heroPromoContent: null,
			heroPromoEnabled: false,
			kivaCardPromoEnabled: null,
			kivaCardPromoContent: null,
			statistics: [
				['small', imgRequire('./stats.png')],
				['small retina', imgRequire('./stats_2x.png')],
			],
			takeQuizImgs: {
				header: [
					['small', imgRequire('./potters.png')],
					['small retina', imgRequire('./potters_2x.png')],
				]
			},

		};
	},
	computed: {
		statisticsContentfulContentGroup() {
			return this.content?.page?.contentGroups?.homepageStatistics ?? null;
		}
	},
	apollo: {
		query: promosQuery,
		preFetch(config, client) {
			return client.query({ query: promosQuery });
		},
		result({ data }) {
			// Kiva Card section promo
			const kivaCardPromoData = data?.contentful?.kivaCardPromo?.items[0];
			if (kivaCardPromoData?.fields) {
				this.kivaCardPromoEnabled = settingEnabled(
					kivaCardPromoData.fields,
					'active',
					'startDate',
					'endDate'
				);
				if (this.kivaCardPromoEnabled) {
					const part1Content = kivaCardPromoData.fields.content[0];
					const part2Content = kivaCardPromoData.fields.content[1];

					const today = new Date();
					const part2ActivationDate = new Date(kivaCardPromoData.fields.dataObject.part2ActivationDate);

					this.kivaCardPromoContent = today < part2ActivationDate
						? formatGenericContentBlock(part1Content)
						: formatGenericContentBlock(part2Content);
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

// utils
.section {
	position: relative;
	padding: 2rem 0;

	@include breakpoint(large) {
		padding: 2rem 0;
	}
}

.featured-loans {
	padding: 2rem 0;

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

	&__header {
		@include large-text();

		@include breakpoint(xlarge) {
			@include huge-headline();
		}
	}

	&__body {
		@include medium-text();

		@include breakpoint(xlarge) {
			@include featured-text();

			max-width: 27rem;
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

.take-quiz {
	&__border {
		border-radius: 1rem;
		z-index: 1;
		box-shadow: 0 0 1.2rem 1rem rgb(153, 153, 153, 0.1);
		margin: 0 rem-calc(10);

		@include breakpoint(xga) {
			margin: 0 auto;
		}
	}

	&__img {
		margin: rem-calc(30) auto;
		width: rem-calc(240);

		@include breakpoint(large) {
			width: rem-calc(304);
		}

		@include breakpoint(xlarge) {
			width: rem-calc(345);
		}
	}

	&__text-container {
		text-align: center;
		@include breakpoint(large) {
			text-align: unset;
			margin: auto;
		}
	}

	&__header {
		font-weight: bold;
		margin-top: rem-calc(20);

		@include breakpoint(large) {
			@include large-text();
		}
	}

	&__body {
		@include breakpoint(large) {
			padding-right: 1rem;
			@include featured-text();
		}
	}

	&__button {
		border-radius: rem-calc(10);
		padding-left: rem-calc(50);
		padding-right: rem-calc(50);
		margin-bottom: rem-calc(40);
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

</style>
