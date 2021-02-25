<template>
	<www-page id="homepage"
		class="page-content"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<a
			class="hero"
			:href="primaryCtaUrl"
			v-kv-track-event="[
				'homepage',
				'click-IWD2020-hero',
				'homepage-iwd2020-hero-banner-image'
			]"
		>
			<kv-responsive-image
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
			<kv-button
				:href="primaryCtaUrl"
				class="intro__cta cta"
				v-kv-track-event="[
					'homepage',
					'click-IWD2020-hero',
					'homepage-iwd2020-hero-cta-btn'
				]"
			>
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
					<span class="stat-block__text">loans funded</span>
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
			<flourish-flags2 class="stats__flags" />
			<flourish-shape-lines class="stats__divider-flourish" />
		</section>

		<wavy-divider class="divider divider--indigo" />

		<section class="section profiles">
			<h2 class="headline profiles__headline">
				Women who are <span class="no-wrap">changing the world</span>
			</h2>
			<ul class="profiles__list">
				<li class="profiles__li" v-for="(woman, index) in featuredWomen" :key="woman.url">
					<router-link
						class="profiles__link"
						:to="woman.url"
						:v-kv-track-event="[
							'homepage',
							`click-IWD2020-story-${index}`,
							'homepage-iwd2020-story-image'
						]"
					>
						<div class="profiles__img-wrapper">
							<img
								class="profiles__img"
								:src="woman.img[0]"
								:srcset="`${woman.img[1]} 2x`"
								:alt="woman.name"
								width="255"
								height="255"
								loading="lazy"
							>
						</div>
						<component
							:is="woman.flourishComponent"
							class="profiles__flourish"
							:class="`profiles__flourish--${index}`"
						/>
					</router-link>
					<div class="profiles__text-wrapper">
						<p class="profiles__text" v-html="woman.text"></p>
						<kv-button
							class="cta"
							:to="woman.url"
							:v-kv-track-event="[
								'homepage',
								`click-IWD2020-story-${index}`,
								'homepage-iwd2020-story-cta'
							]"
						>
							Read {{ woman.name }}'s Story
						</kv-button>
					</div>
				</li>
			</ul>
			<flourish-shape-lines-2 class="profiles__divider-flourish" />
		</section>

		<wavy-divider class="divider divider--white" />

		<section class="section categories">
			<h2 class="headline">
				Ready to get started?
			</h2>
			<p class="categories__body-text text-block">
				Join over 1.8 million individuals who have helped more than 2 million women around
				the world create opportunity for themselves, their families, and their communities.
			</p>
			<flourish-flags class="categories__flags" />
			<kv-button
				:href="primaryCtaUrl"
				class="cta categories__cta"
				v-kv-track-event="[
					'homepage',
					'click-IWD2020-get-started',
					'homepage-iwd2020-get-started-cta'
				]"
			>
				Support Women
			</kv-button>
			<div class="categories__subhead-wrapper">
				<flourish-shapes-3 class="categories__subhead-flourish" />
				<h3 class="categories__subhead">
					Explore other categories
				</h3>
				<flourish-shapes-5 class="categories__subhead-flourish-2" />
			</div>
			<ul class="categories__list row">
				<li class="small-6 large-4 xlarge-3 columns" v-for="category in loanCategories" :key="category.id">
					<a
						class="categories__link"
						:href="category.url"
						:v-kv-track-event="[
							'homepage',
							'click-IWD2020-category-card',
							`homepage-iwd2020-category-${category.name.replace(' ', '-')}`
						]"
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
import { iwdHeaderTheme, iwdFooterTheme } from '@/util/siteThemes';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '@/components/Kv/KvButton';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

import IwdFlag from '@/assets/inline-svgs/iwd/iwd-flag.svg';
import IwdCelebratingHerEveryDay from '@/assets/inline-svgs/iwd/iwd-celebrating-her-every-day.svg';
import IwdBusinessAsUsual from '@/assets/inline-svgs/iwd/iwd-business-as-usual.svg';

