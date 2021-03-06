<template>
	<www-page>
		<kv-hero
			class="mg-hero bg-overlay"
			:class="{ experiment: isExperimentActive }"
		>
			<template #images>
				<kv-contentful-img
					:contentful-src="heroImage"
					fallback-format="jpg"
					:width="1440"
					:alt="heroImageAlt"
					:source-sizes="sourceSizes"
					crop="&fit=fill&f=face"
				/>
			</template>
			<template #overlayContent>
				<div class="row">
					<div class="overlay-column columns medium-12 large-8">
						<p class="mg-headline" v-html="heroHeadline"></p>
						<div class="mg-subhead" v-html="heroBody"></div>
						<landing-form
							:amount.sync="monthlyGoodAmount"
							:selected-group.sync="selectedGroup"
							key="top"
							:button-text="heroPrimaryCtaText"
							v-if="!isMonthlyGoodSubscriber && !isExperimentActive"
						/>
						<landing-form-experiment
							:amount.sync="monthlyGoodAmount"
							:selected-group.sync="selectedGroup"
							key="top"
							:button-text="heroPrimaryCtaText"
							v-if="!isMonthlyGoodSubscriber && isExperimentActive"
						/>
						<div
							class="already-subscribed-msg-wrapper"
							v-if="isMonthlyGoodSubscriber"
						>
							<h4>
								You're already signed up for Monthly Good. Changes to this
								contribution can be made in your
								<a href="/settings/subscriptions">subscription settings</a>.
							</h4>
						</div>
					</div>
				</div>
			</template>
		</kv-hero>
		<how-it-works :is-experiment-active="isExperimentActive" />
		<email-preview />
		<kiva-as-expert>
			<template #form>
				<landing-form
					:amount.sync="monthlyGoodAmount"
					:selected-group.sync="selectedGroup"
					key="bottom"
					v-if="!isMonthlyGoodSubscriber"
					:button-text="heroPrimaryCtaText"
				/>
				<div
					class="already-subscribed-msg-wrapper"
					v-if="isMonthlyGoodSubscriber"
				>
					<h4>
						You're already signed up for Monthly Good. Changes to this
						contribution can be made in your
						<a href="/settings/subscriptions">subscription settings</a>.
					</h4>
				</div>
			</template>
		</kiva-as-expert>
		<more-about-kiva />
		<frequently-asked-questions />
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';

import { processPageContentFlat } from '@/util/contentfulUtils';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvHero from '@/components/Kv/KvHero';
import FrequentlyAskedQuestions from '@/components/MonthlyGood/FrequentlyAskedQuestions';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

import LandingForm from './LandingForm';
import LandingFormExperiment from './LandingFormExperiment';
import HowItWorks from './HowItWorks';
import EmailPreview from './EmailPreview';
import MoreAboutKiva from './MoreAboutKiva';
import KivaAsExpert from './KivaAsExpert';

const pageQuery = gql`
	query monthlyGoodLandingPage {
		my {
			autoDeposit {
				id
				isSubscriber
			}
		}
		general {
			uiExperimentSetting(key: "mg_amount_selector") {
				key
				value
			}
		}
		contentful {
			entries(contentType: "page", contentKey: "monthlygood")
		}
	}
`;

