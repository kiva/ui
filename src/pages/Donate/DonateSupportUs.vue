<template>
	<www-page
		id="support-us-landing"
	>
		<div class="row page-content">
			<div class="small-12 large-7 columns">
				<h1 class="donate-headline" v-html="headlineCopy"></h1>
				<div class="donate-subhead" v-html="subHeadCopy"></div>
				<donate-form
					:key="1"
					:button-text="buttonText"
					:data="donationValues"
					:form-disclaimer="formDisclaimer"
					:form-submit-analytics="formSubmitAnalytics"
					:show-disclaimer="false"
				/>
			</div>
			<div class="small-12 large-5 columns">
				<h4>Loans vs. Donations</h4>
				<p>Kiva does not take a cut of loans, optional donations fund our operations.</p>
			</div>
			<div class="small-12 columns">
				<h4>Frequently asked questions</h4>
			</div>
		</div>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';

import WwwPage from '@/components/WwwFrame/WwwPage';
import { processPageContentFlat } from '@/util/contentfulUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import DonateForm from './DonateForm';

const pageQuery = gql`query donateContent {
	contentful {
		entries (contentType: "page", contentKey: "web-donate-support-us")
	}
}`;

export default {
	metaInfo() {
		return {
			title: `${this.pageTitle}`,
		};
	},
	components: {
		WwwPage,
		DonateForm,
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
		pageTitle() {
			const layoutTitle = this.page?.pageLayout?.pageTitle;
			const pageTitle = this.page?.pageTitle ?? 'Loans that change lives';
			return layoutTitle || pageTitle;
		},
		heroContentGroup() {
			return this.page?.contentGroups?.webLenderDonationHero || {};
		},
		heroGenericContentBlock() {
			// eslint-disable-next-line max-len
			return this.heroContentGroup?.contents?.find(contentBlock => contentBlock.key === 'web-lender-donation-form-copy');
		},
		headlineCopy() {
			return this.heroGenericContentBlock?.headline;
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
			return this.heroSettings?.dataObject?.amounts.length
				? this.heroSettings?.dataObject?.amounts
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
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 2rem 0;
}
</style>
