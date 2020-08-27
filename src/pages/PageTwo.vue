<template>
	<!-- This is a sample page which recreates the monthly good landing page but with content from contentful -->
	<www-page>
		<kv-hero class="mg-hero" :class="{'experiment':isExperimentActive}">
			<template v-slot:images>
				<kv-responsive-image
					:images="heroImages"
					alt="A woman in a yellow dress with a look of pride and satisfaction on her face "
				/>
			</template>
			<template v-slot:overlayContent>
				<div class="row">
					<div class="overlay-column columns medium-12 large-8">
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
								<a href="/settings/subscriptions">subscription settings</a>.
							</h4>
						</div>
					</div>
				</div>
			</template>
		</kv-hero>
		<how-it-works />

		<div v-for="(contentGroup, index) in contentGroups" :key="index">
			<!-- KivaAsExpertContentful Component -->
			<component
				v-if="contentGroup.key === 'monthlyGoodKivaAsExpert'"
				:is="'kiva-as-expert-contentful'"
				:content-group="contentGroup"
			>
				<template v-slot:form>
					<landing-form
						:amount.sync="monthlyGoodAmount"
						:selected-group.sync="selectedGroup"
						:key="2"
						v-if="!isMonthlyGoodSubscriber"
						:button-text="pageCopy.button"
					/>
					<div class="already-subscribed-msg-wrapper" v-if="isMonthlyGoodSubscriber">
						<h4>
							You're already signed up for Monthly Good.
							Changes to this contribution can be made in your
							<a href="/settings/subscriptions">subscription settings</a>.
						</h4>
					</div>
				</template>
			</component>
			<!-- EmailPreviewContentful Component -->
			<component
				v-if="contentGroup.key === 'monthlyGoodDelivered'"
				:is="'email-preview-contentful'"
				:content-group="contentGroup"
			/>
		</div>

		<more-about-kiva />
		<frequently-asked-questions />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import contentful from '@/graphql/query/contentful.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

import LandingForm from '@/pages/MonthlyGood/LandingForm';
import HowItWorks from '@/pages/MonthlyGood/HowItWorks';
import EmailPreviewContentful from '@/pages/MonthlyGood/EmailPreviewContentful';

import MoreAboutKiva from '@/pages/MonthlyGood/MoreAboutKiva';
import KivaAsExpertContentful from '@/pages/MonthlyGood/KivaAsExpertContentful';
import FrequentlyAskedQuestions from '@/components/MonthlyGood/FrequentlyAskedQuestions';

