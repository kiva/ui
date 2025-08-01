<!-- eslint-disable vue/no-v-model-argument -->
<template>
	<www-page>
		<kv-hero
			class="tw-text-center"
			style="margin-bottom: 0;"
			v-if="isClientReady"
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
							v-model:amount="monthlyGoodAmount"
							v-model:selected-group="selectedGroup"
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
		<div class="tw-bg-white tw-rounded md:tw-hidden tw-px-2" v-if="isClientReady">
			<h1
				class="tw-text-primary tw-shadow-transparent tw-mt-2
			tw-text-h2" v-html="heroHeadline"
			></h1>
			<p class="tw-text-subhead tw-text-primary tw-my-2" v-html="heroBody"></p>
			<landing-form
				v-model:amount="monthlyGoodAmount"
				v-model:selected-group="selectedGroup"
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
			v-if="isClientReady"
			:value-headline="personalizedHeadline"
			:value-body="personalizedBody"
			:value-image="personalizedImage"
			:value-image-alt="personalizedImageAlt"
			class="tw-my-8"
		/>
		<how-it-works
			:headline-content="howItWorksHeadline"
			:columns-content="howItWorksContent"
		/>
		<email-preview />
		<kiva-as-expert>
			<template #form>
				<landing-form
					v-model:amount="monthlyGoodAmount"
					v-model:selected-group="selectedGroup"
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
import { gql } from 'graphql-tag';

import { processPageContent } from '#src/util/contentfulUtils';

import WwwPage from '#src/components/WwwFrame/WwwPage';

import KvHero from '#src/components/Kv/KvHero';
import KvContentfulImg from '#src/components/Kv/KvContentfulImg';
import KvFrequentlyAskedQuestions from '#src/components/Kv/KvFrequentlyAskedQuestions';
import AutomaticallySupportNotice from '#src/components/MonthlyGood/AutomaticallySupportNotice';
import loanGroupCategoriesMixin from '#src/plugins/loan-group-categories';

import { metaGlobReader } from '#src/util/importHelpers';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import LandingForm from './LandingForm';
import HowItWorks from './HowItWorks';
import EmailPreview from './EmailPreview';
import MoreAboutKiva from './MoreAboutKiva';
import KivaAsExpert from './KivaAsExpert';

const mgLandingPageImageGlob = import.meta.glob('/src/assets/images/mg-landing-page/*.*', { eager: true });
const mgLandingPageImageRequire = metaGlobReader(mgLandingPageImageGlob, '/src/assets/images/mg-landing-page/');

const pageQuery = gql`
	query monthlyGoodLandingPage {
		my {
			id
			autoDeposit {
				id
				isSubscriber
			}
		}
		contentful {
			entries(contentType: "page", contentKey: "monthlygood")
		}
		mySubscriptions(includeDisabled: false) {
			values {
				id
				enabled
			}
		}
	}
`;

export default {
	name: 'MonthlyGoodLandingPage',
	head() {
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
		MoreAboutKiva,
		WwwPage,
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
				['small', mgLandingPageImageRequire('mg-chooseloan-mobile.png')],
				['xga', mgLandingPageImageRequire('mg-chooseloan-desktop.png')],
			],
			hasModernSub: false,
			isClientReady: false,
		};
	},
	watch: {
		selectedGroup() {
			const resultsArray = this.lendingCategories.filter(element => {
				return element.value === this.selectedGroup;
			});
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
		preFetch: true,
		result({ data }) {
			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
			const modernSubscriptions = data?.mySubscriptions?.values ?? [];
			this.hasModernSub = modernSubscriptions.length !== 0;

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
		howItWorksHeadline() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'monthlygood-how-it-works-headline-cg' : false;
			});
		},
		howItWorksContent() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'monthlygood-how-it-works-content-cg' : false;
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
	},
	mounted() {
		this.isClientReady = typeof window !== 'undefined';
	},
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

@include breakpoint(xxlarge) {
	#carousel_exp :deep(section) > div:nth-child(2) {
		display: none;
	}
}

#carousel_exp :deep(section) > div:nth-child(1) > div {
	max-width: 310px !important;
}
</style>
