<template>
	<div class="header section">
		<fifteen-years-oily-background />
		<div class="header__main-section">
			<div class="header__main-section-row row align-bottom">
				<div v-if="!isCountrySelected" class="main_cta">
					<div class="header__text small-12 large-6 columns">
						<h1 class="header__headline">
							<span class="header__headline-stroked no-wrap">Power in</span> Numbers
						</h1>
						<p>
							{{ mainTextSubtitle }}
						</p>
						<fifteen-years-button
							class="header__cta-button"
							to="/lend-by-category"
							v-kv-track-event="[
								'Kiva15',
								'click-hero-CTA',
								buttonCtaText
							]"
						>
							{{ buttonCtaText }}
						</fifteen-years-button>
					</div>
				</div>
				<div v-else class="country_cta small-12 large-8">
					<div class="columns country-name-container">
						<div class="row">
							<div>
								<h2 :class="'country-name ' + globekitCountrySelected.nameClass">
									{{ globekitCountrySelected.name }}
								</h2>
							</div>
						</div>
						<div class="row">
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
									<h3>{{ globekitCountrySelected.total | numeral('0,0') }}</h3>
								</div>
								<div class="loan-label">
									<h5>total <br>loans</h5>
								</div>
							</div>
							<div class="row">
								<div class="loan-number">
									<h3>{{ globekitCountrySelected.active | numeral('0,0') }}</h3>
								</div>
								<div class="loan-label">
									<h5>active <br>loans</h5>
								</div>
							</div>
						</div>
					</div>
					<div class="row header__cta-button">
						<fifteen-years-button
							:to="getCountryLink(globekitCountrySelected)"
							v-kv-track-event="[
								'Kiva15',
								'click-hero-lend-in-country-CTA',
								globekitCountrySelected.active > 0 ?
									`Lend in ${globekitCountrySelected.button}` : 'Find a borrower'
							]"
						>
							{{ globekitCountrySelected.active > 0 ?
								`Lend in ${globekitCountrySelected.button}` : 'Find a borrower' }}
						</fifteen-years-button>
						<div class="prevnext">
							<button
								class="prevnext__btn prevnext__btn--prev"
								@click="prevClickHandler"
								v-kv-track-event="[
									'Kiva15',
									'click-hero-country-nav',
									'Previous'
								]"
							>
								<kv-icon
									class="prevnext__btn-icon"
									name="fat-chevron"
									:from-sprite="true"
								/>
								<span class="name-nav__index">Back</span>
							</button>

							<span class="prevnext__indicator">
								<kv-progress-bar
									:value="previousCountries.length.toString()"
									:max="countryList.length.toString()"
								/>
							</span>

							<button
								class="prevnext__btn prevnext__btn--next"
								@click="nextClickHandler"
								v-kv-track-event="[
									'Kiva15',
									'click-hero-country-nav',
									'Next'
								]"
							>
								<span class="name-nav__index">Next</span>
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
				<div class="small-12 xxlarge-4 columns header__card-wrap" v-for="item in cardData" :key="item.href">
					<div class="header__card">
						<fifteen-years-header-card
							:title="item.title"
							:subtitle="item.subtitle"
							:href="item.href"
							:img-src="item.imgSrc"
							:img-tilt="item.imgTilt"
							@card-clicked="onCardClicked"
						/>
					</div>
				</div>
			</div>
		</div>
		<fifteen-years-globe
			ref="globe"
			@selectcountry="onCountrySelect"
			@pan="onGlobePan"
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
			country {
				name
				numLoansFundraising
				fundsLentInCountry
				isoCode
				region
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
	inject: ['apollo'],
	data() {
		const countryList = geojson.features.map(feature => {
			const active = Math.floor(feature.properties.total * Math.random() * 0.01);
			const nameClass = feature.properties.name.length > 12 ? 'long' : 'short';
			return { ...feature.properties, active, nameClass };
		});
		const countries = countryList.reduce((accumulator, currentValue) => {
			accumulator[currentValue.iso2] = currentValue;
			return accumulator;
		}, {});

		return {
			mainTextSubtitle: 'Join us in celebrating 15 years of impact by supporting 15,000 people around the world.',
			buttonCtaText: 'Find a borrower',
			cardData: [
				{
					title: '15 Years of Impact',
					subtitle: 'The history of Kiva, year by year',
					href: '#years-of-impact',
					imgSrc: ThirtyEightMillion,
					imgTilt: 5,
				},
				{
					title: 'The World of Kiva',
					subtitle: 'The people who make it happen',
					href: '#world-of-kiva',
					imgSrc: TShirt,
					imgTilt: -10,
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
		this.fetchLiveCountryData();
	},
	methods: {
		onCardClicked(id) {
			const element = document.querySelector(id);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		},
		onCountrySelect(selection) {
			if (selection === null) {
				this.isCountrySelected = false;
				this.globekitCountrySelected = {};
				this.previousCountries = [];
				this.clearAutoplay();
			} else {
				const country = this.countries[selection.iso2];
				this.$kvTrackEvent('Kiva15', 'click-hero-globe', selection.iso2);
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
				this.queueAutoplay();
			}
		},
		nextClickHandler(event) {
			if (event) {
				// (autoplay function calls this method w/out event payload)
			}
			if (this.previousCountries.length !== this.countryList.length) {
				const c = this.$refs.globe.nextClosest(this.globekitCountrySelected, this.previousCountries);
				const country = this.countries[c.iso2];
				this.globekitCountrySelected = country;
				this.$refs.globe.selectCountry(country);
				this.previousCountries.push(country);
			} else {
				const country = this.previousCountries[0];
				this.previousCountries = [country];
				this.globekitCountrySelected = country;
				this.$refs.globe.selectCountry(country);
			}
			this.queueAutoplay();
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
			this.queueAutoplay();
		},
		onGlobePan() {
			if (this.isCountrySelected) {
				this.queueAutoplay();
			}
		},
		queueAutoplay() {
			this.clearAutoplay();
			this.advanceTimeout = setTimeout(() => {
				this.nextClickHandler();
			}, 7000);
		},
		clearAutoplay() {
			if (this.advanceTimeout) {
				clearTimeout(this.advanceTimeout);
			}
			this.advanceTimeout = null;
		},
		fetchLiveCountryData() {
			const query = this.apollo.query({
				query: countryQuery,
			});
			query.then(({ data }) => {
				// flatten country object and pass to list builder
				const countries = data.lend?.countryFacets.map(obj => obj.country);
				this.buildCountryList(countries);
			});
		},
		buildCountryList(dynamicCountries) {
			this.countryList = geojson.features.map(feature => {
				const dynamicCountry = dynamicCountries.find(country => country.isoCode === feature.properties.iso2);
				const nameClass = feature.properties.name.length > 12 ? 'long' : 'short';
				const active = dynamicCountry ? dynamicCountry.numLoansFundraising : 0;
				const originalName = dynamicCountry ? dynamicCountry.name : feature.properties.name;
				const region = dynamicCountry ? dynamicCountry.region : null;
				return {
					...feature.properties,
					nameClass,
					active,
					originalName,
					region
				};
			});

			this.countries = this.countryList.reduce((accumulator, currentValue) => {
				accumulator[currentValue.iso2] = currentValue;
				return accumulator;
			}, {});
		},
		getCountryLink(country) {
			const countryParam = `${country.region} > ${country.originalName}`;
			if (country.active > 0) {
				return `/lend/filter?countries=${encodeURIComponent(countryParam)}`;
			}
			return '/lend-by-category';
		}
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
	min-height: rem-calc(900);
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
		position: absolute;
		height: 432px;
		display: flex;
		width: 100%;

		.row {
			flex: 1 0 auto; // IE11;
		}

		@include breakpoint(small) {
			margin: 0 auto;
			padding-top: rem-calc(48);
		}

		@include breakpoint(large) {
			height: auto;
			position: absolute;
			bottom: 310px;
			max-width: 72rem;
			width: 100%;
			margin: 0 auto;
			padding: 0;
			padding-left: rem-calc(32);
			margin-top: rem-calc(128);
		}
	}

	.header__main-section-row {
		/* padding-top: rem-calc(96); */
		padding-left: 0;
		margin: 0;
		min-height: rem-calc(340px);
		max-width: none;
		width: 100%;

		@include breakpoint(large) {
			/* padding-top: rem-calc(64); */
			padding-left: 0;
		}
	}

	.fifteen-yr-button {
		padding: rem-calc(14) rem-calc(50);
		height: rem-calc(52);
	}

	.country_cta {
		// width: 100%;

		@include breakpoint(small) {
			padding-bottom: rem-calc(48);

			.row {
				margin-left: 0;
				margin-right: 0;
			}
		}

		.fifteen-yr-button {
			padding: rem-calc(14) rem-calc(10);
			width: 100%;
			text-align: center;

			@include breakpoint(large) {
				width: 203px;
			}
		}
	}

	&__text {

		@include breakpoint(small) {
			padding: 0 rem-calc(24);
			padding-bottom: rem-calc(86);
		}

		@include breakpoint(xxlarge) {
			max-width: 35vw;
		}
	}

	&__cards-section {
		@include breakpoint(small) {
			position: relative;
			background-color: $mint;
			margin-top: calc(100vw + 404px);

			// margin-top: calc(100vw - 48px + 432px + 20px);
			// margin-top: calc(100vw - #{rem-calc(72)});
			// z-index: 0;
			// padding-top: rem-calc(32);
		}

		@include breakpoint(large) {
			position: absolute;
			bottom: 0;
			padding-top: 0;
			margin-top: rem-calc(48);
			padding-left: rem-calc(32);
			padding-bottom: rem-calc(16);
			background-color: rgba(248, 248, 248, 0.5);
			// max-width: 40vw;
		}

		@include breakpoint(xxlarge) {
			padding: 0;
			margin: 0;
			width: 100%;
			max-width: 100%;

			.row {
				margin-left: auto;
				margin-right: auto;
			}
		}
	}

	&__cta-button {
		margin-top: rem-calc(16);
		padding-right: 0.625rem;
		padding-left: 0.625rem;
	}

	&__card {
		position: relative;
		padding: rem-calc(32) rem-calc(16);
		transition: background 0.3s ease-out;

		@include breakpoint(large) {
			max-width: rem-calc(300);
			padding: 0 rem-calc(16);
		}

		@include breakpoint(xxlarge) {
			max-width: 99%;
			padding: 0;

			&:hover {
				background: transparent;
			}
		}
	}

	&__card-wrap {

		@include breakpoint(xxlarge) {
			transition: background 0.3s ease-out;

			&:hover {
				background: rgba(248, 248, 248, 0.8);
			}
		}

		&:not(:first-child) {
			.header__card {
				border-top: 1px solid $twilight;

				@include breakpoint(xxlarge) {
					border-top: none;

					&::after {
						content: "";
						border-left: solid 1px $twilight;
						height: 75%;
						position: absolute;
						top: 0;
						left: -1rem;
						bottom: 0;
						margin-top: auto;
						margin-bottom: auto;
					}
				}
			}
		}
	}
}

.country-name {
	line-height: 1;

	&.long {

		@include breakpoint(small) {
			font-size: rem-calc(32);
		}

		@include breakpoint(large) {
			font-size: rem-calc(40);
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

.country-name-container {
	padding: 0 rem-calc(24);
}

.country-sticker {
	display: block;
	box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
	border-radius: 50%;
	padding: 3px;
	max-width: 40px;
	max-height: 40px;
	min-width: 40px;
	min-height: 40px;

	// Phones
	@include breakpoint(small) {
		display: none;
	}

	// Desktop
	@include breakpoint(large) {
		display: block;
	}
}

.loan-number {
	margin-right: rem-calc(16);
}

.loan-number-group {

	@include breakpoint(small) {
		padding-left: rem-calc(24);
		border-left: 2px solid $twilight;
		margin-left: rem-calc(24) !important;
		margin-top: rem-calc(16);
	}

	@include breakpoint(large) {
		margin-top: rem-calc(48);
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
	margin: 0 auto;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0 rem-calc(16);
	padding-top: rem-calc(24);

	@include breakpoint(large) {
		margin: 0;
		padding-top: 0;
		position: absolute;
		bottom: 302px;
		left: 100px;
		max-width: 180px;
	}

	&__indicator {
		margin: 0 rem-calc(16);

		progress {
			height: 3px;
			min-width: 50px;

			--kv-progress-bar-foreground-color: black;
			--kv-progress-bar-background-color: #C4C4C4;
		}

		progress::-webkit-progress-bar {
			border-radius: 1.5px;
			background-color: #C4C4C4;
		}

		progress::-webkit-progress-value {
			border-radius: 1.5px;
			background-color: $twilight;
		}
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