const pageQuery = gql`query pageTwo {
		my {
			autoDeposit {
				isSubscriber
			}
		}
		general {
			uiExperimentSetting(key: "mg_hero") {
				key
				value
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
		HowItWorks,
		MoreAboutKiva,
		KivaAsExpertContentful,
		FrequentlyAskedQuestions,
		EmailPreviewContentful
	},
	data() {
		return {
			isExperimentActive: false,
			isMonthlyGoodSubscriber: false,
			monthlyGoodAmount: 25,
			selectedGroup: 'default',
			heroImages: [
				['small', heroImagesRequire('./monthlygood-banner-sm-std.jpg')],
				['small retina', heroImagesRequire('./monthlygood-banner-sm-retina.jpg')],
				['medium', heroImagesRequire('./monthlygood-banner-med-std_0.jpg')],
				['medium retina', heroImagesRequire('./monthlygood-banner-med-retina_0.jpg')],
				['large', heroImagesRequire('./monthlygood-banner-lg-std_0.jpg')],
				['large retina', heroImagesRequire('./monthlygood-banner-lg-retina_0.jpg')],
				['xga', heroImagesRequire('./monthlygood-banner-xl-std_0.jpg')],
				['xga retina', heroImagesRequire('./monthlygood-banner-xl-retina_0.jpg')],
				['wxga', heroImagesRequire('./monthlygood-banner-xxl-std.jpg')],
				['wxga retina', heroImagesRequire('./monthlygood-banner-xxl-retina.jpg')],
			],
			// contentful data
			contentGroups: []
		};
	},
	computed: {
		pageCopy() {
			if (this.isExperimentActive) {
				return {
					headline: 'It\'s easy to do good.',
					subhead: 'Support borrowers worldwide with monthly contributions as little as $5.',
					button: 'Start Monthly Good'
				};
			}
			return {
				headline: 'Invest in people,<br/> be a force for good',
				subhead: 'Join our Monthly Good program — the simplest way to help entrepreneurs around the world achieve their dreams.', // eslint-disable-line max-len
				button: 'Contribute monthly'
			};
		}
	},
	inject: ['apollo', 'federation'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery,
			}).then(() => {
				return client.query({
					query: experimentQuery, variables: { id: 'mg_hero' }
				});
			});
		},
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			// Monthly Good Hero Experiment - EXP-CASH-1774-Feb2020
			const mgHeroExperiment = this.apollo.readFragment({
				id: 'Experiment:mg_hero',
				fragment: experimentVersionFragment,
			}) || {};
			this.isExperimentActive = mgHeroExperiment.version === 'shown';
			// Fire Event for EXP-CASH-1774-Feb2020
			if (mgHeroExperiment.version && mgHeroExperiment.version !== 'unassigned') {
				this.$kvTrackEvent(
					'MonthlyGood',
					'EXP-CASH-1774-Feb2020',
					mgHeroExperiment.version === 'shown' ? 'b' : 'a'
				);
			}
		},
	},
	created() {
		this.federation.query({
			query: contentful,
			variables: {
				contentType: 'page',
				contentKey: 'monthlygood',
			},
		}).then(({ data }) => {
			// Process Contentful Content
			// Page Layout
			const pageMonthlyGood = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'monthlygood'); // eslint-disable-line max-len
			console.log('pageMonthlyGood', pageMonthlyGood);
			// Choose Page Layout here
			const { pageLayout } = pageMonthlyGood.fields;
			console.log('pageLayout', pageLayout);
			// Pass content groups to components
			this.contentGroups = pageLayout.fields.contentGroups.map(contentGroup => contentGroup.fields);
			console.log('contentGroups', this.contentGroups);
		});
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

.hero.mg-hero {
	::v-deep .overlay-content {
		.overlay-column {
			max-width: none;
			@include breakpoint(medium) {
				max-width: 31.25rem;
			}
		}
	}

	margin-bottom: 0;

	::v-deep form {
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

.mg-headline,
.mg-subhead {
	color: white;
	text-shadow: 1px 1px 3px #333;
	margin: 0;
}

.mg-headline {
	font-weight: bold;
	font-size: 2rem;
	line-height: 2rem;

	@include breakpoint(xlarge) {
		font-size: 2.375rem;
		line-height: 2.375rem;
	}
}

.mg-subhead {
	padding: 0;
	font-size: 1.2rem;
	line-height: 1.35rem;
	margin-bottom: 0.65rem;

	@include breakpoint(xlarge) {
		padding-top: 0.875rem;
		font-size: 1.5rem;
		line-height: 1.75rem;
		margin-bottom: 1rem;
	}
}

// Experiment Styles - CASH-1774
.mg-hero.experiment {
	::v-deep .overlay-content {
		bottom: 0;
		top: auto;
		transform: none;
		@include breakpoint(large) {
			top: 50%;
			bottom: auto;
			transform: translateY(-50%);
		}

		.overlay-column {
			max-width: none;
			padding: 1.5rem 1rem 0.5rem;
			background-color: rgba(0, 0, 0, 0.35);
			@include breakpoint(large) {
				max-width: 31.25rem;
				padding: 1.5rem 2rem 1.25rem 2rem;
			}
		}
	}

	::v-deep .images > div,
	::v-deep .images img {
		min-height: 18.75rem;
	}

	.mg-headline,
	.mg-subhead {
		text-shadow: none;
		padding-top: 0;
	}

	::v-deep form {
		button {
			width: 100%;
			margin-top: 0.75rem;
		}
	}

	.mg-subhead {
		max-width: 28.125rem;
		margin: 1rem 0 1.35rem 0;
		font-size: 1.15rem;
		line-height: 1.25rem;
		@include breakpoint(xlarge) {
			font-size: 1.25rem;
			line-height: 1.5rem;
		}
	}
}
</style>
