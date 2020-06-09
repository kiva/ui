<template>
	<www-page
		id="donate-landing"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<div>
			<donate-from-macro-hero
				:data="promoContent"
			/>

			<div class="FAQ-wrapper section">
				<div class="row">
					<h2 class="strong">
						Frequently Asked Questions
					</h2>
					<div v-html="bodyCopy"></div>
				</div>
			</div>

			<div class="impact-wrapper section">
				<div class="row">
					<m-g-covid-about class="impact small-12 columns" />
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import { lightHeader, lightFooter } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import DonateFromMacroHero from '@/pages/Donate/DonateFromMacroHero';
import { processContent } from '@/util/contentfulUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';
import MGCovidAbout from '@/pages/LandingPages/MGCovid19/MGCovidAbout';

const pageQuery = gql`{
	contentful {
		entries (contentType: "page", contentKey: "support-kiva")
	}
}`;

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
	inject: ['apollo', 'federation'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			});
		},
		result({ data }) {
			console.log('data', data);
			const contentfulPageData = _get(data, 'contentful.entries.items');
			if (!contentfulPageData) {
				return false;
			}
			// Processing the contentful data
			// eslint-disable-next-line
			this.promoContent = processContent(contentfulPageData);
			// pulling the FAQs off the data for use in bodyCopy computed function
			// eslint-disable-next-line
			this.donationFAQs = _get(this.promoContent, 'page.pageLayout.fields.contentGroups[1].fields.content.fields.bodyCopy');
		},
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
