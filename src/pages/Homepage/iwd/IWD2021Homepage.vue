<template>
	<www-page id="homepage"
		class="iwd-2021-homepage"
	>
		<dynamic-hero class="section"
			v-if="heroContentGroup"
			:content="heroContentGroup"
		/>
		<homepage-loan-categories class="section"
			v-if="loansContentGroup"
			:content="loansContentGroup"
		/>
		<homepage-how-it-works class="section"
			v-if="howItWorksContentGroup"
			:content="howItWorksContentGroup"
		/>
		<homepage-midroll-c-t-a class="section"
			v-if="midrollContentGroup"
			:content="midrollContentGroup"
		/>
		<!-- iwd kiva stats component -->
		<homepage-general-stats class="section"
			v-if="statisticsContentGroup"
			:content="statisticsContentGroup"
		/>
		<!-- testimonials component -->
		<homepage-testimonials class="section"
			v-if="testimonialsContentGroup"
			:content="testimonialsContentGroup"
		/>
		<!-- partners component -->
		<homepage-corporate-sponsors class="section"
			v-if="corporateSponsorsContentGroup"
			:content="corporateSponsorsContentGroup"
		/>
		<!-- bottom cta component -->
		<homepage-bottom-CTA class="section"
			v-if="bottomCTAContentGroup"
			:content="bottomCTAContentGroup"
		/>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import DynamicHero from '@/components/Contentful/DynamicHero';
import HomepageGeneralStats from '@/components/Homepage/HomepageGeneralStats';
import HomepageLoanCategories from '@/components/Homepage/HomepageLoanCategories';
import HomepageMidrollCTA from '@/components/Homepage/HomepageMidrollCTA';
import HomepageHowItWorks from '@/components/Homepage/HomepageHowItWorks';
import HomepageCorporateSponsors from '@/components/Homepage/HomepageCorporateSponsors';
import HomepageTestimonials from '@/components/Homepage/HomepageTestimonials';
import HomepageBottomCTA from '@/components/Homepage/HomepageBottomCTA';

export default {
	components: {
		WwwPage,
		DynamicHero,
		HomepageGeneralStats,
		HomepageLoanCategories,
		HomepageMidrollCTA,
		HomepageHowItWorks,
		HomepageCorporateSponsors,
		HomepageTestimonials,
		HomepageBottomCTA,
	},
	props: {
		content: {
			type: Object,
			default() {
				return {
					page: {
						contentGroups: {},
						pageLayout: {}
					}
				};
			}
		},
	},
	computed: {
		heroContentGroup() {
			return this.content?.page?.contentGroups?.dynamicHero ?? null;
		},
		loansContentGroup() {
			return this.content?.page?.contentGroups?.homepageLoanCategories ?? null;
		},
		howItWorksContentGroup() {
			return this.content?.page?.contentGroups?.homepageHowItWorks ?? null;
		},
		midrollContentGroup() {
			return this.content?.page?.contentGroups?.homepageMidrollCta ?? null;
		},
		testimonialsContentGroup() {
			return this.content?.page?.contentGroups?.homepageTestimonials ?? null;
		},
		statisticsContentGroup() {
			return this.content?.page?.contentGroups?.homepageStatistics ?? null;
		},
		corporateSponsorsContentGroup() {
			return this.content?.page?.contentGroups?.homepageStrategicPartners ?? null;
		},
		bottomCTAContentGroup() {
			return this.content?.page?.contentGroups?.homepageBottomCta ?? null;
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.iwd-2021-homepage {
	// Text fields from contentful can include an em tag or an i tag. Adding this class
	// to the elements with contentful content will make the text in those tags green
	.green-emphasis {
		em,
		i {
			font-style: normal;
			color: $kiva-green;
		}
	}

	// Uniform spacing for page sections
	.section {
		position: relative;
		padding: 2rem 0;
	}
}
</style>
