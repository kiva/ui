<template>
	<www-page>
		<section class="tw-py-4 md:tw-py-6 lg:tw-py-8">
			<!-- Auto Deposit Text -->
			<div class="row">
				<div class="small-12 columns">
					<h1 class="tw-mb-4">
						{{ headerAreaHeadline }}
					</h1>
				</div>
				<div class="small-12 large-10 columns">
					<div class="tw-prose tw-mb-4 tw-text-subhead" v-html="headerAreaBodyCopy"></div>
				</div>
			</div>

			<!-- Auto Deposit Form -->
			<div class="auto-deposit-form" v-if="canDisplayForm">
				<div class="row column">
					<auto-deposit-sign-up-form />
				</div>
			</div>

			<!-- Already Subscribed Notice -->
			<div class="row" v-if="hasAutoDeposits || hasLegacySubscription">
				<div class="small-12 columns">
					<div class="tw-p-2 tw-mb-4 tw-bg-caution tw-text-black">
						<p class="tw-text-h3">
							You already have an existing auto deposit.
							Changes can be made in your
							<a href="/settings/subscriptions">subscription settings</a>.
						</p>
					</div>
				</div>
			</div>

			<!-- Monthly Good Notice -->
			<div class="row" v-if="isMonthlyGoodSubscriber">
				<div class="small-12 columns">
					<div class="tw-p-2 tw-mb-4 tw-bg-caution tw-text-black">
						<p class="tw-text-h3">
							Auto Deposit is not available to Monthly Good subscribers.
							Changes can be made in your
							<a href="/settings/subscriptions">subscription settings</a>.
						</p>
					</div>
				</div>
			</div>

			<!-- Modern Sub Notice -->
			<div class="row" v-if="hasModernSub">
				<div class="small-12 columns">
					<div class="tw-p-2 tw-mb-4 tw-bg-caution tw-text-black">
						<p class="tw-text-h3">
							Auto Deposit is not available to current subscribers.
							Changes can be made in your
							<a href="/settings/subscriptions">subscription settings</a>.
						</p>
					</div>
				</div>
			</div>
		</section>
		<!-- Auto Deposit What To Expect -->
		<section class="tw-py-4 md:tw-py-6 lg:tw-py-8 tw-text-center tw-bg-secondary">
			<div class="row">
				<h2 class="small-12 column tw-mb-4">
					{{ whatToExpectHeadline }}
				</h2>
				<div class="small-12 large-4 column" v-for="(item, index) in whatToExpect" :key="item.key">
					<icon-auto-deposit-alternate
						v-if="index == 0"
						class="tw-w-9 tw-h-9 tw-mb-2 tw-block tw-mx-auto tw-text-brand"
						style="fill: #fff;"
					/>
					<icon-lend
						v-if="index == 1"
						class="tw-w-9 tw-h-9 tw-mb-2 tw-block tw-mx-auto tw-text-brand"
						style="fill: #fff;"
					/>
					<icon-updates-alternate
						v-if="index == 2"
						class="tw-w-9 tw-h-9 tw-mb-2 tw-block tw-mx-auto tw-text-brand"
						style="fill: #fff;"
					/>

					<h3 class="tw-text-brand tw-mb-2">
						{{ item.name }}
					</h3>
					<div class="tw-prose" v-html="convertFromRichTextToHtml(item.richText)">
					</div>
				</div>
			</div>
		</section>

		<!-- Auto Deposit Frequently Asked Questions -->
		<section class="tw-py-4 md:tw-py-6 lg:tw-py-8">
			<div class="row">
				<kv-frequently-asked-questions
					class="span-12 column"
					:headline="frequentlyAskedQuestionsHeadline"
					:questions="frequentlyAskedQuestions"
				/>
			</div>
		</section>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';
import { processPageContent } from '@/util/contentfulUtils';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvFrequentlyAskedQuestions from '@/components/Kv/KvFrequentlyAskedQuestions';
import AutoDepositSignUpForm from '@/components/AutoDeposit/AutoDepositSignUpForm';

import IconAutoDepositAlternate from '@/assets/icons/inline/auto-deposit-alternate.svg';
import IconLend from '@/assets/icons/inline/lend.svg';
import IconUpdatesAlternate from '@/assets/icons/inline/updates-alternate.svg';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const pageQuery = gql`query autoDepositLandingPage {
	my {
		subscriptions {
			values {
				id
				subscrId
			}
		}
		autoDeposit {
			id
			isSubscriber
		}
	}
	# mySubscriptions(includeDisabled: false) {
	# 	values {
	# 		id
	# 		enabled
	# 	}
	# }
	contentful {
		entries(contentType: "page", contentKey: "auto-deposit")
	}
}`;

export default {
	name: 'AutoDepositLandingPage',
	metaInfo() {
		return 	{
			title: 'Set up an Auto Deposit',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'With Auto Deposit, your funds are automatically added into your Kiva lending account,'
						+ ' so you can continue to change lives without even thinking about it.'
				}
			]
		};
	},
	components: {
		AutoDepositSignUpForm,
		KvFrequentlyAskedQuestions,
		IconAutoDepositAlternate,
		IconLend,
		IconUpdatesAlternate,
		WwwPage,
	},
	data() {
		return {
			isMonthlyGoodSubscriber: false,
			hasAutoDeposits: false,
			hasLegacySubscription: false,
			pageData: null,
			hasModernSub: false,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			// Extract page content from contentful
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContent(pageEntry) : null;

			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;
			this.hasAutoDeposits = data?.my?.autoDeposit ?? false;

			const legacySubs = data?.my?.subscriptions?.values ?? [];
			this.hasLegacySubscription = legacySubs.length > 0;

			// TODO! Add this back in when service supports non-logged in users
			// const modernSubscriptions = data?.mySubscriptions?.values ?? [];
			// this.hasModernSub = modernSubscriptions.length !== 0;
		},
	},
	computed: {
		contentGroups() {
			return this.pageData?.page?.pageLayout?.contentGroups ?? [];
		},
		canDisplayForm() {
			return !this.isMonthlyGoodSubscriber
				&& !this.hasAutoDeposits
				&& !this.hasLegacySubscription
				&& !this.hasModernSub;
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
		ctaContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'auto-deposit-cta' : false;
			});
		},
		headerAreaHeadline() {
			return this.ctaContentGroup?.contents?.[0]?.headline;
		},
		headerAreaBodyCopy() {
			const rawRichText = this.ctaContentGroup?.contents?.[0]?.bodyCopy;
			return documentToHtmlString(rawRichText);
		},
		whatToExpectContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'auto-deposit-what-to-expect' : false;
			});
		},
		whatToExpectHeadline() {
			return this.whatToExpectContentGroup?.title;
		},
		whatToExpect() {
			return this.whatToExpectContentGroup?.contents;
		}
	},
	methods: {
		convertFromRichTextToHtml(rawRichText) {
			return documentToHtmlString(rawRichText);
		}
	},

};
</script>
