<template>
	<www-page>
		<kv-hero
			v-if="!isImpactVisibilityExperiment"
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
					<div class="overlay-column columns tw-bg-primary-inverse tw-bg-opacity-[75%] medium-12 large-8">
						<h1 class="mg-headline tw-text-primary-inverse
							tw-text-h2 md:tw-text-h1" v-html="heroHeadline"
						></h1>
						<p class="mg-subhead tw-text-subhead tw-text-primary-inverse" v-html="heroBody"></p>
						<landing-form
							:amount.sync="monthlyGoodAmount"
							:selected-group.sync="selectedGroup"
							key="top"
							:button-text="heroPrimaryCtaText"
							v-if="!isMonthlyGoodSubscriber && !isExperimentActive && !hasModernSub"
						/>
						<landing-form-experiment
							:amount.sync="monthlyGoodAmount"
							:selected-group.sync="selectedGroup"
							key="top"
							:button-text="heroPrimaryCtaText"
							v-if="!isMonthlyGoodSubscriber && isExperimentActive && !hasModernSub"
						/>
						<div
							class="tw-p-2 tw-bg-caution tw-text-black tw-mt-4"
							v-if="isMonthlyGoodSubscriber || hasModernSub"
						>
							<p class="tw-font-medium tw-mb-2">
								You're already signed up for a subscription. Changes to this
								contribution can be made in your
								<a href="/settings/subscriptions">subscription settings</a>.
							</p>
						</div>
					</div>
				</div>
			</template>
		</kv-hero>
		<kv-hero v-if="isImpactVisibilityExperiment">
			<template #images>
				<div class="tw-relative lg:tw-pt-2">
					<div class="tw-absolute tw-w-full tw-h-full tw-flex tw-flex-col tw-justify-end
					tw-text-white tw-p-2 lg:tw-max-w-5xl lg:tw-pb-2 lg:tw-rounded"
						style="background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 80%);
							left: 50%; transform: translate(-50%, 0);"
					>
						<div class="tw-max-w-xl tw-mx-auto">
							<h2>It’s easy to do good</h2>
							<p class="tw-mb-5 tw-text-subhead">
								Support borrowers worldwide with monthly contributions as little as $5.
							</p>
						</div>
					</div>
					<div class="tw-p-2 tw-absolute -tw-mt-8 tw-flex tw-justify-center tw-w-full tw-z-10"
						style="top: 90%"
					>
						<div class="tw-bg-white tw-rounded tw-p-2 tw-pb-0"
							style="box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);"
						>
							<landing-form-visibility-exp
								:amount.sync="monthlyGoodAmount"
								:selected-group.sync="selectedGroup"
								key="top"
								:button-text="heroPrimaryCtaText"
							/>
						</div>
					</div>
					<img class="tw-object-cover lg:tw-object-contain lg:tw-max-w-5xl tw-mx-auto
							lg:tw-rounded"
						style="min-height: 440px;"
						:src="heroImage" alt=""
					>
				</div>
				<div class="tw-pt-16 md:tw-pt-11 lg:tw-max-w-5xl lg:tw-mx-auto tw-px-2">
					<h2 class="md:tw-text-center tw-text-subhead">
						With these settings, you’ll support borrowers like this.
					</h2>

					<kiva-classic-loan-carousel-exp
						:is-visible="showCarousel"
						:loan-ids="selectedChannelLoanIds"
						:selected-channel="selectedChannel"
						:show-view-more-card="showViewMoreCard"
					/>

					<p class="tw-text-small tw-text-center tw-mt-4">
						You can change your lending settings or cancel at any time.
					</p>
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
					v-if="!isMonthlyGoodSubscriber && !hasModernSub"
					:button-text="heroPrimaryCtaText"
				/>
				<div
					class="tw-p-2 tw-bg-caution tw-text-black tw-mt-4"
					v-if="isMonthlyGoodSubscriber || hasModernSub"
				>
					<p class="tw-font-medium tw-mb-2">
						You're already signed up for a subscription. Changes to this
						contribution can be made in your
						<a href="/settings/subscriptions">subscription settings</a>.
					</p>
				</div>
			</template>
		</kiva-as-expert>
		<more-about-kiva />
		<!-- Monthly Good Frequently Asked Questions -->
		<div class="row">
			<kv-frequently-asked-questions
				class="span-12 column
					tw-py-4 md:tw-py-6 lg:tw-py-8"
				:headline="frequentlyAskedQuestionsHeadline"
				:questions="frequentlyAskedQuestions"
			/>
		</div>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';

import { processPageContent } from '@/util/contentfulUtils';

