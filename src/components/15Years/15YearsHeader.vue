<template>
	<div class="header section">
		<fifteen-years-oily-background />
		<div class="header__main-section">
			<div class="header__main-section-row row align-middle">
				<div v-if="!isCountrySelected" class="main_cta">
					<div class="header__text small-12 large-6 columns">
						<h1 class="header__headline">
							<span class="header__headline-stroked no-wrap">Power in</span> Numbers
						</h1>
						<p>
							{{ mainTextSubtitle }}
						</p>
						<fifteen-years-button class="header__cta-button" to="/help/">
							{{ buttonCtaText }}
						</fifteen-years-button>
					</div>
				</div>
				<div v-else class="country_cta">
					<div class="header__text columns">
						<div class="row">
							<div>
								<h2 class="country-name">
									{{ globekitCountrySelected.name }}
								</h2>
							</div>
							<div>
								<div class="country-sticker">
									<kv-flag
										:country="globekitCountrySelected.iso2"
										:aspect-ratio="'1x1'"
										:inline-svg="true"
										class="circular-country"
									/>
								</div>
							</div>
						</div>
					</div>
					<div class="row loan-number-group">
						<div class="columns">
							<div class="row">
								<div class="loan-number">
									<h3>{{ numberWithCommas(globekitCountrySelected.total) }}</h3>
								</div>
								<div class="loan-label">
									<h5>total <br>loans</h5>
								</div>
							</div>
							<div class="row">
								<div class="loan-number">
									<h3>{{ numberWithCommas(globekitCountrySelected.active) }}</h3>
								</div>
								<div class="loan-label">
									<h5>active <br>loans</h5>
								</div>
							</div>
						</div>
					</div>
					<div class="row header__cta-button">
						<fifteen-years-button to="/help/">
							{{ globekitCountrySelected.active > 0 ?
								`Lend in ${globekitCountrySelected.button}` : 'Find a borrower' }}
						</fifteen-years-button>
						<div class="prevnext">
							<button
								class="prevnext__btn prevnext__btn--prev"
								@click="prevClickHandler"
							>
								<kv-icon
									class="prevnext__btn-icon"
									name="fat-chevron"
									:from-sprite="true"
								/>
								<span class="name-nav__index">{{
									this.previousCountries.length.toString().padStart(2, "0")
								}}</span>
							</button>

							<span class="prevnext__indicator">
								<kv-progress-bar
									:value="`'${previousCountries.length}'`"
									:max="`'${countryList.length}'`"
									style="
										--kv-progress-bar-foreground-color: black;
										--kv-progress-bar-background-color: #C4C4C4;
										min-width: 50px;
									"
								/>
							</span>

							<button
								class="prevnext__btn prevnext__btn--next"
								@click="nextClickHandler"
							>
								<span class="name-nav__index">{{
									this.countryList.length.toString().padStart(2, "0")
								}}</span>
								<kv-icon
									class="prevnext__btn-icon"
									name="fat-chevron"
									:from-sprite="true"
								/>
							</button>
						</div>
					</div>
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
		<fifteen-years-globe
			ref="globe"
			@selectcountry="onCountrySelect"
		/>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import ThirtyEightMillion from '@/assets/images/15-years/stickers/38MMBorrowers-1.png';
import TShirt from '@/assets/images/15-years/stickers/T-shirt.png';
import DreamTeam from '@/assets/images/15-years/stickers/DTeam2.png';
import KvFlag from '@/components/Kv/KvFlag';
import KvIcon from '@/components/Kv/KvIcon';
import KvProgressBar from '@/components/Kv/KvProgressBar';
import FifteenYearsButton from './15YearsButton';
import FifteenYearsHeaderCard from './15YearsHeaderCard';
import FifteenYearsOilyBackground from './15YearsOilyBackground';
import FifteenYearsGlobe from './15YearsGlobe';
import geojson from '../../assets/data/components/15-years/geojson.json';

const countryQuery = gql`query featuredCountry {
	lend {
		countryFacets {
			count
			country {
				name
				numLoansFundraising
				fundsLentInCountry
				isoCode
			}
		}
	}
}`;

