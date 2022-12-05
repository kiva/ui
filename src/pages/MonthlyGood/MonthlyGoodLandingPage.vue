<template>
	<www-page>
		<kv-hero
			v-if="!isImpactVisibilityExperiment"
			class="tw-text-center"
			style="margin-bottom: 0;"
		>
			<template #images>
				<kv-contentful-img
					:contentful-src="heroImage"
					fallback-format="jpg"
					:width="1440"
					:alt="heroImageAlt"
					:source-sizes="sourceSizes"
					crop="&fit=fill&f=top"
				/>
			</template>
			<template #overlayContent>
				<div class="row">
					<div
						class="tw-max-w-sm tw-bg-white tw-rounded tw-hidden
					md:tw-block tw-ml-2 tw-p-2 tw-text-left"
					>
						<h1
							class="tw-text-primary
						tw-text-h2" v-html="heroHeadline"
						></h1>
						<p class="tw-mt-2 tw-mb-3 tw-text-subhead tw-text-primary" v-html="heroBody"></p>
						<landing-form
							:amount.sync="monthlyGoodAmount"
							:selected-group.sync="selectedGroup"
							key="top"
							:button-text="heroPrimaryCtaText"
							v-if="!isMonthlyGoodSubscriber && !hasModernSub"
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
					<div
						class="tw-absolute tw-w-full tw-h-full tw-flex tw-flex-col tw-justify-end
				tw-text-white tw-p-2 lg:tw-max-w-5xl lg:tw-pb-2 lg:tw-rounded"
						style="background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 85%);
						left: 50%;
						transform: translate(-50%, 0);"
					>
						<div class="tw-max-w-2xl tw-mx-auto">
							<h2>It’s easy to do good</h2>
							<p class="tw-mb-5 tw-text-subhead">
								Support borrowers worldwide with monthly contributions as little as $5.
							</p>
						</div>
					</div>
					<div
						class="tw-p-2 tw-absolute -tw-mt-8 tw-flex tw-justify-center tw-w-full tw-z-10"
						style="top: 90%;"
					>
						<div
							class="tw-bg-white tw-rounded tw-p-2 tw-pb-0"
							style="box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);"
						>
							<landing-form-visibility-exp
								:amount.sync="monthlyGoodAmount"
								:selected-group.sync="selectedGroup"
								key="top"
								:button-text="heroPrimaryCtaText"
							/>
						</div>
					</div>
					<img
						class="tw-object-cover lg:tw-object-contain lg:tw-max-w-5xl tw-mx-auto
						lg:tw-rounded"
						style="min-height: 440px;"
						:src="heroImage" alt=""
					>
				</div>
				<div class="tw-pt-16 md:tw-pt-11 lg:tw-max-w-5xl lg:tw-mx-auto tw-px-2 tw-text-left">
					<h2 class="md:tw-text-center tw-text-subhead">
						With these settings, you’ll support borrowers like this.
					</h2>

					<!-- eslint-disable-next-line max-len -->
					<!-- TODO: we would want to accommodate LoanDetailsCard here as well if isImpactVisibilityExperiment is true  -->
					<kiva-classic-loan-carousel-exp
						:is-visible="showCarousel"
						:loan-ids="selectedChannelLoanIds"
						:selected-channel="selectedChannel"
						:show-view-more-card="showViewMoreCard"
						id="carousel_exp"
					/>

					<p class="tw-text-small tw-text-center tw-mt-4">
						You can change your lending settings or cancel at any time.
					</p>
				</div>
			</template>
		</kv-hero>
		<div class="tw-bg-white tw-rounded md:tw-hidden tw-px-2">
			<h1
				class="tw-text-primary tw-shadow-transparent tw-mt-2
			tw-text-h2" v-html="heroHeadline"
			></h1>
			<p class="tw-text-subhead tw-text-primary tw-my-2" v-html="heroBody"></p>
			<landing-form
				:amount.sync="monthlyGoodAmount"
				:selected-group.sync="selectedGroup"
				key="top"
				:button-text="heroPrimaryCtaText"
				v-if="!isMonthlyGoodSubscriber && !hasModernSub"
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
		<automatically-support-notice
			:value-headline="personalizedHeadline"
			:value-body="personalizedBody"
			:value-image="personalizedImage"
			:value-image-alt="personalizedImageAlt"
			class="tw-my-8"
		/>
		<how-it-works />
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
import AutomaticallySupportNotice from '@/components/MonthlyGood/AutomaticallySupportNotice';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

import LandingForm from './LandingForm';
import LandingFormVisibilityExp from './LandingFormVisibilityExp';
import HowItWorks from './HowItWorks';
import EmailPreview from './EmailPreview';
import MoreAboutKiva from './MoreAboutKiva';
import KivaAsExpert from './KivaAsExpert';

const mgLandingPageImageRequire = require.context('@/assets/images/mg-landing-page', true);

