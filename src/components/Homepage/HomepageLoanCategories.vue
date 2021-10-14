<template>
	<section class="homepage-loan-categories">
		<div class="row column">
			<h2 class="homepage-loan-categories__header tw-text-center" v-html="sectionHeadline">
			</h2>
			<loan-categories-section />
		</div>
	</section>
</template>

<script>
import LoanCategoriesSection from '@/components/Homepage/LendByCategory/LoanCategoriesSection';

export default {
	components: {
		LoanCategoriesSection,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		sectionText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-loan-categories-text') > -1);
		},
		sectionHeadline() {
			return this.sectionText?.headline ?? 'Support causes you care about.';
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.homepage-loan-categories {
	padding: 2rem 0;

	.row {
		max-width: 69.15rem;
	}

	&__header {
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}
</style>
