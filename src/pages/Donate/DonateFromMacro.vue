<template>
	<www-page
		id="donate-landing"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<donate-from-macro-hero
			:data="promoContent"
		/>

		<div class="FAQ-wrapper section">
			<div class="row">
				<h2 class="strong">Frequently Asked Questions</h2>
				<div v-html="bodyCopy"></div>
			</div>
		</div>

		<div class="impact-wrapper section">
			<div class="row">
				<m-g-covid-about class="impact small-12 columns" />
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
import MGCovidAbout from '@/pages/LandingPages/MGCovid19/MGCovidAbout';

export default {
	metaInfo: {
		title: 'Donate to help support Kiva today'
	},
	components: {
		WwwPage,
		DonateFromMacroHero,
		MGCovidAbout,
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: lightFooter,
			donationFAQs: null,
			promoContent: () => {},
		};
	},
	inject: ['federation'],

	created() {
		this.federation.query({
			query: contentful,
			variables: {
				contentType: 'page',
				contentKey: 'support-kiva',
			}
		}).then(({ data }) => {
			const contentfulPageData = _get(data, 'contentful.entries.items');
			if (!contentfulPageData) {
				return false;
			}
			// Processing the contentful data
			this.promoContent = processContent(contentfulPageData);
			// defining the donation dollar amount to pass down for button values
			const donationDollarAmounts = _get(this.promoContent, 'page.pageLayout.fields.contentGroups[0].fields.contents[2].fields.dataObject.amounts');
			// pulling the FAQs off the data for use in bodyCopy computed function
			this.donationFAQs = _get(this.promoContent, 'page.pageLayout.fields.contentGroups[1].fields.content.fields.bodyCopy');
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

.FAQ-wrapper {
	margin-top: 2rem;

	@include breakpoint(xlarge) {
		margin-top: 5rem;
	}

	h2 {
		margin-bottom: 1rem;
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
