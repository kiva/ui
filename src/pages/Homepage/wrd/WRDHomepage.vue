<template>
	<www-page id="homepage"
		class="page-content"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div class="hero">
			<a
				:href="primaryCtaUrl"
				v-kv-track-event="[
					'homepage',
					'click-WRD2020-hero',
					'homepage-WRD2020-hero-banner-image'
				]"
				target="_self"
			>
				<kv-responsive-image
					:images="heroImageSet"
					alt=""
				/>
			</a>
			<div class="hero__text-wrapper">
				<img
					class="hero__wrd-logo"
					src="@/assets/images/wrd/wrd-logo.svg"
					alt="World Refugee Day"
				>
				<div class="hero__tagline">
					<!-- eslint-disable-next-line max-len -->
					<h2 class="hero__tagline-head">
						Fund a dream to build <span class="no-wrap">a <strong>new life.</strong></span>
					</h2>
					<kv-button
						:href="primaryCtaUrl"
						class="hero__cta cta"
						v-kv-track-event="[
							'homepage',
							'click-WRD2020-hero',
							'homepage-WRD2020-hero-cta-btn'
						]"
					>
						Support Refugees
					</kv-button>
				</div>
			</div>
			<line-divider-1 class="divider divider--bottom divider--sand" />
		</div>

		<section class="section stats">
			<p class="text-block">
				<!-- eslint-disable-next-line max-len -->
				The COVID-19 pandemic has devastated vulnerable populations around the world, including the international refugee community. More than 70 million people globally have been unable to “stay home” for their health and safety, as they’ve been forced to flee their homes due to conflict, war, persecution, and human rights violations. These dangerous conditions diminish financial opportunity for refugees. Join us in supporting refugees as they build their new lives.
			</p>
			<ul class="row stats__list">
				<li class="small-12 large-4 columns stat-block">
					<span class="stat-block__number stat-block__number--plain-text">
						70M
					</span>
					<span class="stat-block__text">refugees and IDPs globally</span>
				</li>
				<li class="small-12 large-4 columns stat-block">
					<span class="stat-block__number stat-block__number--plain-text">
						90%
					</span>
					<span class="stat-block__text">of them fled to developing countries</span>
				</li>
				<li class="small-12 large-4 columns stat-block">
					<span class="stat-block__number stat-block__number--plain-text">
						50%
					</span>
					<span class="stat-block__text">are under 18 years old</span>
				</li>
			</ul>
			<kv-button
				:href="primaryCtaUrl"
				class="stats__cta cta"
				v-kv-track-event="[
					'homepage',
					'click-WRD2020-learn-more-btn',
					'homepage-WRD2020-learn-more-btn'
				]"
			>
				Learn More
			</kv-button>
		</section>

		<section class="section profiles">
			<line-divider-2 class="divider divider--sand" />
			<h2 class="headline profiles__headline">
				Creating hope <span class="no-wrap">for a home</span>
			</h2>
			<ul class="profiles__list">
				<li class="profiles__li" v-for="(refugee, index) in featuredStory" :key="index">
					<router-link
						class="profiles__link"
						:to="refugee.url"
						:v-kv-track-event="[
							'homepage',
							`click-WRD2020-story-${index}`,
							'homepage-WRD2020-story-image'
						]"
					>
						<div class="profiles__img-wrapper">
							<img
								class="profiles__img"
								:src="refugee.img[0]"
								:srcset="`${refugee.img[1]} 2x`"
								:alt="refugee.title"
								width="255"
								height="255"
								loading="lazy"
							>
						</div>
					</router-link>
					<div class="profiles__text-wrapper">
						<h4 class="profiles__title">
							{{ refugee.title }}
						</h4>
						<p class="profiles__text">
							{{ refugee.text }}
						</p>
						<kv-button
							class="cta profiles__cta"
							:to="refugee.url"
							:v-kv-track-event="[
								'homepage',
								`click-WRD2020-story-${index}`,
								'homepage-WRD2020-story-cta'
							]"
						>
							Read Their Story
						</kv-button>
					</div>
				</li>
			</ul>
		</section>

		<section class="section handup">
			<line-divider-3 class="divider divider--purple" />
			<h2 class="headline handup__headline">
				With Kiva, give a hand up, <span class="no-wrap">not a handout</span>
			</h2>
			<p class="text-block">
				<!-- eslint-disable-next-line max-len -->
				1.7 billion people worldwide can’t access traditional financial services. Kiva is an international nonprofit with a mission to expand financial access to underserved communities. One way to address this is through crowdfunded microloans.
			</p>
			<ul class="handup__steps-list">
				<li class="handup__li" v-for="(step, index) in loanSteps" :key="index">
					<img
						class="handup__img"
						:class="step.title | changeCase('paramCase')"
						:src="step.img[0]"
						:srcset="`${step.img[0]} 2x`"
						:alt="step.title"
						width="255"
						height="255"
						loading="lazy"
					>
					<div class="handup__text-wrapper">
						<h4 class="handup__title">
							{{ step.title }}
						</h4>
						<p class="handup__text">
							{{ step.text }}
						</p>
					</div>
				</li>
			</ul>
			<line-divider-4 class="divider divider--inplace divider--purple" />
			<ul class="row stats__list">
				<li class="small-12 large-4 columns stat-block">
					<span class="stat-block__number stat-block__number--plain-text">
						$1.4B
					</span>
					<span class="stat-block__text">loans funded in 98 countries</span>
				</li>
				<li class="small-12 large-4 columns stat-block">
					<span class="stat-block__number stat-block__number--plain-text">
						100%
					</span>
					<span class="stat-block__text">goes into the field</span>
				</li>
				<li class="small-12 large-4 columns stat-block">
					<span class="stat-block__number stat-block__number--plain-text">
						97%
					</span>
					<span class="stat-block__text">loan repayment rate</span>
				</li>
			</ul>
			<kv-button
				:href="primaryCtaUrl"
				class="cta handup__cta"
				v-kv-track-event="[
					'homepage',
					'click-WRD2020-lend-now',
					'homepage-WRD2020-lend-now-btn'
				]"
			>
				Lend Now
			</kv-button>
			<line-divider-5 class="divider divider--bottom divider--purple" />
		</section>
	</www-page>
