<template>
	<www-page id="homepage"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="hero">

			<kv-responsive-image2
				:images="heroImageSet"
				alt=""
			/>
			<div class="hero__text-wrapper">
				<iwd-flag class="hero__iwd-flag" />
				<div class="hero__tagline">
					<iwd-celebrating-her-every-day class="hero__tagline-head" />
					<iwd-business-as-usual class="hero__tagline-subhead" />
				</div>
			</div>
		</div>

		<section class="section intro">
			<p class="text-block">
				Over the past 14 years, the Kiva community has become a spark of hope and support for over 2.8 million
				ambitious, multi-tasking, powerful women in 98 countries, turning into a global movement.
				This incredible community has chosen to celebrate and empower women by funding over $1 billion
				in loans to women borrowers over the years.
			</p>
			<p class="text-block">
				Simply put, this is our norm. It’s our business as usual. Make supporting women your
				#BusinessAsUsual, and join us in our goal to fund the loans of every woman on Kiva today.
			</p>
			<!-- TODO: Url and tracking -->
			<kv-button class="intro__cta cta">
				Support women
			</kv-button>
		</section>

		<section class="section stats">
			<p class="text-block">
				Founded in 2005, Kiva is an international nonprofit based in San Francisco, with a mission
				to expand financial	access to underserved communities. Because women entrepreneurs often
				face more difficulty accessing financing than their male peers, Kiva loans help them access
				resources they need to succeed:
			</p>
			<ul class="row stats__list">
				<li class="small-12 large-6 xxlarge-3 columns stat-block">
					<number-loans-funded class="stat-block__number stat-block__number--loans-funded" />
					<span class="stat-block__text">loans funded to women</span>
				</li>
				<li class="small-12 large-6 xxlarge-3 columns stat-block">
					<number-to-the-field class="stat-block__number stat-block__number--to-the-field" />
					<span class="stat-block__text">goes to the field</span>
				</li>
				<li class="small-12 large-6 xxlarge-3 columns stat-block">
					<number-repayment class="stat-block__number stat-block__number--loan-repayment" />
					<span class="stat-block__text">loan repayment rate</span>
				</li>
				<li class="small-12 large-6 xxlarge-3 columns stat-block">
					<number-countries class="stat-block__number stat-block__number--countries" />
					<span class="stat-block__text">countries supported</span>
				</li>
			</ul>
			<!-- TODO: Url and tracking -->
			<kv-button class="cta">
				Learn more
			</kv-button>
		</section>

		<wavy-divider class="divider divider--indigo" />

		<section class="section profiles">
			<h2 class="headline profiles__headline">
				Women who are changing the world
			</h2>
			<ul class="profiles__list">
				<li class="profiles__li" v-for="woman in featuredWomen" :key="woman.url">
					<!-- TODO: Tracking -->
					<router-link
						class="profiles__link"
						:to="woman.url"
					>
						<img
							class="profiles__img"
							:src="woman.img[0]"
							:srcset="`${woman.img[1]} 2x`"
							alt=""
							width="255"
							height="255"
							loading="lazy"
						>
					</router-link>
					<div>
						<p class="profiles__text" v-html="woman.text"></p>
						<!-- TODO: Tracking -->
						<kv-button class="cta" :to="woman.url">
							Read {{ woman.name }}'s story
						</kv-button>
					</div>
				</li>
			</ul>
		</section>

		<wavy-divider class="divider divider--white" />

		<section class="section categories">
			<h2 class="headline">
				Ready to get started?
			</h2>
			<p class="text-block">
				Join over 1.8 million individuals who have helped more than 2 million women around
				the world create opportunity for themselves, their families, and their communities.
			</p>
			<!-- TODO: Url and tracking -->
			<kv-button class="cta categories__cta">
				Support women
			</kv-button>
			<h3 class="categories__subhead">
				Explore other categories
			</h3>
			<ul class="categories__list row">
				<li class="small-6 large-4 xlarge-3 columns" v-for="category in loanCategories" :key="category.url">
					<!-- TODO: tracking -->
					<router-link
						class="categories__link"
						:to="category.url"
					>
						<img
							class="categories__img"
							:src="category.img"
							alt=""
							width="255"
							height="255"
							loading="lazy"
						>
						<span class="categories__title">{{ category.title }}</span>
					</router-link>
				</li>
			</ul>
		</section>

		<wavy-divider class="divider divider--aqua" />
		<iwd-flag class="dividing-flag" />

		<section class="section partners">
			<h2 class="headline">
				Our International Women’s Day partners
			</h2>
			<ul class="partners__list row">
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo"
						src="@/assets/images/iwd/partner-fossil.svg"
						alt="Fossil Foundation"
						loading="lazy"
					>
				</li>
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo partners__logo--ebay"
						src="@/assets/images/iwd/partner-ebay.svg"
						alt="eBay"
						loading="lazy"
					>
				</li>
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo"
						src="@/assets/images/iwd/partner-boa.svg"
						alt="Bank of America"
						loading="lazy"
					>
				</li>
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo"
						src="@/assets/images/iwd/partner-wage.svg"
						alt="Women and Girls Empowered"
						loading="lazy"
					>
				</li>
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo partners__logo--visa"
						src="@/assets/images/iwd/partner-visa.png"
						alt="Visa Foundation"
						loading="lazy"
					>
				</li>
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo"
						src="@/assets/images/iwd/partner-cartier.svg"
						alt="Cartier"
						loading="lazy"
					>
				</li>
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo"
						src="@/assets/images/iwd/partner-sp-global.svg"
						alt="S&amp;P Global Foundation"
						loading="lazy"
					>
				</li>
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo"
						src="@/assets/images/iwd/partner-grameen.svg"
						alt="Grameen Foundation"
						loading="lazy"
					>
				</li>
				<li class="partners__li small-6 large-4 columns">
					<img
						class="partners__logo"
						src="@/assets/images/iwd/partner-principle.svg"
						alt="Principle Foundation"
						loading="lazy"
					>
				</li>
			</ul>
		</section>

		<wavy-divider class="divider divider--white" />

		<img class="globe"
			src="@/assets/images/iwd/globe.png"
			srcset="
				@/assets/images/iwd/globe.png,
				@/assets/images/iwd/globe_2x.png 2x"
			width="266"
			height="164"
			alt=""
			loading="lazy"
		>
	</www-page>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvResponsiveImage2 from '@/components/Kv/KvResponsiveImage2';
