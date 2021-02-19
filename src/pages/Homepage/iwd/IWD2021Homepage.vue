<template>
	<div class="iwd-2021-homepage">
		<homepage-hero class="section" :content="heroContentGroup" />
		<homepage-loan-categories class="section" :content="loansContentGroup" />
		<how-it-works class="section" :content="howItWorksContentGroup" />
		<homepage-midroll-c-t-a class="section" :content="midrollContentGroup" />
		<!-- iwd kiva stats component -->
		<!-- testimonials component -->
		<!-- partners component -->
		<!-- bottom cta component -->
	</div>
</template>

<script>
import HomepageHero from '@/components/Homepage/HomepageHero';
import HomepageLoanCategories from '@/components/Homepage/HomepageLoanCategories';
import HomepageMidrollCTA from '@/components/Homepage/HomepageMidrollCTA';
import HowItWorks from '@/components/Homepage/HomepageHowItWorks';

export default {
	components: {
		HomepageHero,
		HomepageLoanCategories,
		HomepageMidrollCTA,
		HowItWorks,
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