const pageQuery = gql`
	query monthlyGoodLandingPage {
		my {
			autoDeposit {
				id
				isSubscriber
			}
		}
		general {
			mgHeroExp: uiExperimentSetting(key: "mg_hero_show_loans") {
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
	name: 'MonthlyGoodLandingPage',
	metaInfo() {
		return	{
			title: 'Make an impact with Monthly Good',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Monthly good allows you to support borrowers worldwide with as little as $5 a month.'
						+ ' 100% of your loan goes to the field - make a difference today!'
				}
			]
		};
	},
	mixins: [
		loanGroupCategoriesMixin
	],
	components: {
		EmailPreview,
		HowItWorks,
		KivaAsExpert,
		KvContentfulImg,
		KvFrequentlyAskedQuestions,
		KvHero,
		LandingForm,
		LandingFormVisibilityExp,
		MoreAboutKiva,
		WwwPage,
		KivaClassicLoanCarouselExp,
		AutomaticallySupportNotice,
	},
	props: {
		category: {
			type: String,
			default: 'default',
		},
	},
	data() {
		return {
			isImpactVisibilityExperiment: false,
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
					height: 620,
					media: 'min-width: 681px',
				},
				{
					width: 680,
					height: 441,
					media: 'min-width: 481px',
				},
				{
					width: 480,
					height: 540,
					media: 'min-width: 0px',
				},
			],
			landingPageImages: [
				['small', mgLandingPageImageRequire('./mg-chooseloan-mobile.png')],
				['xga', mgLandingPageImageRequire('./mg-chooseloan-desktop.png')],
			],
			hasModernSub: false,
			selectedChannelLoanIds: [],
			selectedChannel: {},
			showCarousel: true,
			showViewMoreCard: false,
		};
	},
	created() {
		const resultsArray = this.lendingCategories.filter(element => {
			return element.value === this.category;
		});
		this.selectedChannelLoanIds = resultsArray?.[0]?.expLoansIds ?? [];
	},
	watch: {
		selectedGroup() {
			const resultsArray = this.lendingCategories.filter(element => {
				return element.value === this.selectedGroup;
			});
			this.selectedChannelLoanIds = resultsArray?.[0]?.expLoansIds ?? [];
			this.$kvTrackEvent(
				'MonthlyGood',
				'click-category-option',
				resultsArray?.[0]?.marketingName ?? 'category changed'
			);
		}
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
						// eslint-disable-next-line max-len
						client.query({ query: experimentQuery, variables: { id: 'mg_hero_show_loans' } }),
					]);
				});
		},
		result({ data }) {
			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
			const modernSubscriptions = data?.mySubscriptions?.values ?? [];
			this.hasModernSub = modernSubscriptions.length !== 0;

			// mg_hero_show_loans
			// Hero Loan Visibility Experiment - CORE-451
			const mgHeroLoansExperiment = this.apollo.readFragment({
				id: 'Experiment:mg_hero_show_loans',
				fragment: experimentVersionFragment,
			}) || {};
			this.isImpactVisibilityExperiment = mgHeroLoansExperiment.version === 'b';
			// Fire Event for EXP-CORE-451-Mar2022
			if (mgHeroLoansExperiment.version && mgHeroLoansExperiment.version !== 'unassigned') {
				this.$kvTrackEvent(
					'MonthlyGood',
					'EXP-CORE-451-Mar2022',
					mgHeroLoansExperiment.version
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
		faqChoiceTestGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'monthly-good-faqs-choice-test' : false;
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
			return this.heroText?.headline ?? 'Monthly lending personalized for you.';
		},
		heroPrimaryCtaText() {
			return this.heroText?.primaryCtaText ?? 'Start Monthly Good';
		},
		personalizedContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'personalized-mg-landing-value-prop' : false;
			});
		},
		personalizedText() {
			// This contentGroup doesnt have a type, so find by key
			return this.personalizedContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'personalized-mg-landing-value-text';
			});
		},
		personalizedHeadline() {
			return this.personalizedText?.headline ?? 'Automatically support borrowers chosen for you.';
		},
		personalizedBody() {
			const text = this.personalizedText?.bodyCopy ?? '';
			return documentToHtmlString(text).replace(/\n/g, '<br />');
		},
		personalizedImage() {
			return this.personalizedContentGroup?.media?.[0]?.file?.url ?? '';
		},
		personalizedImageAlt() {
			return this.personalizedContentGroup?.media?.[0]?.description ?? '';
		},
	},
	methods: {
		redirectAutodeposit() {
			this.$router.push({
				path: '/auto-deposit',
			});
		},
		redirectMonthlyGoodSignup() {
			this.$router.push({
				path: '/monthlygood/setup',
				query: {
					amount: this.monthlyGoodAmount,
					category: this.selectedGroup
				}
			});
		},
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

@include breakpoint(xxlarge) {
	#carousel_exp >>> section > div:nth-child(2) {
		display: none;
	}
}

#carousel_exp >>> section > div:nth-child(1) > div {
	max-width: 310px !important;
}
</style>