import FlourishCurrency from '@/assets/inline-svgs/iwd/flourish-currency.svg';
import FlourishFlags from '@/assets/inline-svgs/iwd/flourish-flags.svg';
import FlourishFlags2 from '@/assets/inline-svgs/iwd/flourish-flags2.svg';
import FlourishShapeLines from '@/assets/inline-svgs/iwd/flourish-shape-lines.svg';
import FlourishShapeLines2 from '@/assets/inline-svgs/iwd/flourish-shape-lines2.svg';
import FlourishShapes from '@/assets/inline-svgs/iwd/flourish-shapes.svg';
import FlourishShapes2 from '@/assets/inline-svgs/iwd/flourish-shapes2.svg';
import FlourishShapes3 from '@/assets/inline-svgs/iwd/flourish-shapes3.svg';
import FlourishShapes4 from '@/assets/inline-svgs/iwd/flourish-shapes4.svg';
import FlourishShapes5 from '@/assets/inline-svgs/iwd/flourish-shapes5.svg';

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
		WwwPage,
		KvButton,
		KvResponsiveImage,
		IwdFlag,
		IwdCelebratingHerEveryDay,
		IwdBusinessAsUsual,
		FlourishFlags,
		FlourishFlags2,
		FlourishCurrency,
		FlourishShapeLines,
		FlourishShapeLines2,
		FlourishShapes,
		FlourishShapes2,
		FlourishShapes3,
		FlourishShapes4,
		FlourishShapes5,
		NumberLoansFunded,
		NumberToTheField,
		NumberRepayment,
		NumberCountries,
		WavyDivider,
	},
	data() {
		return {
			headerTheme: iwdHeaderTheme,
			footerTheme: iwdFooterTheme,
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
					],
					flourishComponent: FlourishShapes2
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
					],
					flourishComponent: FlourishCurrency
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
					],
					flourishComponent: FlourishShapes2
				},
			],
			/* eslint-disable max-len */
			loanCategories: [
				{
					id: 83,
					name: 'Africa loans',
					url: '/lend-by-category/africa-loans',
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
					url: '/lend-by-category/asia-loans',
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
					url: '/lend-by-category/latin-america-loans',
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
					url: '/lend-by-category/united-states-loans',
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
					url: '/lend-by-category/agriculture-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/f68797e760d8d0b61b2e866fab72d174.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/1ac7934a5816c22b5248994319fd0263.jpg'
					}
				},
				// {
				// 	id: 88,
				// 	name: 'Education loans',
				// 	url: '/lend-by-category/education-loans',
				// 	image: {
				// 		url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/ff9949b8a62ccb63b5f85ff50551efeb.jpg'
				// 	},
				// 	retinaImage: {
				// 		url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/fa05ac95ddded82d53a1e5de820044df.jpg'
				// 	}
				// },
				{
					id: 92,
					name: 'Food loans',
					url: '/lend-by-category/food-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/bb0b709ba2f7638034e5cb7f84ccbc58.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/ebf791cbbe4c0aa09b4e998a877d35a2.jpg'
					}
				},
				// {
				// 	id: 89,
				// 	name: 'Arts loans',
				// 	url: '/lend-by-category/arts-loans',
				// 	image: {
				// 		url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/29d396d1008832da7e23be907650ecaf.jpg'
				// 	},
				// 	retinaImage: {
				// 		url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/0ce20fa361c78242cc226d53ac53e333.jpg'
				// 	}
				// },
				{
					id: 94,
					name: 'Retail loans',
					url: '/lend-by-category/retail-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/5fc167e0ba23640ccef9ca91d1bb978f.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/d4df79ad89ff6cced71662f7887b9b60.jpg'
					}
				},
				// {
				// 	id: 90,
				// 	name: 'Eco-friendly loans',
				// 	url: '/lend-by-category/eco-friendly-loans',
				// 	image: {
				// 		url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/3e24bc6cf22a5be5f0dc766ff8251ef3.jpg'
				// 	},
				// 	retinaImage: {
				// 		url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/2116f8657fe23bc31cf54dfdb59413cb.jpg'
				// 	}
				// },
				{
					id: 93,
					name: 'Shelter loans',
					url: '/lend-by-category/shelter-loans',
					image: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w218h122/94612233eae1ed25382c8113643a5ce6.jpg'
					},
					retinaImage: {
						url: 'https://www-kiva-org-0.freetls.fastly.net/img/w436h244/54db03c8268961334fb3dec3a3d73bd4.jpg'
					}
				}
			]
			/* eslint-enable max-len */
		};
	},
	computed: {
		primaryCtaUrl() {
			const date = getPdtDate();
			const march8 = 1583654400000; // epoch time of march 8.
			return date.valueOf() < march8 ? '/monthlygood?category=women' : '/lend-by-category/women';
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
	overflow: hidden;
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
	position: relative;

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
		height: 15%; // IE11
		bottom: 7.5%;
		right: 3.5%;
		z-index: 1;

		@include breakpoint('large') {
			bottom: auto;
			top: 7%;
			width: 25.5%;
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
		height: 10%; // IE11

		@include breakpoint('medium') {
			height: 12%; // IE11
		}

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

	&__flourish {
		width: rem-calc(106);
	}
}

.stats {
	background-color: $iwd-grey;
	font-weight: $global-weight-bold;
	position: relative;

	&__list {
		list-style: none;
		margin: 4rem auto -3rem;
		position: relative;
		z-index: 2;
	}

	&__divider-flourish {
		width: rem-calc(284);
		height: rem-calc(136);
		position: absolute;
		z-index: 1;
		left: calc(50% - #{rem-calc(150)});
		bottom: -3.25rem;

		@include breakpoint('xlarge') {
			left: calc(50% - (61.875rem / 2) - 7%);
			bottom: -4.25rem;
		}
	}

	&__flags {
		width: rem-calc(220);
		height: rem-calc(151);
		position: relative;
		z-index: 1;
		top: 2.5rem;

		@include breakpoint('large') {
			position: absolute;
			top: 45%;
			left: calc(50% - #{rem-calc(110)});
			opacity: 0.3;
		}

		@include breakpoint('xxlarge') {
			left: calc(50% + (61.875rem / 2) - #{rem-calc(110)});
			top: 6rem;
		}
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
	position: relative;
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
		width: 100%;

		@include breakpoint('large') {
			flex-direction: row;
		}

		@include breakpoint('xxlarge') {
			flex-direction: column;
			width: 33%;
			padding-right: 0.9375rem;
			padding-left: 0.9375rem;
		}
	}

	&__img-wrapper {
		border-radius: 50%;
		width: rem-calc(255);
		overflow: hidden;
	}

	&__img {
		width: 100%;
		height: auto;
		transform: scale(1);
		transition: transform 0.25s ease;
		flex-shrink: 0;
	}

	&__link {
		display: block;
		text-decoration: none;
		color: $body-font-color;
		margin: 0 1rem 0.5rem;
		flex-shrink: 0;
		position: relative;

		&:hover,
		&:focus {
			.profiles__img {
				transform: scale(1.1);
			}
		}
	}

	&__flourish {
		position: absolute;
		pointer-events: none;

		&--0 {
			width: rem-calc(91.34);
			height: rem-calc(139.79);
			left: -1.5rem;
			top: 6rem;
		}

		&--1 {
			width: rem-calc(82.72);
			height: rem-calc(92.99);
			right: 0;
			top: 10rem;
		}

		&--2 {
			width: rem-calc(91.34);
			height: rem-calc(139.79);
			right: -1.5rem;
			top: 0;
		}
	}

	&__divider-flourish {
		width: rem-calc(284);
		height: rem-calc(100);
		position: absolute;
		z-index: 1;
		left: calc(50% - #{rem-calc(150)});
		bottom: -1rem;

		@include breakpoint('xlarge') {
			left: auto;
			right: calc(50% - (61.875rem / 2) - 7%);
			bottom: 0;
		}
	}

	&__text {
		font-weight: $global-weight-normal;
		padding: 0.75rem 0.5rem;
		margin-bottom: 0.25rem;
		line-height: 1.3;
		display: block;
	}

	&__text-wrapper {
		width: 100%; // IE 11
	}
}

.categories {
	background-color: #fff;
	position: relative;

	&__cta {
		margin-bottom: 3rem;
	}

	&__body-text {
		position: relative;
		z-index: 1;
	}

	&__subhead {
		font-weight: $global-weight-bold;
		margin: 2rem 0;
	}

	&__subhead-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__subhead-flourish {
		display: none;

		@include breakpoint('large') {
			display: block;
			width: rem-calc(140);
			height: rem-calc(126.78);
		}
	}

	&__subhead-flourish-2 {
		display: none;

		@include breakpoint('large') {
			display: block;
			width: rem-calc(93.69);
			height: rem-calc(57.48);
			margin: -3rem 2rem 0 1rem;
		}
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

	&__flags {
		display: none;

		@include breakpoint('large') {
			display: block;
			width: rem-calc(217);
			z-index: 0;
			position: absolute;
			opacity: 0.3;
			left: calc(50% - (61.875rem / 2) - 4.5%);
			top: 4rem;
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
	position: relative;
}

</style>
