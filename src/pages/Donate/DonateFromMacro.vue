<template>
	<www-page
		id="donate-landing"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<donate-from-macro-hero />

		<div class="FAQ-wrapper section">
			<div class="row">
				<div v-html="bodyCopy"></div>
			</div>
		</div>
		<!-- <donate-from-macro-F-A-Q /> -->

		<div class="impact-wrapper section">
			<div class="row">
				<kiva-impact class="impact small-12 columns" />
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';

import { lightHeader, lightFooter } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import DonateFromMacroHero from '@/pages/Donate/DonateFromMacroHero';
import contentful from '@/graphql/query/contentful.graphql';
import { processContent } from '@/util/contentfulUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import KivaImpact from '@/pages/LandingPages/MGCovid19/KivaImpact';

export default {
	metaInfo: {
		title: 'Donate to help support Kiva today'
	},
	components: {
		WwwPage,
		DonateFromMacroHero,
		KivaImpact,
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: lightFooter,
		};
	},
	inject: ['apollo', 'federation'],

	created() {
		this.federation.query({
			query: contentful,
			variables: {
				contentType: 'page',
				contentKey: 'support-kiva',
			}
		}).then(({ data }) => {
			// eslint-disable-next-line max-len
			// const contentfulPageData = _get(data, 'contentful.entries.items[0].fields.pageLayout.fields.contentGroups');
			const contentfulPageData = _get(data, 'contentful.entries.items');
			if (!contentfulPageData) {
				return false;
			}

			this.promoContent = processContent(contentfulPageData);
			console.log('this.promoContent', this.promoContent);


			// eslint-disable-next-line max-len
			const donationImages = _get(this.promoContent, 'page.pageLayout.fields.contentGroups[0].fields.contents[0].fields.images');
			// eslint-disable-next-line max-len
			const donationDollarAmounts = _get(this.promoContent, 'page.pageLayout.fields.contentGroups[0].fields.contents[2].fields.dataObject.amounts');
			// eslint-disable-next-line max-len
			const donationPageText = _get(this.promoContent, 'page.pageLayout.fields.contentGroups[0].fields.contents[1].fields');
			const donationHeadline = _get(donationPageText, 'headline');
			const donationSubHeadline = _get(donationPageText, 'subHeadline');
			const donationCTA = _get(donationPageText, 'primaryCtaText');
			// eslint-disable-next-line max-len
			const donationFAQs = _get(data, 'page.pageLayout.fields.contentGroups[1].fields.content.fields.bodyCopy');

			// console.log(data);
			console.log('images', donationImages);
			console.log('page text', donationPageText);
			console.log('headline', donationHeadline);
			console.log('subheadline', donationSubHeadline);
			console.log('donation CTA', donationCTA);
			console.log('FAQ', donationFAQs);
			console.log('dollar amounts', donationDollarAmounts);

			// returns the contentful content of the page key ui-homepage-promo or empty object
			// it should always be the first and only item in the array, since we pass the variable to the query above
			// eslint-disable-next-line max-len
			// const uiPromoSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-homepage-promo'); // eslint-disable-line max-len
			// this.promoContent = processContent(contentfulPageData.fields.content);
		}).finally(() => {
			this.showSlideShow = true;
		});
	},
	computed: {
		bodyCopy() {
			return documentToHtmlString(this.donationFAQs);
		}
	}

};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.section {
	margin-bottom: 2rem;

	@include breakpoint(xlarge) {
		margin-bottom: 5rem;
	}
}

.impact-wrapper {
	background: $kiva-bg-lightgray;
}

.impact {
	margin-top: 2rem;
	margin-bottom: 2rem;

	@include breakpoint(xlarge) {
		margin-top: 5rem;
		margin-bottom: 5rem;
	}
}
</style>
