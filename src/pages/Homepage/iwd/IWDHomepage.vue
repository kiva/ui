<template>
	<www-page id="homepage"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<a class="hero" :href="primaryCtaUrl">
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
		</a>

		<section class="section intro">
			<!-- TODO: Url and tracking -->
			<kv-button :href="primaryCtaUrl" class="intro__cta cta">
				Support Women
			</kv-button>
			<p class="text-block">
				Over the past 14 years, the Kiva community has become a spark of hope and support for over 2.8 million
				ambitious, multi-tasking, powerful women in <br class="xxlu">98 countries, turning into a
				global movement. This incredible community has chosen to celebrate and empower women by funding over
				<br class="xxlu">$1 billion in loans to women borrowers <span class="no-wrap">over the years.</span>
			</p>
			<p class="text-block">
				Simply put, this is our norm. It’s our business as usual. <br class="xxlu">Make supporting women your
				#BusinessAsUsual, and join us <br class="xxlu">in our goal to fund the loans of every woman
				<span class="no-wrap"> on Kiva today.</span>
			</p>
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
		</section>

		<wavy-divider class="divider divider--indigo" />

		<section class="section profiles">
			<h2 class="headline profiles__headline">
				Women who are <span class="no-wrap">changing the world</span>
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
							Read {{ woman.name }}'s Story
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
				Support Women
			</kv-button>
			<h3 class="categories__subhead">
				Explore other categories
			</h3>
			<ul class="categories__list row">
				<li class="small-6 large-4 xlarge-3 columns" v-for="category in loanCategories" :key="category.id">
					<!-- TODO: tracking -->
					<a
						class="categories__link"
						:href="category.url"
					>
						<img
							class="categories__img"
							:src="category.image.url"
							alt=""
							width="218"
							height="122"
							loading="lazy"
							:srcset="
								`${category.image.url}${category.retinaImage.url
									? ', ' + category.retinaImage.url + ' 2x'
									: ''}`"
						>
						<span class="categories__title">{{ category.name.replace(' loans', '') }}</span>
					</a>
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
// import _get from 'lodash/get';

import iwdLoanChannelQuery from '@/graphql/query/iwdLoanChannels.graphql';
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

const getPdtDate = () => {
	const pdtOffsetHours = -8; // hours offset from UTC
	const clientOffsetHours = new Date().getTimezoneOffset() / 60;
	const offsetMs = (pdtOffsetHours + clientOffsetHours) * 60 * 60 * 1000;
	return new Date(Date.now() + offsetMs);
};

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
	inject: ['apollo'],
	data() {
		return {
			headerTheme: {
				backgroundColor: '#fff',
				linkColor: '#060f9f',
				linkHoverColor: '#a0e2ba',
				separatorColor: 'transparent'
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
			loanCategories: []
		};
	},
	apollo: {
		query: iwdLoanChannelQuery,
		preFetch: true,
		preFetchVariables() {
			return {
				ids: [83, 84, 85, 86, 87, 88, 89, 90], // Special loan categories for IWD
			};
		},
		result({ data }) {
			console.log(data);
			// this.loanCategories = _get(data, 'lend.loanChannelsById') || [];
			// TODO: Move loan data into lower environments so we can test properly
			/* eslint-disable max-len */
			this.loanCategories = [
				{
					id: 83,
					name: 'Africa loans',
					url: 'https://www.kiva.org/lend/africa-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/57b99142b5267f1a93e4999112205c6e.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/67eb44b7acec4c90e8103152a717dc91.jpg'
					}
				},
				{
					id: 84,
					name: 'Asia loans',
					url: 'https://www.kiva.org/lend/asia-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/bd9f73c1c00f66d173e4d5815c726603.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/0e3d5ff9b6201426341e10f545efc15b.jpg'
					}
				},
				{
					id: 85,
					name: 'Latin America loans',
					url: 'https://www.kiva.org/lend/latin-america-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/cdff38af8d862bda07264fcc443af30f.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/9d6490e3f14feb392f78fd9eb781f7cb.jpg'
					}
				},
				{
					id: 86,
					name: 'United States loans',
					url: 'https://www.kiva.org/lend/united-states-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/e81d5dd2df095ade44a36b00a9965157.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/89afab2326ccdb4ba9585d5199b93dcf.jpg'
					}
				},
				{
					id: 87,
					name: 'Agriculture loans',
					url: 'https://www.kiva.org/lend/agriculture-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/f68797e760d8d0b61b2e866fab72d174.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/1ac7934a5816c22b5248994319fd0263.jpg'
					}
				},
				{
					id: 88,
					name: 'Education loans',
					url: 'https://www.kiva.org/lend/education-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/ff9949b8a62ccb63b5f85ff50551efeb.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/fa05ac95ddded82d53a1e5de820044df.jpg'
					}
				},
				{
					id: 89,
					name: 'Arts loans',
					url: 'https://www.kiva.org/lend/arts-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/29d396d1008832da7e23be907650ecaf.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/0ce20fa361c78242cc226d53ac53e333.jpg'
					}
				},
				{
					id: 90,
					name: 'Eco-friendly loans',
					url: 'https://www.kiva.org/lend/eco-friendly-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/3e24bc6cf22a5be5f0dc766ff8251ef3.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/2116f8657fe23bc31cf54dfdb59413cb.jpg'
					}
				}
			];
			/* eslint-enable max-len */
		}
	},
	computed: {
		primaryCtaUrl() {
			const date = getPdtDate();
			const march8 = 1583654400000; // epoch time of march 8.
			return date.valueOf() < march8 ? '/monthly-good' : '/women';
		}
	}
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
	display: block;

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
		width: 32.25%;
		// height: 21%; // IE11
		bottom: 7.5%;
		right: 3.5%;
		z-index: 1;

		@include breakpoint('large') {
			bottom: auto;
			top: 7%;
			width: 25.5%;
			// height: 24%; // IE11
			right: 4.2%;
		}

		@include breakpoint('xxlarge') {
			// height: 31%; // IE11
		}
	}

	&__tagline {
		display: flex;
		flex-direction: column;
		width: 55%;
		position: absolute;
		left: 4.5%;
		bottom: 2.875%;
		// height: 8%; // IE11

		@include breakpoint('large') {
			align-items: flex-end;
			left: auto;
			right: 4.75%;
			width: 41.5%;
			height: 17%; // IE11
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
		margin-top: -4rem;
		margin-left: auto;
		margin-right: auto;
	}
}

.stats {
	background-color: $iwd-grey;
	font-weight: $global-weight-bold;

	&__list {
		list-style: none;
		margin: 4rem auto -3rem;
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
		// font-size: 1rem;
		font-weight: $global-weight-normal;
		padding: 0.75rem 0.5rem;
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
