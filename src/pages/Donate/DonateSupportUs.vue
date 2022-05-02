<template>
	<www-page id="support-us-landing">
		<div class="row page-content">
			<div class="small-12 large-7 columns donation-form-holder">
				<h1 class="donate-headline" v-html="headlineCopy"></h1>
				<div class="donate-subhead" v-html="subHeadCopy"></div>
				<donate-form
					:key="1"
					:button-text="buttonText"
					:data="donationValues"
					:form-disclaimer="formDisclaimer"
					:form-submit-analytics="formSubmitAnalytics"
					:show-disclaimer="false"
					:activate-monthly-option="true"
				/>
			</div>
			<div class="small-12 large-5 columns donation-meter-holder">
				<donate-support-us-right-rail :content="donationCalloutsCG" />
			</div>
			<div class="small-12 columns donation-faq-holder">
				<kv-frequently-asked-questions
					:headline="frequentlyAskedQuestionsHeadline"
					:questions="frequentlyAskedQuestions"
				/>
			</div>
		</div>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvFrequentlyAskedQuestions from '@/components/Kv/KvFrequentlyAskedQuestions';
import { processPageContentFlat } from '@/util/contentfulUtils';
import DonateForm from '@/pages/Donate/DonateForm';
import DonateSupportUsRightRail from '@/pages/Donate/DonateSupportUsRightRail';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const pageQuery = gql`query donateContent {
	contentful {
		entries (contentType: "page", contentKey: "web-donate-support-us")
	}
}`;

export default {
	metaInfo() {
		return 	{
			title: 'Donate to Kiva and create real change',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Donations from people like you allow Kiva to support more people worldwide. Donate today'
						+ ' to help us build a more financially inclusive world.'
				}
			]
		};
	},
	components: {
		WwwPage,
		DonateForm,
		KvFrequentlyAskedQuestions,
		DonateSupportUsRightRail,
	},
	data() {
		return {
			pageData: {},
			defaultHeadlineCopy: 'Donate to Kiva',
			// eslint-disable-next-line max-len
			defaultSubHeadCopy: '<p>100% of money lent on Kiva goes to funding loans, so we rely on donations to continue this important work. More than two-thirds of our donations come from individual lenders like you.</p>',
			defaultDonationValues: [20, 35, 50, 100, 200],
			defaultButtonText: 'Donate',
			formSubmitAnalytics: {
				category: '/donate/supportus',
				action: 'click-donate-support-us-form',
			},
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch: true,
		query: pageQuery,
		result({ data }) {
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;
		},
	},
	computed: {
		page() {
			return this.pageData?.page;
		},
		heroContentGroup() {
			return this.page?.contentGroups?.webLenderDonationHero || {};
		},
		heroGenericContentBlock() {
			// eslint-disable-next-line max-len
			return this.heroContentGroup?.contents?.find(contentBlock => contentBlock.key === 'web-lender-donation-form-copy');
		},
		headlineCopy() {
			const contentfulHeadlineCopy = this.heroGenericContentBlock?.headline;
			if (contentfulHeadlineCopy) {
				return contentfulHeadlineCopy;
			}
			return this.defaultHeadlineCopy;
		},
		subHeadCopy() {
			const contentfulSubHeadCopy = this.heroGenericContentBlock?.bodyCopy;
			if (contentfulSubHeadCopy) {
				return documentToHtmlString(contentfulSubHeadCopy);
			}
			return documentToHtmlString(this.defaultSubHeadCopy);
		},
		buttonText() {
			return this.defaultButtonText;
		},
		heroSettingsContent() {
			// eslint-disable-next-line max-len
			return this.heroContentGroup?.contents?.find(contentBlock => contentBlock.key === 'webLenderDonationAmounts');
		},
		donationValues() {
			return this.heroSettingsContent?.dataObject?.amounts.length
				? this.heroSettingsContent?.dataObject?.amounts
				: this.defaultDonationValues;
		},
		heroDisclaimerContent() {
			// eslint-disable-next-line max-len
			return this.heroContentGroup?.contents?.find(contentBlock => contentBlock.key === 'macro-donate-button-disclaimer');
		},
		formDisclaimer() {
			const disclaimerRichText = this.heroDisclaimerContent?.richText;
			if (disclaimerRichText) {
				return documentToHtmlString(disclaimerRichText);
			}
			return '';
		},
		faqContentGroup() {
			return this.page?.contentGroups?.frequentlyAskedQuestions || {};
		},
		frequentlyAskedQuestionsHeadline() {
			return this.faqContentGroup?.title ?? null;
		},
		frequentlyAskedQuestions() {
			return this.faqContentGroup?.contents ?? null;
		},
		donationCalloutsCG() {
			return this.page?.contentGroups?.webDonateSupportUsDonationCallouts || {};
		}
	},
	mounted() {
		// Handle incoming Instant Donation status
		const instantDonationStatus = this.$route?.query?.instantDonation ?? null;
		if (instantDonationStatus === 'instant-donation-failed' || instantDonationStatus === 'validation-failed') {
			const instantDonationFailed = `Oops, we’ve encountered an error. Don’t worry,
				you can choose a donation amount below to continue.`;
			const toastTimeout = setTimeout(() => {
				this.$showTipMsg(instantDonationFailed, 'warning', true);
				clearTimeout(toastTimeout);
			}, 1000);
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 2rem 0;
}

.donation-form-holder,
.donation-meter-holder,
.donation-faq-holder {
	margin-bottom: rem-calc(40);

	@include breakpoint(medium) {
		margin-bottom: rem-calc(64);
	}

	@include breakpoint(large) {
		margin-bottom: rem-calc(128);
	}
}

.donation-form-holder {
	.donate-headline {
		margin-bottom: rem-calc(16);
	}

	.donate-subhead {
		margin-bottom: rem-calc(24);
	}
}
</style>
