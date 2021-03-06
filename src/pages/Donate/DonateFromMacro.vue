<template>
	<www-page
		id="donate-landing"
		:header-theme="headerTheme"
		:footer-theme="footerTheme"
	>
		<donate-from-macro-hero
			:data="heroContentGroup"
		/>

		<div class="FAQ-wrapper section">
			<div class="row">
				<div class="columns">
					<h2 class="strong">
						Frequently Asked Questions
					</h2>
					<div v-html="faqCopy"></div>
				</div>
			</div>
		</div>

		<div class="impact-wrapper section">
			<div class="row">
				<div class="small-12 large-6 columns">
					<kv-responsive-image class="impact-wrapper__img" :images="impactImageSet" alt="" />
				</div>
				<div class="small-12 large-6 columns">
					<h2 class="impact-wrapper__header" v-html="this.impactHeadline">
					</h2>
					<div v-html="impactBodyCopy"></div>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import gql from 'graphql-tag';

import { lightHeader, lightFooter } from '@/util/siteThemes';
import WwwPage from '@/components/WwwFrame/WwwPage';
import DonateFromMacroHero from '@/pages/Donate/DonateFromMacroHero';
import { processPageContentFlat } from '@/util/contentfulUtils';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const pageQuery = gql`query donateContent {
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
		KvResponsiveImage,
	},
	data() {
		return {
			headerTheme: lightHeader,
			footerTheme: lightFooter,
			pageData: {},
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			});
		},
		result({ data }) {
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContentFlat(pageEntry) : null;
		},
	},
	computed: {
		impactImageSet() {
			const smallImage = this.impactContentGroup?.media?.[0]?.file?.url ?? null;
			const smallImageRetina = this.impactContentGroup?.media?.[1]?.file?.url ?? null;

			return [
				['small', smallImage],
				['small retina', smallImageRetina],
			];
		},
		pageLayout() {
			return this.pageData?.page;
		},
		heroContentGroup() {
			// eslint-disable-next-line max-len
			return this.pageLayout?.contentGroups?.donationHero;
		},
		impactContentGroup() {
			// eslint-disable-next-line max-len
			return this.pageLayout?.contentGroups?.donationImpact;
		},
		faqContentGroup() {
			// eslint-disable-next-line max-len
			return this.pageLayout?.contentGroups?.donationFaqs;
		},
		donationFAQs() {
			return this.faqContentGroup?.contents?.find(contentBlock => contentBlock.key === 'donate-page-faqs');
		},
		allDonationImpactText() {
			// eslint-disable-next-line max-len
			return this.impactContentGroup?.contents?.find(contentBlock => contentBlock.key === 'donation-impact-content');
		},
		faqCopy() {
			const bodyCopy = this.donationFAQs?.bodyCopy;
			return documentToHtmlString(bodyCopy);
		},
		impactHeadline() {
			return this.allDonationImpactText?.headline;
		},
		impactBodyCopy() {
			const bodyCopy = this.allDonationImpactText?.bodyCopy;
			return documentToHtmlString(bodyCopy);
		},
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
	padding-top: 2rem;
	padding-bottom: 2rem;

	@include breakpoint(xlarge) {
		padding-top: 5rem;
		padding-bottom: 5rem;
	}

	&__img {
		width: 100%;
		margin-bottom: 2rem;

		@include breakpoint(large) {
			margin-bottom: 0;
			padding-right: 2rem;
		}
	}

	&__header {
		@include large-text();

		margin-bottom: 1rem;
	}
}
</style>