</template>

<script>
import { lightHeader, wrdFooterTheme } from '@/util/siteThemes';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvButton from '@/components/Kv/KvButton';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

import LineDivider1 from '@/assets/inline-svgs/wrd/lineDivider1.svg';
import LineDivider2 from '@/assets/inline-svgs/wrd/lineDivider2.svg';
import LineDivider3 from '@/assets/inline-svgs/wrd/lineDivider3.svg';
import LineDivider4 from '@/assets/inline-svgs/wrd/lineDivider4.svg';
import LineDivider5 from '@/assets/inline-svgs/wrd/lineDivider5.svg';

const wrdImagesRequire = require.context('@/assets/images/wrd/', true);

export default {
	components: {
		KvButton,
		KvResponsiveImage,
		LineDivider1,
		LineDivider2,
		LineDivider3,
		LineDivider4,
		LineDivider5,
		WwwPage,
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: wrdFooterTheme,
			heroImageSet: [
				['small', wrdImagesRequire('./banner_sm.jpg')],
				['small retina', wrdImagesRequire('./banner_sm_2x.jpg')],
				['medium', wrdImagesRequire('./banner_md.jpg')],
				['medium retina', wrdImagesRequire('./banner_md_2x.jpg')],
				['large', wrdImagesRequire('./banner_lg.jpg')],
				['large retina', wrdImagesRequire('./banner_lg_2x.jpg')],
				['xga', wrdImagesRequire('./banner_xga.jpg')],
				['xga retina', wrdImagesRequire('./banner_xga_2x.jpg')],
				['wxga', wrdImagesRequire('./banner_wxga.jpg')],
				['wxga retina', wrdImagesRequire('./banner_wxga_2x.jpg')],
			],
			primaryCtaUrl: '/lend-by-category/refugees-and-i-d-ps',
			featuredStory: [
				{
					title: 'Alba - Colombia',
					// eslint-disable-next-line max-len
					text: 'Meet Albalibia, an internally displaced person (IDP) in her own country of Colombia due to militant violence.',
					url: 'blog/how-kiva-is-changing-the-story-for-internally-displaced-people-in-colombia',
					img: [
						[wrdImagesRequire('./wrd-borrower-1-alba-standard.jpg')],
						[wrdImagesRequire('./wrd-borrower-1-alba-retina.jpg')],
					],
				},
				{
					title: 'Bosco - Congo/Rwanda',
					// eslint-disable-next-line max-len
					text: 'Meet Bosco, who fled Rwanda from Congo in 1997 and has been living in a refugee camp for the past 19 years.',
					url: 'lend/1176213?minimal=false',
					img: [
						[wrdImagesRequire('./wrd-borrower-2-bosco-standard.jpg')],
						[wrdImagesRequire('./wrd-borrower-2-bosco-retina.jpg')],
					],
				},
				{
					title: 'Ki - Cambodia/U.S.',
					// eslint-disable-next-line max-len
					text: 'Meet Ki, who fled the civil war in Cambodia and sought refuge in Vietnam, now an immigrant and small business owner in San Francisco, Ca.',
					url: 'blog/kis-dream-to-define-herself-by-her-own-rules',
					img: [
						[wrdImagesRequire('./wrd-borrower-3-ki-standard.jpg')],
						[wrdImagesRequire('./wrd-borrower-3-ki-retina.jpg')],
					],
				},
			],
			loanSteps: [
				{
					title: 'Choose a borrower',
					text: 'Browse by category and find an entrepreneur or small business you’d like to support.',
					img: [
						[wrdImagesRequire('./borrower-icon.png')],
					],
				},
				{
					title: 'Make a loan',
					text: 'Help fund a loan with as little as $25.',
					img: [
						[wrdImagesRequire('./make-a-loan-icon.png')],
					],
				},
				{
					title: 'Get repaid',
					// eslint-disable-next-line max-len
					text: 'Borrowers will repay your loan over a defined time. Kiva borrowers have a 97% repayment rate.',
					img: [
						[wrdImagesRequire('./get-repaid-icon.png')],
					],
				},
				{
					title: 'Repeat',
					// eslint-disable-next-line max-len
					text: 'When you’re repaid, use that same $25 to help someone else and grow your impact, or you can withdraw it.',
					img: [
						[wrdImagesRequire('./repeat-icon.png')],
					],
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'foundation';

$wrd-salmon: #f1ada0;
$wrd-green: #b9ddb8;
$wrd-sand: #f2e9cb;
$wrd-purple: #6b62ca;
$wrd-red: #e14855;
$wrd-light-orange: #fbaf5d;

$divider-height: 2.5rem;

.page-content {
	overflow: hidden;
}

.section {
	text-align: center;
	padding: 6rem 0 #{2rem + $divider-height} 0;
	font-size: rem-calc(19);
	position: relative;
}

.cta {
	text-transform: uppercase;
	border-radius: rem-calc(4);
	font-size: $normal-text-font-size;
	font-weight: $global-weight-bold;
	width: rem-calc(255);
	max-width: 100%;
	margin-top: 0.5rem;
	padding: 1.25rem 0.5rem;
}

.text-block {
	max-width: 55rem;
	padding: 0 1rem;
	line-height: 1.4;
	margin: 0 auto 4rem;
	font-weight: $global-weight-normal;
}

.headline {
	font-weight: $global-weight-bold;
	margin-bottom: 4rem;
	font-size: 2rem;
}

.divider {
	display: block;
	width: 100%;
	position: absolute;
	top: -0.85rem;
	max-height: $divider-height;
	bottom: auto;

	&--bottom {
		bottom: -0.75rem;
		top: auto;
	}

	&--sand {
		path {
			fill: $wrd-sand;
		}
	}

	&--purple {
		path {
			fill: $wrd-purple;
		}
	}

	&--inplace {
		position: relative;
		width: 60%;
		margin: 0 auto;
		max-height: 1rem;
	}
}

// PAGE BLOCKS
.hero {
	background-color: $wrd-green;
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
		max-width: 61.875rem;
		margin-right: auto;
		margin-left: auto;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	&__wrd-logo {
		position: absolute;
		width: 75%;
		height: 58%; // IE11
		bottom: -25%;
		left: 13%;
		z-index: 1;

		@include breakpoint('large') {
			bottom: auto;
			top: 7%;
			left: 0.65rem;
			width: 25.5%;
			height: 42%; // IE11
			right: 4.2%;
		}
	}

	&__tagline {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: absolute;
		bottom: -57.125%;
		height: 30%; // IE11
		z-index: 900;

		@include breakpoint('large') {
			left: 0.95rem;
			right: auto;
			bottom: auto;
			top: 55%;
			width: 41.5%;
			height: 34%; // IE11
			max-width: 19.25rem;
		}
	}

	&__tagline-head {
		font-size: 2rem;
		color: black;
		text-align: center;
		@include breakpoint('large') {
			text-align: left;
		}
	}

	&__cta {
		@include button-style($wrd-salmon, auto, #000);

		box-shadow: 0 2px darken($wrd-salmon, 10%); // override foundation box-shadow
		margin-left: auto;
		margin-right: auto;
		@include breakpoint('large') {
			margin-left: 0;
		}
	}
}

.stats {
	background-color: $wrd-sand;
	font-weight: $global-weight-highlight;
	position: relative;
	padding-top: 21rem; // artificial padding to account for the hero logo and cta coming down on mobile.

	@include breakpoint('large') {
		padding: 4rem 0 #{2rem + $divider-height} 0;
	}

	&__list {
		list-style: none;
		margin: 3rem auto 0;
		position: relative;
		z-index: 2;
		font-weight: $global-weight-bold;
	}

	&__cta {
		@include button-style($wrd-red, auto, #fff);

		box-shadow: 0 2px darken($wrd-red, 10%); // override foundation box-shadow
		margin-left: auto;
		margin-right: auto;
	}
}

.stat-block {
	margin-bottom: 3rem;

	&__number {
		display: block;
		fill: $wrd-purple;
		margin: 0 auto;

		&--plain-text {
			font-size: 3.75rem;
			font-weight: $global-weight-bold;
			color: $wrd-purple;
			line-height: 4.5rem;
		}
	}

	&__text {
		display: block;
		margin: 0.25rem auto;
		line-height: 1.25rem;
		max-width: 13rem;
	}
}

.profiles {
	position: relative;
	background-color: $wrd-purple;
	color: #fff;

	&__headline {
		color: $wrd-sand;
	}

	&__list {
		list-style: none;
		margin: 0 auto -4rem;
		display: flex;
		max-width: 48rem;
		flex-flow: row wrap;
		@include breakpoint('xxlarge') {
			max-width: 70rem;
		}
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

	&__title {
		font-weight: $global-weight-bold;
	}

	&__text {
		font-weight: $global-weight-normal;
		font-size: $small-text-font-size;
		padding: 0.75rem 2.65rem;
		line-height: 1.3;
		display: block;
		max-width: 24rem;
		margin: 0 auto 0.25rem;

		@include breakpoint('large') {
			min-height: 6rem;
		}
	}

	&__text-wrapper {
		width: 100%; // IE 11
	}

	&__cta {
		@include button-style($wrd-light-orange, auto, #fff);

		box-shadow: 0 2px darken($wrd-light-orange, 10%); // override foundation box-shadow
		margin-left: auto;
		margin-right: auto;
	}
}

.handup {
	background-color: $wrd-green;
	font-weight: $global-weight-bold;
	position: relative;

	.text-block {
		max-width: 45rem;
		margin-bottom: 1rem;
		@include breakpoint('large') {
			margin-bottom: 4rem;
		}
	}

	&__headline {
		color: $wrd-purple;
	}

	&__cta {
		@include button-style($wrd-purple, auto, #fff);

		box-shadow: 0 2px darken($wrd-purple, 10%); // override foundation box-shadow
		margin-left: auto;
		margin-right: auto;
	}

	&__steps-list {
		list-style: none;
		margin: 0 auto 2.5rem;
		display: flex;
		flex-flow: row wrap;
		max-width: 48rem;
		@include breakpoint('xxlarge') {
			max-width: 70rem;
		}
	}

	&__li {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 3rem;
		width: 100%;

		@include breakpoint('large') {
			flex-direction: row;
		}

		@include breakpoint('xxlarge') {
			flex-direction: column;
			width: 25%;
		}
	}

	&__img {
		&.choose-a-borrower {
			// this png image is not centered like the others. Adjust it manually.
			bottom: 2.25rem;
			right: 1rem;
			position: relative;
		}
	}

	&__title {
		font-weight: $global-weight-bold;
	}

	&__text {
		font-weight: $global-weight-normal;
		padding: 0.75rem 2rem;
		line-height: 1.3;
		display: block;
		max-width: 24rem;
		margin: 0 auto 0.25rem;

		@include breakpoint('xlarge') {
			min-height: 6rem;
		}
	}

	&__text-wrapper {
		width: 100%; // IE 11
		margin-top: 1rem;
	}
}

</style>
