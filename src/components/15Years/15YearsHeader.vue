<template>
	<div class="header section">
		<fifteen-years-globe />
		<fifteen-years-oily-background />
		<div class="header__main-section">
			<div class="row align-middle">
				<div class="header__text small-12 large-6 xxlarge-5 columns">
					<h1 class="header__headline">
						<span class="header__headline-stroked no-wrap">Power in</span> Numbers
					</h1>
					<p>
						{{ mainTextSubtitle }}
					</p>
					<fifteen-years-button to="/help/">
						{{ buttonCtaText }}
					</fifteen-years-button>
				</div>
			</div>
		</div>
		<div class="header__cards-section">
			<div class="row">
				<div class="header__card small-12 xxlarge-4 columns" v-for="item in cardData" :key="item.href">
					<FifteenYearsHeaderCard
						:title="item.title"
						:subtitle="item.subtitle"
						:href="item.href"
						:img-src="item.imgSrc"
						:img-tilt="item.imgTilt"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Hearts02 from '@/assets/images/15-years/stickers/Hearts02.svg';
import Handshake from '@/assets/images/15-years/stickers/Handshake.svg';
import PlanetEarth from '@/assets/images/15-years/stickers/PlanetEarth.svg';
import FifteenYearsButton from './15YearsButton';
import FifteenYearsHeaderCard from './15YearsHeaderCard';
import FifteenYearsOilyBackground from './15YearsOilyBackground';
import FifteenYearsGlobe from './15YearsGlobe';

export default {
	components: {
		FifteenYearsButton,
		FifteenYearsHeaderCard,
		FifteenYearsOilyBackground,
		FifteenYearsGlobe,
	},
	data() {
		return {
			mainTextSubtitle: 'Join us in celebrating 15 years of impact by supporting 15,000 people around the world.',
			buttonCtaText: 'Lend now',
			cardData: [
				{
					title: '15 Years of Impact',
					subtitle: 'The history of Kiva, year by year',
					href: '#15-years-of-impact',
					imgSrc: Hearts02,
					imgTilt: 5,
				},
				{
					title: 'The World of Kiva',
					subtitle: 'The people who make it happen',
					href: '#world-of-kiva',
					imgSrc: Handshake,
					imgTilt: 10,
				},
				{
					title: 'Partners',
					subtitle: 'Organizations making a difference',
					href: '#orgs-making-difference',
					imgSrc: PlanetEarth,
					imgTilt: 15,
				},
			],
		};
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.header {
	background: $offwhite;
	position: relative;
	z-index: 1;
	min-height: 900px;
	padding: 0;

	&__headline {
		@include huge-headline();
	}

	&__globe-img {
		width: 100%;
		max-width: rem-calc(615);
		margin: 2rem auto 0;
	}

	&__headline-stroked {
		-webkit-text-stroke: 1px $body-font-color;
		-webkit-text-fill-color: $offwhite;
	}

	&__main-section {
		position: relative;
		display: flex;
		flex: 1;
		flex-direction: row;
		pointer-events: none;

		.row {
			padding-top: rem-calc(96);
			padding-left: rem-calc(16);
			margin: 0;

			@include breakpoint(large) {
				padding-top: rem-calc(64);
				padding-left: rem-calc(64);
			}

			@include breakpoint(xxlarge) {
				padding-top: rem-calc(64);
				padding-left: rem-calc(128);
			}
		}
	}

	&__text {
		pointer-events: painted;
	}

	&__cards-section {
		position: relative;
		margin-top: auto;
		padding: rem-calc(24) 0;

		@include breakpoint(small) {
			background-color: $mint;
			margin-top: rem-calc(calc(100vw - 48px));
		}

		@include breakpoint(large) {
			background-color: transparent;
			padding: rem-calc(24) 0;
			margin: 0;
		}

		@include breakpoint(xxlarge) {
			background-color: rgba(255, 255, 255, 0.5);
		}

		.row {
			max-width: 95%;
			width: 95%;

			@include breakpoint(large) {
				max-width: 300px;
				margin: 0;
				padding-left: rem-calc(82);
			}

			@include breakpoint(xxlarge) {
				max-width: 99%;
			}
		}
	}

	&__card {
		position: relative;

		@include breakpoint(small) {
			padding: rem-calc(32) 0;
		}

		@include breakpoint(large) {
			padding: rem-calc(12) 0;
			padding-top: rem-calc(16);
		}

		@include breakpoint(xxlarge) {
			padding: 0;
		}

		// TODO: Vertical line separator between info cards via pseudo-selector
		&:not(:first-child) {

			// Phones only
			@include breakpoint(small) {
				border-top: 1px solid black;
			}

			// Desktop and above
			@include breakpoint(xxlarge) {
				border-top: none;

				&::after {
					content: "";
					border-left: solid 1px black;
					height: 75%;
					position: absolute;
					top: 0;
					bottom: 0;
					margin-top: auto;
					margin-bottom: auto;
				}
			}
		}
	}

	.fifteen-yr-button {
		padding: rem-calc(14) rem-calc(50);
		height: rem-calc(52);
		transition:
			background-color 0.1s ease-out,
			color 0.1s ease-out,
			border-color 0.1s ease-out;
	}
}

.header.section {
	padding: 0;
	min-height: rem-calc(900);
	display: flex;
	flex-direction: column;
}
</style>
