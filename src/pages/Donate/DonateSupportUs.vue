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
import { gql } from '@apollo/client';

import WwwPage from '@/components/WwwFrame/WwwPage';
import KvFrequentlyAskedQuestions from '@/components/Kv/KvFrequentlyAskedQuestions';
import { processPageContent } from '@/util/contentfulUtils';
import DonateForm from '@/pages/Donate/DonateForm';
import DonateSupportUsRightRail from '@/pages/Donate/DonateSupportUsRightRail';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const pageQuery = gql`query donateContent($contentKey: String) {
	contentful {
		entries (contentType: "page", contentKey: $contentKey)
	}
}`;

/* eslint-disable max-len */
/** This template is for donate/supportus and donate/supportkiva pages
	* The contentful page content is different for each page
	* It expects the contentful content to have the following structure:
	* Page > Page Layout >
	* 	- Content Group (key = 'web-lender-donation-hero' || 'web-lender-donation-hero-variant')
	* 		- Generic Content Block
	* 		- Rich Text Content
	* 		- UI Setting
	* 	- Content Group (key = 'web-donate-support-us-donation-callouts' || 'web-donate-support-us-donation-callouts-variant')
	* 		- Media Entries (any number)
	* 		- Rich Text Content (any number)
	* 		- Responsive Image Set (name = 'Progress Meter Image')
	* 		- UI Setting
	* 	- Content Group (type = 'frequentlyAskedQuestions')
*/
/* eslint-enable max-len */

export default {
	name: 'DonateSupportUs',
	metaInfo() {
		return {
			title: `${this.pageTitle}`,
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: this.pageDescription,
				}
			],
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
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch: true,
		query: pageQuery,
		preFetchVariables({ route }) {
			return {
				contentKey: route?.meta?.contentfulPage(route)?.trim(),
			};
		},
		variables() {
			return {
				contentKey: this.$route?.meta?.contentfulPage(this.$route)?.trim(),
			};
		},
		result({ data }) {
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContent(pageEntry) : null;
		},
	},
	computed: {
		page() {
			return this.pageData?.page;
		},
		contentGroups() {
			return this.page?.pageLayout?.contentGroups ?? [];
		},
		pageTitle() {
			const layoutTitle = this.page?.pageLayout?.pageTitle;
			const pageTitle = this.page?.pageTitle ?? 'Loans that change lives';
			return layoutTitle || pageTitle;
		},
		pageDescription() {
			const layoutDescription = this.page?.pageLayout?.pageDescription;
			const pageDescription = this.page?.pageDescription ?? undefined;
			return layoutDescription || pageDescription;
		},
		heroContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				if (key === 'web-lender-donation-hero' || key === 'web-lender-donation-hero-variant') {
					return true;
				}
				return false;
			});
		},
		heroGenericContentBlock() {
			return this.heroContentGroup?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'genericContentBlock' : false;
			});
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
			return this.heroContentGroup?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'uiSetting' : false;
			});
		},
		donationValues() {
			return this.heroSettingsContent?.dataObject?.amounts.length
				? this.heroSettingsContent?.dataObject?.amounts
				: this.defaultDonationValues;
		},
		heroDisclaimerContent() {
			return this.heroContentGroup?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'richTextContent' : false;
			});
		},
		formDisclaimer() {
			const disclaimerRichText = this.heroDisclaimerContent?.richText;
			if (disclaimerRichText) {
				return documentToHtmlString(disclaimerRichText);
			}
			return '';
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
		donationCalloutsCG() {
			return this.contentGroups?.find(({ key }) => {
				// eslint-disable-next-line max-len
				if (key === 'web-donate-support-us-donation-callouts' || key === 'web-donate-support-us-donation-callouts-variant') {
					return true;
				}
				return false;
			});
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
