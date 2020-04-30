<template>
	<www-page
		id="co19-landing"
		:header-theme="co19HeaderTheme"
		:footer-theme="co19FooterTheme"
	>
		<kv-hero class="mg-hero section">
			<template v-slot:images>
				<kv-responsive-image
					class="mg-hero-picture"
					:images="heroImages"
					alt=""
				/>
			</template>
			<template v-slot:overlayContent>
				<div class="row">
					<div class="
						overlay-column columns
						medium-10 medium-offset-1 large-8 large-offset-0 xlarge-7 xxlarge-6"
					>
						<h1 class="mg-headline" v-html="pageCopy.headline"></h1>
						<p class="mg-subhead" v-html="pageCopy.subhead"></p>
						<covid-landing-form
							:key="1"
							:button-text="pageCopy.button"
							v-if="!isMonthlyGoodSubscriber && covidLandingActive"
						/>
						<div class="already-subscribed-msg-wrapper" v-else-if="isMonthlyGoodSubscriber">
							<h4>
								You're already signed up for Monthly Good.
								Changes to this contribution can be made in your
								<a href="/settings/credit">credit settings</a>.
							</h4>
						</div>
						<div class="campaign-inactive" v-else-if="!covidLandingActive">
							<h4>
								Please use the <a href="/monthlygood">Monthly Good signup form</a> to
								activate a monthly lending contribution.
							</h4>
						</div>
					</div>
				</div>
			</template>
		</kv-hero>

		<div class="row">
			<m-g-covid-explained class="small-12 columns mg-explained section" />
			<div class="separator section"></div>
			<m-g-covid-faq class="small-12 large-9 xlarge-8 xxlarge-7 columns section" />
		</div>

		<div class="about-wrapper section ">
			<div class="row">
				<m-g-covid-about class="about small-12 columns" />
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import MGCovidAbout from './MGCovidAbout';
import MGCovidExplained from './MGCovidExplained';
import MGCovidFaq from './MGCovidFAQ';

import CovidLandingForm from './CovidLandingForm';

const pageQuery = gql`{
	general {
		mg_covid_active: uiConfigSetting(key: "covid_landing_active") {
			key
			value
		}
	}
	my {
		autoDeposit {
			isSubscriber
		}
	}
}`;

const heroImagesRequire = require.context('@/assets/images/covid-response', true);

export default {
	metaInfo: {
		title: "Join Kiva's Global COVID-19 Response"
	},
	components: {
		WwwPage,
		CovidLandingForm,
		KvHero,
		KvResponsiveImage,
		MGCovidAbout,
		MGCovidExplained,
		MGCovidFaq,
	},
	props: {
		category: {
			type: String,
			default: 'covid-relief'
		}
	},
	data() {
		return {
			covidLandingActive: false,
			co19HeaderTheme: {
				themeKey: 'CO19',
				backgroundColor: '#fff',
				logoColor: '#4faf4e',
				linkColor: '#767676',
				linkHoverColor: '#efefef',
				separatorColor: 'transparent'
			},
			co19FooterTheme: {
				themeKey: 'CO19',
				backgroundColor: '#fff',
				textColor: '#484848',
				linkColor: '#4faf4e',
				separatorColor: '#8ccb8c'
			},
			isExperimentActive: true,
			isMonthlyGoodSubscriber: false,
			monthlyGoodAmount: 25,
			heroImages: [
				['small', heroImagesRequire('./hero_480x390.jpg')],
				['small retina', heroImagesRequire('./hero_960x780.jpg')],
				['medium', heroImagesRequire('./hero_680x375.jpg')],
				['medium retina', heroImagesRequire('./hero_1360x750.jpg')],
				['large', heroImagesRequire('./hero_1024x850.jpg')],
				['large retina', heroImagesRequire('./hero_2048x1700.jpg')],
				['xxlarge', heroImagesRequire('./hero_1320x760.jpg')],
				['xxlarge retina', heroImagesRequire('./hero_2640x1520.jpg')],
				['xga', heroImagesRequire('./hero_1440x710.jpg')],
				['xga retina', heroImagesRequire('./hero_2880x1420.jpg')],
				['wxga', heroImagesRequire('./hero_1920x740.jpg')],
				['wga retina', heroImagesRequire('./hero_3840x1480.jpg')],
			],
		};
	},
	computed: {
		pageCopy() {
			return {
				headline: 'Join Kiva\'s Global <span class="no-wrap">COVID—19</span> Response', // eslint-disable-line max-len
				subhead: 'Lend a hand to provide relief to entrepreneurs and small businesses impacted <span class="no-wrap">by COVID—19.</span>', // eslint-disable-line max-len
				button: 'Take action'
			};
		}
	},
	inject: ['apollo'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			});
		},
		result({ data }) {
			this.covidLandingActive = _get(data, 'general.mg_covid_active.value') === 'true' || false;
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.already-subscribed-msg-wrapper {
	background-color: $vivid-yellow;
	padding: 0.625rem;
	margin-top: 1.25rem;
}

.mg-hero {
	background-color: $white;
	margin-bottom: 0;
	padding-bottom: 1rem;
	position: relative;
	overflow: hidden;

	::v-deep .overlay-holder {
		display: flex;
		flex-direction: column-reverse;

		.mg-hero-picture {
			@include breakpoint(large) {
				position: absolute;
				top: 0;
				bottom: 0;
			}

			// Prevent whitespace below the image in browsers that understand object-fit. (IE11 will see some whitepace)
			@supports (object-fit: cover) {
				img {
					object-fit: cover;
					height: 100%;
					width: 100%;
				}
			}
		}

		.overlay-content {
			margin-top: -1rem;
			margin-left: 1rem;
			margin-right: 1rem;
			z-index: 10;
			position: relative;
			top: auto;
			width: auto;
			transform: none;

			@include breakpoint(large) {
				margin-top: 2.5rem;
				margin-bottom: 1.5rem;
			}

			.overlay-column {
				max-width: none;
				padding: 1.5rem 1.5rem 1.25rem;
				background-color: $white;
				border-radius: 1rem;
				// initial idea for giving some definition to the form over a white bg
				box-shadow: 0 0 rem-calc(4) rgba(0, 0, 0, 0.2);

				@include breakpoint(large) {
					max-width: 31.25rem;
					padding: 2.5rem 2.5rem 2.25rem;
				}
			}
		}
	}

	//set min height to improve sizing when image has not loaded yet
	min-height: 6.25rem;

	@include breakpoint(xlarge) {
		min-height: 20rem;
		flex-direction: column;
	}
	@include breakpoint(xxlarge) {
		min-height: 24.65rem;
	}
	@include breakpoint(xga) {
		min-height: 27rem;
	}
}

.page-content {
	padding: 1.625rem 0;
}

.section {
	margin-bottom: 2rem;

	@include breakpoint(xlarge) {
		margin-bottom: 5rem;
	}
}

.separator {
	width: 100%;
	border-top: rem-calc(1) solid $kiva-stroke-gray;
}

.mg-headline {
	@include large-text();

	margin-bottom: 0.25rem;
}

.mg-subhead {
	@include medium-text();

	padding: 0;
	margin-bottom: 1.5rem;
}

.mg-explained {
	margin-bottom: 1rem;

	@include breakpoint(xlarge) {
		margin-bottom: 4rem;
	}
}

.about-wrapper {
	background: $kiva-bg-lightgray;
}

.about {
	margin-top: 2rem;
	margin-bottom: 2rem;

	@include breakpoint(xlarge) {
		margin-top: 5rem;
		margin-bottom: 5rem;
	}
}

</style>
