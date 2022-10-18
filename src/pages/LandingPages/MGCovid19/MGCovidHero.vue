<template>
	<kv-hero class="mg-hero">
		<template #images>
			<kv-responsive-image
				class="mg-hero-picture"
				:images="heroImages"
				alt=""
				v-if="!expVideoActive"
			/>
		</template>
		<template #overlayContent>
			<div class="row">
				<div
					class="
						video-column
						columns
						small-12 xlarge-5 xxlarge-6
						align-self-middle"
					v-if="expVideoActive"
				>
					<div class="video-container">
						<!-- eslint-disable max-len -->
						<iframe
							src="https://www.youtube-nocookie.com/embed/WCraaM6PAos?autoplay=1&mute=1&modestbranding=1&rel=0"
							frameborder="0"
							allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
						<!-- eslint-enable max-len -->
					</div>
				</div>

				<div
					class="
						overlay-column columns
						medium-10 medium-offset-1 large-8 large-offset-0 xlarge-7 xxlarge-6"
				>
					<h1 class="tw-mb-2 tw-text-h2" v-html="pageCopy.headline"></h1>
					<p class="tw-mb-4" v-html="pageCopy.subhead"></p>
					<covid-landing-form
						:key="1"
						:button-text="pageCopy.button"
						v-if="!isMonthlyGoodSubscriber && covidLandingActive"
					/>
					<div class="already-subscribed-msg-wrapper" v-else-if="isMonthlyGoodSubscriber">
						<h4>
							You're already signed up for Monthly Good.
							Changes to this contribution can be made in your
							<a href="/settings/subscriptions">subscription settings</a>.
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
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';

import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import CovidLandingForm from './CovidLandingForm';

const pageQuery = gql`
  query monthlyGoodCovidHero {
    general {
      mg_covid_active: uiConfigSetting(key: "covid_landing_active") {
        key
        value
      }
      video_exp: uiExperimentSetting(key: "covid_landing_video") {
        key
        value
      }
    }
    my {
      autoDeposit {
        id
        isSubscriber
      }
    }
  }
`;

const heroImagesRequire = require.context('@/assets/images/covid-hero-v2', true);

export default {
	name: 'MGCovidHero',
	metaInfo: {
		title: "Join Kiva's Global COVID-19 Response"
	},
	components: {
		CovidLandingForm,
		KvHero,
		KvResponsiveImage,
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			}).then(() => {
				return client.query({ query: experimentAssignmentQuery, variables: { id: 'covid_landing_video' } });
			});
		},
		result({ data }) {
			this.covidLandingActive = _get(data, 'general.mg_covid_active.value') === 'true' || false;
			this.isMonthlyGoodSubscriber = _get(
				data,
				'my.autoDeposit.isSubscriber',
				false
			);
			const covidVideoExp = this.apollo.readFragment({
				id: 'Experiment:covid_landing_video',
				fragment: experimentVersionFragment,
			}) || {};
			const { version } = covidVideoExp;
			this.expVideoActive = version === 'shown';
			if (version === 'control' || version === 'shown') {
				this.$kvTrackEvent('Home', 'EXP-GROW-112-May2020', this.expVideoActive ? 'b' : 'a');
			}
		}
	},
	props: {
		category: {
			type: String,
			default: 'covid-relief'
		},
	},
	data() {
		return {
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
			expVideoActive: true,
			isMonthlyGoodSubscriber: false,
			covidLandingActive: false,
		};
	},
	computed: {
		pageCopy() {
			return {
				headline: 'Join Kiva\'s Global COVID‑19 Response', // eslint-disable-line max-len
				subhead: 'Lend a hand to provide relief to entrepreneurs and small businesses impacted by COVID‑19.', // eslint-disable-line max-len
				button: 'Take action'
			};
		}
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
	// background-color: #fdf7eb;
	background-color: #EEEFE9;
	margin-bottom: 0 !important;
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
					object-position: 50% 25%; // keep the illustrations heads visible
					height: 100%;
					width: 100%;
				}
			}
		}

		.overlay-content {
			margin-top: -1rem;
			margin-left: 1rem;
			margin-right: 1rem;
			z-index: 1;
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

.video-column {
	margin: 2rem auto;

	@include breakpoint('xlarge') {
		order: 2;
	}
}

.video-container {
	position: relative;
	padding-bottom: 56.25%; // 16:9 ratio
	height: 0;
	overflow: hidden;

	iframe,
	object,
	embed {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
}
</style>