export default {
	metaInfo: {
		title: 'Start Monthly Good',
	},
	components: {
		EmailPreview,
		FrequentlyAskedQuestions,
		HowItWorks,
		KivaAsExpert,
		KvContentfulImg,
		KvHero,
		LandingForm,
		LandingFormExperiment,
		MoreAboutKiva,
		WwwPage,
	},
	props: {
		category: {
			type: String,
			default: 'default',
		},
	},
	data() {
		return {
			isExperimentActive: false,
			isMonthlyGoodSubscriber: false,
			monthlyGoodAmount: 25,
			selectedGroup: this.category || 'default',
			pageData: {},
			sourceSizes: [
				{
					width: 1920,
					height: 650,
					media: 'min-width: 1441px',
				},
				{
					width: 1440,
					height: 620,
					media: 'min-width: 1025px',
				},
				{
					width: 1024,
					height: 441,
					media: 'min-width: 681px',
				},
				{
					width: 680,
					height: 372,
					media: 'min-width: 481px',
				},
				{
					width: 480,
					height: 540,
					media: 'min-width: 0px',
				},
			],
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client
				.query({
					query: pageQuery,
				})
				.then(() => {
					return client.query({
						query: experimentQuery,
						variables: { id: 'mg_amount_selector' },
					});
				});
		},
		result({ data }) {
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			// Monthly Good Amount Selector Experiment - EXP-GROW-11-Apr2020
			const mgAmountSelectorExperiment = this.apollo.readFragment({
				id: 'Experiment:mg_amount_selector',
				fragment: experimentVersionFragment,
			}) || {};
			this.isExperimentActive = mgAmountSelectorExperiment.version === 'shown';
			// Fire Event for EXP-GROW-11-Apr2020
			if (mgAmountSelectorExperiment.version && mgAmountSelectorExperiment.version !== 'unassigned') {
				this.$kvTrackEvent(
					'MonthlyGood',
					'EXP-GROW-11-Apr2020',
					mgAmountSelectorExperiment.version === 'shown' ? 'b' : 'a'
				);
			}

			// Check for contentful content
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;
		},
	},
	computed: {
		heroImage() {
			return this.heroContentGroup?.media?.[0]?.file?.url ?? '';
		},
		heroImageAlt() {
			return this.heroContentGroup?.media?.[0]?.description ?? '';
		},
		heroContentGroup() {
			return this.pageData?.page?.contentGroups?.monthlygoodLandingHero ?? null;
		},
		heroText() {
			// eslint-disable-next-line max-len
			return this.heroContentGroup?.contents?.find(contentItem => contentItem.key === 'mg-landing-hero-text');
		},
		heroBody() {
			const text = this.heroText?.bodyCopy ?? '';
			return documentToHtmlString(text).replace(/\n/g, '<br />');
		},
		heroHeadline() {
			return this.heroText?.headline ?? "It's easy to do good.";
		},
		heroPrimaryCtaText() {
			return this.heroText?.primaryCtaText ?? 'Start Monthly Good';
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

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

	::v-deep .kv-contentful-img,
	::v-deep .kv-contentful-img__img {
		display: block;
		width: 100%;
		height: auto;
	}

	::v-deep form {
		// overwrite styles for error display over hero image
		.validation-errors {
			border: 1px solid $charcoal;
			background-color: rgba(255, 255, 255, 0.7);
		}
	}

	margin-bottom: 0;
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
.mg-hero.bg-overlay {
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

// Experiment Styles - GROW-11
.mg-hero.experiment {
	min-height: 52rem;
	background: #4faf4e;

	@include breakpoint(medium) {
		min-height: 8rem;
	}

	::v-deep .overlay-holder {
		picture {
			height: 32rem;
			overflow: hidden;
		}
	}

	::v-deep .overlay-content {
		top: auto;
		bottom: 0;
		transform: none;

		@include breakpoint(medium) {
			top: 17rem;
			bottom: auto;
		}

		@include breakpoint(large) {
			top: 2rem;
			margin-left: 1rem;
		}

		.overlay-column {
			background-color: white;
			padding: 2rem 2rem 1.25rem;
			border-radius: 1rem;
			max-width: 26rem !important;
			margin: 0 auto;

			@include breakpoint(large) {
				max-width: 22rem !important;
				margin: 0;
			}

			@include breakpoint(xlarge) {
				max-width: 26rem !important;
			}
		}
	}

	.mg-headline,
	.mg-subhead {
		color: #484848;
	}

	::v-deep form {
		@include breakpoint(large) {
			max-width: 23rem;
		}
	}
}
</style>