import WwwPage from '@/components/WwwFrame/WwwPage';

import IwdFlag from '@/assets/inline-svgs/iwd/iwd-flag.svg';
import IwdCelebratingHerEveryDay from '@/assets/inline-svgs/iwd/iwd-celebrating-her-every-day.svg';
import IwdBusinessAsUsual from '@/assets/inline-svgs/iwd/iwd-business-as-usual.svg';
import NumberLoansFunded from '@/assets/inline-svgs/iwd/number-loans-funded.svg';
import NumberToTheField from '@/assets/inline-svgs/iwd/number-to-the-field.svg';
import NumberRepayment from '@/assets/inline-svgs/iwd/number-repayment.svg';
import NumberCountries from '@/assets/inline-svgs/iwd/number-countries.svg';
import WavyDivider from '@/assets/inline-svgs/iwd/wavy-divider.svg';

const iwdImagesRequire = require.context('@/assets/images/iwd/', true);

export default {
	components: {
		KvButton,
		KvResponsiveImage2,
		WwwPage,
		IwdFlag,
		IwdCelebratingHerEveryDay,
		IwdBusinessAsUsual,
		NumberLoansFunded,
		NumberToTheField,
		NumberRepayment,
		NumberCountries,
		WavyDivider,
	},
	data() {
		return {
			headerTheme: {
				backgroundColor: '#fff',
				linkColor: '#060f9f',
				separatorColor: '#a0e2ba'
			},
			footerTheme: {
				backgroundColor: '#fff',
				textColor: '#484848',
				linkColor: '#060f9f',
				separatorColor: '#a0e2ba'

			},
			heroImageSet: [
				['small', iwdImagesRequire('./banner_sm.png')],
				['small retina', iwdImagesRequire('./banner_sm_2x.png')],
				['medium', iwdImagesRequire('./banner_md.png')],
				['medium retina', iwdImagesRequire('./banner_md_2x.png')],
				['large', iwdImagesRequire('./banner_lg.png')],
				['large retina', iwdImagesRequire('./banner_lg_2x.png')],
				['xga', iwdImagesRequire('./banner_xga.png')],
				['xga retina', iwdImagesRequire('./banner_xga_2x.png')],
				['wxga', iwdImagesRequire('./banner_wxga.png')],
				['wxga retina', iwdImagesRequire('./banner_wxga_2x.png')],
			],
			featuredWomen: [
				{
					name: 'Abigail',
					text: `
						<strong>Abigail</strong> is an entrepreneur in Ghana who is dedicated
						to giving community children a brighter future.`,
					url: '/blog/abigail-takes-action-to-affect-change-in-ghana',
					img: [
						[iwdImagesRequire('./profile-abigail.jpg')],
						[iwdImagesRequire('./profile-abigail_2x.jpg')],
					]
				},
				{
					name: 'Estefania',
					text: `
						<strong>Estefania</strong> is a small business owner and farmer in
						Peru who used a Kiva loan to continue her mother’s legacy.`,
					url: 'blog/like-mother-like-daughter-the-story-of-a-kiva-loan-in-peru',
					img: [
						[iwdImagesRequire('./profile-estefania.jpg')],
						[iwdImagesRequire('./profile-estefania_2x.jpg')],
					]
				},
				{
					name: 'Tinatin',
					text: `
						<strong>Tinatin</strong> is a Georgian student, wife, and mother
						who took the initiative to find the means to acquire a higher education.`,
					url: '/blog/tinatin-reflects-georgias-motivation-for-education',
					img: [
						[iwdImagesRequire('./profile-tinatin.jpg')],
						[iwdImagesRequire('./profile-tinatin_2x.jpg')],
					]
				},
			],
			loanCategories: [ // TODO: Get urls and images
				{
					title: 'Africa',
					url: '#',
					img: 'https://www-kiva-org-0.freetls.fastly.net/img/orig/bd25843149e68a42a681f4bc00a660b8.jpg',
				},
				{
					title: 'Asia',
					url: '#',
					img: 'https://www-kiva-org-0.freetls.fastly.net/img/orig/bd25843149e68a42a681f4bc00a660b8.jpg',
				},
				{
					title: 'Latin America',
					url: '#',
					img: 'https://www-kiva-org-0.freetls.fastly.net/img/orig/bd25843149e68a42a681f4bc00a660b8.jpg',
				},
				{
					title: 'United States',
					url: '#',
					img: 'https://www-kiva-org-0.freetls.fastly.net/img/orig/bd25843149e68a42a681f4bc00a660b8.jpg',
				},
				{
					title: 'Agriculture',
					url: '#',
					img: 'https://www-kiva-org-0.freetls.fastly.net/img/orig/bd25843149e68a42a681f4bc00a660b8.jpg',
				},
				{
					title: 'Education',
					url: '#',
					img: 'https://www-kiva-org-0.freetls.fastly.net/img/orig/bd25843149e68a42a681f4bc00a660b8.jpg',
				},
				{
					title: 'Arts',
					url: '#',
					img: 'https://www-kiva-org-0.freetls.fastly.net/img/orig/bd25843149e68a42a681f4bc00a660b8.jpg',
				},
				{
					title: 'Environment',
					url: '#',
					img: 'https://www-kiva-org-0.freetls.fastly.net/img/orig/bd25843149e68a42a681f4bc00a660b8.jpg',
				},
			]
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'foundation';

$iwd-indigo: #060f9f;
$iwd-salmon: #ff8672;
$iwd-orangered: #fc4501;
$iwd-yellow: #ffd700;
$iwd-aqua: #a0e2ba;
$iwd-light-aqua: #d9f3e3;
$iwd-grey: #ebebeb;

$divider-height: 3rem;

.page-content {
	padding: 1.625rem 0;
}

.section {
	text-align: center;
	padding: 5rem 0 #{5rem + $divider-height} 0;
	font-size: rem-calc(19);
}

.cta {
	@include button-style($iwd-orangered, auto, #fff);

	box-shadow: 0 2px darken($iwd-orangered, 10%); // overwride blue foundation box-shadow
	text-transform: uppercase;
	border-radius: rem-calc(4);
	font-size: $normal-text-font-size;
	font-weight: $global-weight-bold;
	width: rem-calc(255);
	max-width: 100%;
	margin-top: 0.5rem;
	padding-left: 0.5rem;
	padding-right: 0.5rem;
}

.text-block {
	max-width: 55rem;
	padding: 0 1rem;
	line-height: 1.4;
	margin: 0 auto 1.5rem;
}

.headline {
	font-weight: $global-weight-bold;
	margin-bottom: 3rem;
	font-size: 2rem;
}

.divider {
	display: block;
	width: 100%;
	margin-top: -1 * $divider-height;
	height: $divider-height;

	&--white {
		fill: #fff;
	}

	&--indigo {
		fill: $iwd-indigo;
	}

	&--aqua {
		fill: $iwd-light-aqua;
	}
}

.dividing-flag {
	fill: $iwd-indigo;
	width: rem-calc(300);
	height: rem-calc(165); // IE 11
	display: block;
	position: absolute;
	left: 50%;
	transform: translate(-50%, -62%);
}

// PAGE BLOCKS
.hero {
	background-color: $iwd-salmon;
	position: relative;

	// Copypasta from KV-HERO
	height: 0;
	padding-bottom: 600/480 * 100%;

	@include breakpoint(medium) {
		padding-bottom: 675/680 * 100%;
	}

	@include breakpoint(large) {
		padding-bottom: 545/1024 * 100%;
	}

	@include breakpoint(xga) {
		padding-bottom: 768/1440 * 100%;
	}

	@include breakpoint(wxga) {
		padding-bottom: 820/1920 * 100%;
	}
	// end copypasta

	&__text-wrapper {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	&__iwd-flag {
		fill: #fff;
		position: absolute;
		width: 46.25%;
		height: 21%; // IE11
		bottom: 7.5%;
		right: 3.5%;
		z-index: 1;

		@include breakpoint('xlarge') {
			bottom: auto;
			top: 7%;
			width: 23.5%;
			height: 24%; // IE11
			right: 4.2%;
		}

		@include breakpoint('xxlarge') {
			height: 31%; // IE11
		}
	}

	&__tagline {
		display: flex;
		flex-direction: column;
		width: 55%;
		position: absolute;
		left: 4.5%;
		bottom: 2.875%;
		height: 8%; // IE11

		@include breakpoint('xlarge') {
			align-items: flex-end;
			left: auto;
			right: 4.75%;
			width: 46.5%;
			height: 17%; // IE11
			bottom: 7.5%;
		}
	}

	&__tagline-head {
		fill: $iwd-indigo;
		width: 100%;
		margin-bottom: 4%;
	}

	&__tagline-subhead {
		fill: #fff;
		width: 71%;
	}
}

.intro {
	background-color: $iwd-salmon;
	color: #fff;
	padding: 4rem 0;
	font-weight: $global-weight-bold;

	@include breakpoint('large') {
		font-size: $featured-text-font-size;
	}

	&__cta {
		@include button-style($iwd-indigo, auto, #fff);

		box-shadow: 0 2px darken($iwd-indigo, 10%); // overwride blue foundation box-shadow
	}
}

.stats {
	background-color: $iwd-grey;
	font-weight: $global-weight-bold;

	&__list {
		list-style: none;
		margin: 4rem auto 0;
	}
}

.stat-block {
	margin-bottom: 2rem;

	&::after { // Underline. It isn't full width so we can't use border on the parent.
		content: '';
		display: block;
		border-bottom: 1px solid $iwd-salmon;
		margin: 2rem auto 0;
		width: 55%;
	}

	&:last-child {
		&::after {
			display: none;
		}
	}

	@include breakpoint('large') {
		margin-bottom: 4rem;

		&::after {
			display: none;
		}
	}

	&__number {
		display: block;
		fill: $iwd-indigo;
		margin: 0 auto;

		&--to-the-field {
			width: rem-calc(167.19);
			height: rem-calc(52.13); // IE11
		}

		&--loans-funded {
			width: rem-calc(185.042);
			height: rem-calc(66.25); // IE11
			margin-top: rem-calc(-6);
			margin-bottom: rem-calc(-8);
		}

		&--loan-repayment {
			width: rem-calc(131.84);
			height: rem-calc(52.13); // IE11
		}

		&--countries {
			width: rem-calc(71.43);
			height: rem-calc(52.13); // IE11
		}
	}

	&__text {
		display: block;
		margin-top: 0.5rem;
	}
}

.profiles {
	background-color: $iwd-indigo;
	color: #fff;

	&__headline {
		color: $iwd-salmon;
	}

	&__list {
		list-style: none;
		margin: 0 auto -4rem;
		display: flex;
		max-width: 61.875rem;
		flex-flow: row wrap;
	}

	&__li {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 4rem;

		@include breakpoint('large') {
			flex-direction: row;
		}

		@include breakpoint('xxlarge') {
			flex-direction: column;
			flex-basis: 33%;
			padding-right: 0.9375rem;
			padding-left: 0.9375rem;
		}
	}

	&__img {
		width: 100%;
		height: auto;
		transform: scale(1);
		transition: transform 0.25s ease;
		flex-shrink: 0;
	}

	&__text {
		font-size: 1rem;
		font-weight: $global-weight-normal;
		padding: 0.75rem 1.5rem;
		margin-bottom: 0.25rem;
		line-height: 1.3;
		display: block;
	}

	&__link {
		display: block;
		overflow: hidden;
		text-decoration: none;
		background-color: $iwd-grey;
		color: $body-font-color;
		border-radius: 50%;
		width: rem-calc(255);
		margin: 0 1rem 0.5rem;
		flex-shrink: 0;

		&:hover,
		&:focus {
			.profiles__img {
				transform: scale(1.1);
			}
		}
	}
}

.categories {
	background-color: #fff;

	&__cta {
		margin-bottom: 3rem;
	}

	&__subhead {
		font-weight: $global-weight-bold;
		margin: 2rem 0;
	}

	&__list {
		list-style: none;
		margin-bottom: 3rem;
	}

	&__img {
		width: 100%;
		height: auto;
		transform: scale(1);
		transition: transform 0.25s ease;
	}

	&__title {
		text-transform: uppercase;
		padding: 0.75rem;
		font-size: 1rem;
		display: block;
		font-weight: $global-weight-bold;
		position: relative;
		background-color: $iwd-grey;
	}

	&__link {
		display: block;
		overflow: hidden;
		margin-bottom: map-get($grid-margin-gutters, medium);
		text-decoration: none;
		background-color: $iwd-grey;
		color: $body-font-color;

		&:hover,
		&:focus {
			background-color: $iwd-orangered;

			.categories__img {
				transform: scale(1.1);
			}

			.categories__title {
				background-color: $iwd-orangered;
				color: #fff;
			}
		}

		&:active {
			.categories__title {
				background-color: $iwd-indigo;
			}
		}
	}
}

.partners {
	background-color: $iwd-light-aqua;

	&__list {
		list-style: none;
		margin-bottom: 2rem;
		filter: grayscale(100%); // TODO: If we're positive we're grayscaling all the logos we should do so in SVG
	}

	&__li {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 1rem;
		padding-bottom: 1rem;

		@include breakpoint('large') {
			&:nth-of-type(3n + 1) { // first column
				justify-content: flex-start;
			}

			&:nth-of-type(3n + 3) { // last column
				justify-content: flex-end;
			}
		}
	}

	&__logo {
		width: 66%;
		height: auto;

		&--ebay {
			width: 50%;
		}

		&--visa {
			width: 45%;
			opacity: 0.7;
		}
	}
}

.globe {
	width: rem-calc(266);
	display: block;
	margin: -6rem auto 4rem;
}

</style>