export default {
	components: {
		FifteenYearsButton,
		FifteenYearsHeaderCard,
		FifteenYearsOilyBackground,
		FifteenYearsGlobe,
		KvFlag,
		KvIcon,
		KvProgressBar
	},
	data() {
		const countryList = geojson.features.map(feature => {
			const active = Math.floor(feature.properties.total * Math.random() * 0.01);
			return { ...feature.properties, active };
		});
		const countries = countryList.reduce((accumulator, currentValue) => {
			accumulator[currentValue.iso2] = currentValue;
			return accumulator;
		}, {});

		return {
			mainTextSubtitle: 'Join us in celebrating 15 years of impact by supporting 15,000 people around the world.',
			buttonCtaText: 'Lend now',
			cardData: [
				{
					title: '15 Years of Impact',
					subtitle: 'The history of Kiva, year by year',
					href: '#15-years-of-impact',
					imgSrc: ThirtyEightMillion,
					imgTilt: 5,
				},
				{
					title: 'The World of Kiva',
					subtitle: 'The people who make it happen',
					href: '#world-of-kiva',
					imgSrc: TShirt,
					imgTilt: 10,
				},
				{
					title: 'Strategic Partners',
					subtitle: 'INDIVIDUALS AND ORGANIZATIONS MAKING A DIFFERENCE',
					href: '#orgs-making-difference',
					imgSrc: DreamTeam,
					imgTilt: 15,
				},
			],
			isCountrySelected: false,
			globekitCountrySelected: {},
			countryList,
			countries,
			previousCountries: [],
		};
	},
	mounted() {
		console.log(geojson);
	},
	methods: {
		onCountrySelect(selection) {
			if (selection === null) {
				this.isCountrySelected = false;
				this.globekitCountrySelected = {};
				this.previousCountries = [];
			} else {
				const country = this.countries[selection.iso2];
				if (this.isCountrySelected) {
					const prevIndex = this.previousCountries.indexOf(country);
					if (prevIndex !== -1) {
						this.previousCountries = this.previousCountries.slice(0, prevIndex);
					}
					this.previousCountries.push(country);
				} else {
					this.previousCountries = [country];
				}
				this.isCountrySelected = true;
				this.globekitCountrySelected = country;
			}
		},
		nextClickHandler() {
			if (this.previousCountries.length !== this.countryList.length) {
				const c = this.$refs.globe.nextClosest(this.globekitCountrySelected, this.previousCountries);
				const country = this.countries[c.iso2];
				console.log(c, country);
				this.globekitCountrySelected = country;
				this.$refs.globe.selectCountry(country);
				this.previousCountries.push(country);
			} else {
				const country = this.previousCountries[0];
				this.previousCountries = [country];
				this.globekitCountrySelected = country;
				this.$refs.globe.selectCountry(country);
			}
		},
		prevClickHandler() {
			if (this.previousCountries.length > 1) {
				this.previousCountries.pop();
				const country = this.previousCountries[this.previousCountries.length - 1];
				this.globekitCountrySelected = country;
				this.$refs.globe.selectCountry(country);
			} else {
				const c = this.$refs.globe.nextClosest(this.globekitCountrySelected, this.previousCountries);
				const country = this.countries[c.iso2];
				this.globekitCountrySelected = country;
				this.$refs.globe.selectCountry(country);
				this.previousCountries = [country];
			}
		},
		clickHandler(event) {
			console.log(event);
		},
		numberWithCommas(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
	},
	inject: ['apollo'],
	apollo: {
		query: countryQuery,
		preFetch: true,
		result({ data }) {
			console.log('Fetched data from graphql~!', data);
		},
	},
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
		// max-width: 40vw;
		max-width: none;

		@include breakpoint(large) {
			max-width: 72rem;
			width: 72rem;
			margin: 0 auto;
		}
	}

	.header__main-section-row {
		padding-top: rem-calc(96);
		padding-left: 0;
		margin: 0;
		min-height: rem-calc(340px);
		max-width: none;

		@include breakpoint(large) {
			padding-top: rem-calc(64);
			padding-left: 0;
		}

		@include breakpoint(xxlarge) {
			padding-top: rem-calc(64);
			padding-left: 0;
		}
	}

	&__text {
		@include breakpoint(xxlarge) {
			max-width: 35vw;
		}
	}

	&__cards-section {
		position: relative;
		margin-top: auto;

		@include breakpoint(small) {
			background-color: $mint;
			margin-top: rem-calc(calc(100vw - 72px));
			z-index: -1;
			padding-top: rem-calc(32);
		}

		@include breakpoint(large) {
			background-color: transparent;
			margin: 0;
			z-index: 1;
			padding-top: 0;
			padding-left: 0;
		}

		@include breakpoint(xxlarge) {
			background-color: rgba(255, 255, 255, 0.5);
			padding-left: 0;
		}

		.row {
			// max-width: 95%;
			// width: 95%;

			@include breakpoint(large) {
				max-width: 225px;
				margin: 0;
				margin-right: auto;

				/* padding-left: rem-calc(82); */
			}

			@include breakpoint(xxlarge) {
				width: 95%;
				max-width: 99%;
				margin-left: auto;
				margin-right: auto;
			}
		}
	}

	&__cta-button {
		margin-top: rem-calc(48);
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

		&:hover {
			background-color: rgba(255, 255, 255, 0.8);
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
		width: 100%;
		padding: rem-calc(14) rem-calc(50);
		height: rem-calc(52);
		transition:
			background-color 0.1s ease-out,
			color 0.1s ease-out,
			border-color 0.1s ease-out;

		@include breakpoint(large) {
			width: auto;
		}
	}

	.country_cta {
		.fifteen-yr-button {
			padding: rem-calc(14) rem-calc(10);
			width: 203px;
			text-align: center;
		}
	}
}

.header.section {
	padding: 0;
	min-height: rem-calc(900);
	display: flex;
	flex-direction: column;
}

.circular-country {
	border-radius: 50%;
	overflow: hidden;
	border: 1px solid #ccc;
	box-sizing: content-box;
}

.country-sticker {
	display: block;
	box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
	border-radius: 50%;
	padding: 5px;
	max-width: 65px;
	max-height: 65px;
	min-width: 65px;
	min-height: 65px;

	// Phones
	@include breakpoint(small) {
		display: none;
	}

	// Desktop
	@include breakpoint(large) {
		display: block;
	}

}

.country-name {
	margin-right: rem-calc(64);
}

.loan-number {
	margin-right: rem-calc(16);
}

.loan-number-group {

	@include breakpoint(large) {
		margin-top: rem-calc(48);
		padding-left: rem-calc(32);
		border-left: 2px solid $twilight;
	}
}

.loan-label {
	margin-top: auto;
	margin-bottom: auto;
}

.name-nav__index {
	padding: 0 rem-calc(8);
}

/* taken from 15YearsIndividuals */
.prevnext {
	@include h5();

	display: flex;
	justify-content: middle;
	align-items: center;
	padding: 0 rem-calc(16);

	&__indicator {
		margin: 0 rem-calc(16);
	}

	&__btn-text {
		border-radius: rem-calc(16);
		padding: rem-calc(2) rem-calc(8);
		border: rem-calc(2) solid transparent;
	}

	&__btn-icon {
		width: rem-calc(20);
		height: rem-calc(11);
	}

	&__btn {
		@include h5();

		display: flex;
		justify-content: center;
		align-items: center;
		fill: $twilight;
		color: $twilight;

		&--prev {
			.prevnext__btn-icon {
				transform: rotate(90deg);
			}
		}

		&--next {
			.prevnext__btn-icon {
				transform: rotate(-90deg);
			}
		}

		&:hover {
			.prevnext__btn-text {
				background: #000;
				color: $twilight;
				border: rem-calc(2) solid #fff;
			}

			.prevnext__btn-icon {
				fill: $mint;
			}
		}

		&:focus {
			outline: 0;

			.prevnext__btn-text {
				border: rem-calc(2) solid $mint;
			}
		}

		&[disabled] {
			visibility: hidden;
		}
	}
}

</style>
