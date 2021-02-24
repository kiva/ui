<template>
	<div class="iwd-2021-homepage">
		<homepage-hero class="section" :content="heroContentGroup" />
		<homepage-loan-categories class="section" :content="loansContentGroup" />
		<how-it-works class="section" :content="howItWorksContentGroup" />
		<homepage-midroll-c-t-a class="section" :content="midrollContentGroup" />
		<!-- iwd kiva stats component -->
		<homepage-general-stats class="section" :content="statisticsContentGroup" />
		<!-- testimonials component -->
		<testimonials class="section" :content="testimonialsContentGroup" />
		<!-- partners component -->
		<corporate-sponsors class="section" :content="corporateSponsorsContentGroup" />
		<!-- bottom cta component -->
		<bottom-CTA class="section" :content="bottomCTAContentGroup" />
	</div>
</template>

<script>
import HomepageHero from '@/components/Homepage/HomepageHero';
import HomepageGeneralStats from '@/components/Homepage/HomepageGeneralStats';
import HomepageLoanCategories from '@/components/Homepage/HomepageLoanCategories';
import HomepageMidrollCTA from '@/components/Homepage/HomepageMidrollCTA';
import HowItWorks from '@/components/Homepage/HomepageHowItWorks';
import CorporateSponsors from '@/components/Homepage/HomepageCorporateSponsors';
import Testimonials from '@/components/Homepage/HomepageTestimonials';
import BottomCTA from '@/components/Homepage/HomepageBottomCTA';

export default {
	components: {
		HomepageHero,
		HomepageGeneralStats,
		HomepageLoanCategories,
		HomepageMidrollCTA,
		HowItWorks,
		CorporateSponsors,
		Testimonials,
		BottomCTA,
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
			return this.content?.page?.contentGroups?.homepageHero ?? null;
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
		}
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

		@include breakpoint(large) {
			padding: 4rem 0;
		}
	}
}
</style>
