<template>
	<www-page>
		<section>
			<kv-hero class="mg-hero bg-overlay tw-mb-4">
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
					<form @submit.prevent.stop="submit" novalidate class="tw-px-2">
						<div
							class="tw-bg-primary-inverse tw-bg-opacity-[75%]
						md:tw-max-w-sm md:tw-ml-4
						lg:tw-max-w-md lg:new-spacing"
						>
							<div class="tw-p-1.5 lg:tw-p-3 tw-mb-1.5">
								<h2 class="tw-text-primary-inverse tw-mb-2" v-html="heroHeadline"></h2>
								<p class="tw-text-subhead tw-text-primary-inverse" v-html="heroBody"></p>
							</div>
							<fieldset class="tw-mb-2 tw-flex">
								<div class="tw-inline tw-max-w-xs tw-flex-1 tw-px-1 lg:tw-px-3">
									<label
										class="tw-sr-only"
										:class="{ 'tw-text-danger': $v.$invalid }" :for="'amount-' + componentKey"
									>
										Amount
									</label>
									<kv-currency-input
										:id="'amount-' + componentKey"
										:value="amount"
										@input="updateAmount"
										class=""
									/>
									<ul class="validation-errors tw-text-danger" v-if="$v.$invalid">
										<li v-if="!$v.amount.required">
											Field is required
										</li>
										<li v-if="!$v.amount.minValue || !$v.amount.maxValue">
											Enter an amount of $5-$8,500
										</li>
									</ul>
								</div>
								<kv-button
									class="
										tw-flex-1
										tw-mb-2
										tw-inline
										tw-pr-1
										md:tw-px-1
										lg:tw-px-3"
									type="submit"
									:state="$v.$invalid ? 'disabled' : ''"
								>
									{{ heroPrimaryCtaText }}
								</kv-button>
							</fieldset>
						</div>
					</form>
				</template>
			</kv-hero>

			<personalized-mg-lightbox
				:show-lightbox="showLightbox"
				@hide-lightbox="showLightbox = false"
				:amount="amount"
			/>
		</section>

		<section class="row tw-flex tw-justify-center">
			<div class="md:tw-flex-1
				tw-order-last md:tw-order-first
				md:tw-mt-2 lg:tw-mt-10
				tw-max-w-sm
				tw-px-2 tw-mb-6"
			>
				<h2
					v-html="valueHeadline"
					class="tw-mb-4"
				></h2>
				<p v-html="valueBody"></p>
			</div>
			<div class="md:tw-flex-1 tw-block
				tw-order-first md:tw-order-last
				md:tw-px-4
				tw-mb-2 md:tw-mb-4
				tw-inline-flex
				tw-justify-center"
			>
				<kv-contentful-img
					:contentful-src="valueImage"
					fallback-format="jpg"
					:width="1440"
					:alt="valueImageAlt"
					crop="&fit=fill&f=face"
					class="tw-max-w-md"
				/>
			</div>
		</section>
		<how-it-works />
		<email-preview />
		<kiva-as-expert />
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
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import PersonalizedMgLightbox from '@/components/MonthlyGood/PersonalizedMgLightbox';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvHero from '@/components/Kv/KvHero';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import { processPageContent } from '@/util/contentfulUtils';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvFrequentlyAskedQuestions from '@/components/Kv/KvFrequentlyAskedQuestions';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import HowItWorks from './HowItWorks';
import EmailPreview from './EmailPreview';
import MoreAboutKiva from './MoreAboutKiva';
import KivaAsExpert from './KivaAsExpert';

const pageQuery = gql`
	query monthlyGoodPersonalizedLandingPage {
		contentful {
			entries(contentType: "page", contentKey: "monthlygood/personalized")
		}
	}
`;

export default {
	metaInfo: {
		title: 'Personalized Monthly Good',
	},
	mixins: [
		validationMixin,
	],
	components: {
		PersonalizedMgLightbox,
		WwwPage,
		KvHero,
		KvCurrencyInput,
		KvButton,
		KvContentfulImg,
		HowItWorks,
		EmailPreview,
		KivaAsExpert,
		MoreAboutKiva,
		KvFrequentlyAskedQuestions,
	},
	validations: {
		amount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(8500)
		},
	},
	props: {
	},
	data() {
		return {
			showLightbox: false,
			// monthlyGoodAmount: 25,
			amount: 25,
			selectedGroup: this.category || 'default',
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
					return Promise.all([
						// eslint-disable-next-line max-len
						client.query({ query: experimentQuery, variables: { id: 'EXP-VUE-399-subscription-appeal-personalization' } })
					]);
				});
		},
		result({ data }) {
			console.log('data', data);

			// Core-399 Subscriptions Appeal Personalization Experiment
			const subscriptionAppealPersonalization = this.apollo.readFragment({
				id: 'EXP-VUE-399-subscription-appeal-personalization',
				fragment: experimentVersionFragment,
			}) || {};

			if (subscriptionAppealPersonalization.version
				&& subscriptionAppealPersonalization.version !== 'unassigned'
				&& this.subscriptionAppealPersonalization === 'shown'
			) {
				this.$kvTrackEvent('MonthlyGood', 'EXP-CORE-399-Feb2022', 'b');
			}

			// Check for contentful content
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContent(pageEntry) : null;
		},
	},
	methods: {
		updateAmount(value) {
			this.amount = value;
		},
		submit() {
			this.$kvTrackEvent('MonthlyGood', 'click-personalized-MG-signup-cta', 'Get started', this.amount);
			this.showLightbox = true;
		}
	},
	computed: {
		contentGroups() {
			return this.pageData?.page?.pageLayout?.contentGroups ?? [];
		},
		componentKey() {
			// This component can exist multiple times on the page or can be iterated over.
			// If it has a key attribute, then it will be used in the input id to avoid
			// duplicate inputs with the same id.
			return this.$vnode.key || '';
		},
		heroContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'personalized-mg-landing-hero' : false;
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
				return contentItem.key === 'personalized-mg-landing-hero-text';
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
		valueContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'personalized-mg-landing-value-prop' : false;
			});
		},
		valueImage() {
			return this.valueContentGroup?.media?.[0]?.file?.url ?? '';
		},
		valueImageAlt() {
			return this.valueContentGroup?.media?.[0]?.description ?? '';
		},
		valueText() {
			// This contentGroup doesnt have a type, so find by key
			return this.valueContentGroup?.contents?.find(contentItem => {
				return contentItem.key === 'personalized-mg-landing-value-text';
			});
		},
		valueHeadline() {
			return this.valueText?.headline ?? 'Automatically support borrower picked for you.';
		},
		valueBody() {
			// eslint-disable-next-line max-len
			const text = this.valueText?.bodyCopy ?? 'Make loans to matching borrowers in categories and regions you typically support. Always lend to women in South America? No problem. Refugees in North Africa? You got it.';
			return documentToHtmlString(text).replace(/\n/g, '<br />');
		}
	}
};
</script>

<style lang="scss" scoped>
.new-spacing {
	margin-left: 16%;
}

</style>
