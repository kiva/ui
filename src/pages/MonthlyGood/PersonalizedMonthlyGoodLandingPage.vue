<template>
	<www-page>
		<kv-hero class="mg-hero bg-overlay">
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
				<form @submit.prevent.stop="submit" novalidate>
					<div class="tw-bg-primary-inverse tw-bg-opacity-low
						md:tw-max-w-sm md:tw-ml-4
						lg:tw-max-w-md lg:tw-ml-16"
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
								class="tw-flex-1 tw-mb-2 tw-inline tw-px-1 lg:tw-px-3"
								type="submit"
								:disabled="$v.$invalid"
								v-kv-track-event="[
									'MonthlyGood',
									`click-start-form-${componentKey}`,
									heroPrimaryCtaText
								]"
							>
								{{ heroPrimaryCtaText }}
							</kv-button>
						</fieldset>
					</div>
				</form>
			</template>
		</kv-hero>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvHero from '@/components/Kv/KvHero';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import { processPageContent } from '@/util/contentfulUtils';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const pageQuery = gql`
	query monthlyGoodPersonalizedLandingPage {
		contentful {
			entries(contentType: "page", contentKey: "/lp/monthlygood/personalized")
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
		WwwPage,
		KvHero,
		KvCurrencyInput,
		KvButton,
		KvContentfulImg,
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
			monthlyGoodAmount: 25,
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
			this.$router.push({
				path: '/monthlygood/setup',
				query: {
					amount: this.amount,
					category: this.selectedGroup,
				}
			});
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
	}
};
</script>
