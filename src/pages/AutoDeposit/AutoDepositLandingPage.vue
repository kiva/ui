<template>
	<www-page>
		<!-- Auto Deposit Text -->
		<div class="auto-deposit-setup">
			<div class="row">
				<div class="small-12 columns">
					<h2 class="impact-text">
						{{ headerAreaHeadline }}
					</h2>
				</div>
				<div class="small-12 large-8 columns">
					<div class="auto-deposit-setup__subhead" v-html="headerAreaBodyCopy">
					</div>
				</div>
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
			<div class="small-12 large-6 columns">
				<div class="already-subscribed-msg-wrapper">
					<h3>
						You already have an existing auto deposit.
						Changes can be made in your
						<a href="/settings/subscriptions">subscription settings</a>.
					</h3>
				</div>
			</div>
		</div>

		<!-- Monthly Good Notice -->
		<div class="row" v-if="isMonthlyGoodSubscriber">
			<div class="small-12 large-6 columns">
				<div class="already-subscribed-msg-wrapper">
					<h3>
						Auto Deposit is not available to Monthly Good subscribers.
						Changes can be made in your
						<a href="/settings/subscriptions">subscription settings</a>.
					</h3>
				</div>
			</div>
		</div>

		<!-- Auto Deposit What To Expect -->
		<div class="auto-deposit-what-to-expect">
			<div class="row">
				<h2 class="column small-12 text-center">
					{{ whatToExpectHeadline }}
				</h2>

				<div class="small-12 large-4 column text-center" v-for="(item, index) in whatToExpect" :key="item.key">
					<icon-auto-deposit-alternate v-if="index == 0" class="auto-deposit-what-to-expect__icon" />
					<icon-lend v-if="index == 1" class="auto-deposit-what-to-expect__icon" />
					<icon-updates-alternate v-if="index == 2" class="auto-deposit-what-to-expect__icon" />

					<h3>
						{{ item.name }}
					</h3>
					<div class="auto-deposit-what-to-expect__text" v-html="convertFromRichTextToHtml(item.richText)">
					</div>
				</div>
			</div>
		</div>

		<!-- Auto Deposit Frequently Asked Questions -->
		<kv-frequently-asked-questions
			:content="faqContentGroup"
		/>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import { processPageContentFlat } from '@/util/contentfulUtils';

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
	contentful {
		entries(contentType: "page", contentKey: "auto-deposit")
	}
}`;

export default {
	metaInfo: {
		title: 'Auto Deposit',
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
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			// Extract page content from contentful
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;

			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			this.hasAutoDeposits = !!_get(data, 'my.autoDeposit') && !this.isMonthlyGoodSubscriber;
			const legacySubs = _get(data, 'my.subscriptions.values', []);
			this.hasLegacySubscription = legacySubs.length > 0;
		},
	},
	computed: {
		canDisplayForm() {
			return !this.isMonthlyGoodSubscriber && !this.hasAutoDeposits && !this.hasLegacySubscription;
		},
		headerAreaHeadline() {
			return this.pageData?.page?.contentGroups?.autoDepositCta?.contents?.[0]?.headline;
		},
		headerAreaBodyCopy() {
			const rawRichText = this.pageData?.page?.contentGroups?.autoDepositCta?.contents?.[0]?.bodyCopy;
			return documentToHtmlString(rawRichText);
		},
		faqContentGroup() {
			return this.pageData?.page?.contentGroups?.autoDepositFaqs ?? {};
		},
		whatToExpectHeadline() {
			return this.pageData?.page?.contentGroups?.autoDepositWhatToExpect?.name;
		},
		whatToExpect() {
			return this.pageData?.page?.contentGroups?.autoDepositWhatToExpect?.contents;
		}
	},
	methods: {
		convertFromRichTextToHtml(rawRichText) {
			return documentToHtmlString(rawRichText);
		}
	},

};

</script>

<style lang="scss" scoped>
@import 'settings';

.auto-deposit-setup {
	padding: 4rem 0 0;

	h2 {
		margin-bottom: 3rem;
	}

	&__subhead {
		::v-deep p {
			@include medium-text();

			@include breakpoint(xlarge) {
				@include featured-text();
			}
		}
	}
}

.auto-deposit-what-to-expect {
	background-color: $ghost;
	margin: 2rem 0 3rem;
	padding: 1rem 0 3.5rem;

	h2 {
		color: $kiva-green;
		padding: 2rem 0;
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}

	h3 {
		color: $kiva-green;
		margin-bottom: 1rem;
		font-weight: bold;

		@include breakpoint(large) {
			@include featured-text();
		}
	}

	&__text {
		margin: 0 auto;
		line-height: 1.4;
		::v-deep p { margin: 1em 0; }
	}

	&__icon {
		fill: $white;
		width: 4.5rem;
		display: block;
		margin: 0 auto 1rem auto;
		color: $kiva-green;
	}
}

.already-subscribed-msg-wrapper {
	background-color: $vivid-yellow;
	padding: 1rem;
	margin-top: 1.25rem;
}
</style>
