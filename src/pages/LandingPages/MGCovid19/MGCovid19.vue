<template>
	<www-page id="co19-landing">
		<kv-hero class="mg-hero" :class="{'experiment':isExperimentActive}">
			<!-- TODO Update to handle new images and design -->
			<template v-slot:images>
				<kv-responsive-image
					:images="heroImages"
					alt="A woman in a yellow dress with a look of pride and satisfaction on her face "
				/>
			</template>
			<template v-slot:overlayContent>
				<div class="row">
					<div class="overlay-column columns medium-10 medium-offset-1 large-6 large-offset-0 xlarge-5">
						<p class="mg-headline" v-html="pageCopy.headline">
						</p>
						<p class="mg-subhead">
							{{ pageCopy.subhead }}
						</p>
						<landing-form
							:amount.sync="monthlyGoodAmount"
							:selected-group.sync="selectedGroup"
							:key="1"
							:button-text="pageCopy.button"
							v-if="!isMonthlyGoodSubscriber"
						/>
						<div class="already-subscribed-msg-wrapper" v-if="isMonthlyGoodSubscriber">
							<h4>
								You're already signed up for Monthly Good.
								Changes to this contribution can be made in your
								<a href="/settings/credit">credit settings</a>.
							</h4>
						</div>
					</div>
				</div>
			</template>
		</kv-hero>

		<div class="benefits">
			<m-g-covid-explained />
		</div>

		<div class="about-kiva row page-content">
			<div class="columns">
				<h2 class="impact-text text-center">
					Over $1.4 billion in impact in 70+ countries
				</h2>
				<p>
					Kiva is an international nonprofit, founded in 2005 in San Francisco, with a mission
					to expand financial access to help underserved communities thrive and in some cases,
					provide relief when crises may arise.
				</p>
				<p>
					We do this by crowdfunding loans and unlocking capital for the underserved, improving
					the quality and cost of financial services, and addressing the underlying barriers to
					financial access around the world. Through Kiva's work, students can pay for tuition,
					women can start businesses, farmers are able to invest in equipment and families can
					afford needed emergency care.
				</p>
				<p class="featured-text text-center">
					By lending as little as $25 on Kiva, you can be part of the solution and make a real
					difference in someone’s life.
				</p>
				<h4 class="text-center">
					100% of every dollar you lend on Kiva goes to funding loans.
				</h4>
			</div>
		</div>

		<div class="footnotes row page-content">
			<div class="columns">
				<h3>Footnotes:</h3>
				<ul>
					<li>
						If you choose “One-time support”, the selected amount will only be deposited once.
					</li>
					<li>
						If there is no longer a need for this fund, we’ll get in touch with you to ask
						you to change your settings.
					</li>
					<!-- <li>
						We will record prior category settings for previous Monthly Good subscribers.
					</li> -->
					<li>
						Deposited funds for COVID-19 relief may be withdrawn or relent after they have
						gone through 1 full loan cycle.
					</li>
				</ul>
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
import MGCovidExplained from './MGCovidExplained';

import LandingForm from './CovidLandingForm';

const pageQuery = gql`{
	my {
		autoDeposit {
			isSubscriber
		}
	}
}`;

const heroImagesRequire = require.context('@/assets/images/mg-landing-hero', true);

export default {
	components: {
		WwwPage,
		LandingForm,
		KvHero,
		KvResponsiveImage,
		MGCovidExplained,
	},
	props: {
		category: {
			type: String,
			default: 'covid-relief'
		}
	},
	data() {
		return {
			isExperimentActive: true,
			isMonthlyGoodSubscriber: false,
			monthlyGoodAmount: 25,
			selectedGroup: this.category || 'default',
			heroImages: [
				['small', heroImagesRequire('./monthlygood-banner-sm-std.jpg')],
				['small retina', heroImagesRequire('./monthlygood-banner-sm-retina.jpg')],
				// ['small', heroImagesRequire('./monthlygood-banner-med-std_0.jpg')],
				// ['small retina', heroImagesRequire('./monthlygood-banner-med-retina_0.jpg')],
				['medium', heroImagesRequire('./monthlygood-banner-med-std_0.jpg')],
				['medium retina', heroImagesRequire('./monthlygood-banner-med-retina_0.jpg')],
				['large', heroImagesRequire('./monthlygood-banner-lg-std_0.jpg')],
				['large retina', heroImagesRequire('./monthlygood-banner-lg-retina_0.jpg')],
				['xga', heroImagesRequire('./monthlygood-banner-xl-std_0.jpg')],
				['xga retina', heroImagesRequire('./monthlygood-banner-xl-retina_0.jpg')],
				['wxga', heroImagesRequire('./monthlygood-banner-xxl-std.jpg')],
				['wxga retina', heroImagesRequire('./monthlygood-banner-xxl-retina.jpg')],
			],
		};
	},
	computed: {
		pageCopy() {
			return {
				headline: 'Join Kiva\'s Global COVID-19 Response',
				subhead: 'Provide relief to entrepreneurs, small businesses, students, and families impacted by COVID-19 Coronavirus.', // eslint-disable-line max-len
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
	background-color: $kiva-green;
	margin-bottom: 0;
	padding-bottom: 1rem;
	position: relative;
	overflow: hidden;

	::v-deep .overlay-holder {
		display: flex;
		flex-direction: column-reverse;

		picture {
			@include breakpoint(large) {
				position: absolute;
				top: 0;
			}
		}

		.overlay-content {
			margin-top: -1rem;
			z-index: 10;
			position: relative;
			top: auto;
			width: auto;
			transform: none;

			@include breakpoint(large) {
				margin-top: 1rem;
				margin-left: 1rem;
			}

			.overlay-column {
				max-width: none;
				// @include breakpoint(medium) {
				// 	max-width: 31.25rem;
				// }
				padding: 1.5rem 1.5rem 1.25rem;
				background-color: $white;
				border-radius: 1rem;

				@include breakpoint(large) {
					max-width: 31.25rem;
					padding: 1.5rem 1.5rem 1.25rem;
				}
			}
		}
	}

	::v-deep .images > div,
	::v-deep .images img {
		min-height: 18.75rem;
	}

	::v-deep form {
		button {
			width: 100%;
			margin-top: 0.75rem;
		}
		// overwrite styles for error display over hero image
		.validation-errors {
			border: 1px solid $charcoal;
			background-color: rgba(255, 255, 255, 0.7);
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

.mg-headline {
	font-weight: bold;
	font-size: 2rem;
	line-height: 2rem;
}

.mg-subhead {
	padding: 0;
	font-size: 1.2rem;
	line-height: 1.35rem;
	margin-bottom: 0.65rem;
}

.about-kiva {
	h2 {
		color: $kiva-green;
	}
}
</style>