import WwwPage from '@/components/WwwFrame/WwwPage';

import KvHero from '@/components/Kv/KvHero';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import KvFrequentlyAskedQuestions from '@/components/Kv/KvFrequentlyAskedQuestions';
import KivaClassicLoanCarouselExp from '@/components/LoanCollections/KivaClassicLoanCarouselExp';

import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

import LandingForm from './LandingForm';
import LandingFormExperiment from './LandingFormExperiment';
import LandingFormVisibilityExp from './LandingFormVisibilityExp';
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
			mgAmount: uiExperimentSetting(key: "mg_amount_selector") {
				key
				value
			}
			mgPersonalized: uiExperimentSetting(key: "EXP-VUE-399-subscription-appeal-personalization") {
				key
				value
			}
		}
		contentful {
			entries(contentType: "page", contentKey: "monthlygood")
		}
		# mySubscriptions(includeDisabled: false) {
		# 	values {
		# 		id
		# 		enabled
		# 	}
		# }
	}
`;

export default {
	metaInfo: {
		title: 'Start Monthly Good',
	},
	components: {
		EmailPreview,
		HowItWorks,
		KivaAsExpert,
		KvContentfulImg,
		KvFrequentlyAskedQuestions,
		KvHero,
		LandingForm,
		LandingFormExperiment,
		LandingFormVisibilityExp,
		MoreAboutKiva,
		WwwPage,
		KivaClassicLoanCarouselExp,
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
			isImpactVisibilityExperiment: true,
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
			hasModernSub: false,
			selectedChannelLoanIds: [96, 102],
			selectedChannel: {},
			showCarousel: true,
			showViewMoreCard: false
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
					return Promise.all([
						client.query({ query: experimentQuery, variables: { id: 'mg_amount_selector' } }),
						// eslint-disable-next-line max-len
						client.query({ query: experimentQuery, variables: { id: 'EXP-VUE-399-subscription-appeal-personalization' } })
					]);
				});
		},
		result({ data }) {
			// Core-399 Subscriptions Appeal Personalization Experiment
			const subscriptionAppealPersonalization = this.apollo.readFragment({
				id: 'Experiment:EXP-VUE-399-subscription-appeal-personalization',
				fragment: experimentVersionFragment,
			}) || {};
			if (subscriptionAppealPersonalization.version
				&& subscriptionAppealPersonalization.version !== 'unassigned'
			) {
				if (subscriptionAppealPersonalization.version === 'b') {
					// Direct users to new monthly good page here
					this.$router.push({ path: '/monthlygood/personalized' }).catch({});
				} else {
					this.$kvTrackEvent('MonthlyGood', 'EXP-CORE-399-Feb2022', 'a');
				}
			}

			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
			// TODO! Add this back in when service supports non-logged in users
			// const modernSubscriptions = data?.mySubscriptions?.values ?? [];
			// this.hasModernSub = modernSubscriptions.length !== 0;

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
			this.pageData = pageEntry ? processPageContent(pageEntry) : null;
		},
	},
	computed: {
		contentGroups() {
			return this.pageData?.page?.pageLayout?.contentGroups ?? [];
		},
		faqContentGroup() {
			return this.contentGroups?.find(({ type }) => {
				return type ? type === 'frequentlyAskedQuestions' : false;
			});
		},
		frequentlyAskedQuestionsHeadline() {
			return this.faqContentGroup?.title ?? null;
		},
		frequentlyAskedQuestions() {
			return this.faqContentGroup?.contents ?? null;
		},
		heroContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'monthlygood-landing-hero' : false;
			});
		},
		heroImage() {
			return this.heroContentGroup?.media?.[0]?.file?.url ?? '';
		},
		heroImageAlt() {
			return this.heroContentGroup?.media?.[0]?.description ?? '';
		},
		heroText() {
			// This contentGroup doesnt have a type, so find by key
			return this.heroContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'mg-landing-hero-text';
			});
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

.hero.mg-hero {
	::v-deep .overlay-content {
		.overlay-column {
			max-width: none;
			@include breakpoint(medium) {
				max-width: 32.25rem;
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
	text-shadow: 1px 1px 3px #333;
}

.mg-subhead {
	padding: 0;
	margin-bottom: 0.65rem;

	@include breakpoint(xlarge) {
		padding-top: 0.875rem;
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
			@include breakpoint(large) {
				max-width: 32.25rem;
				padding: 1.5rem 2rem 1.25rem 2rem;
			}
		}
	}

	::v-deep .images > div,
	::v-deep .images img {
		min-height: 22.75rem;
		object-fit: cover;
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
