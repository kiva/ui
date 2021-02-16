<template>
	<div class="iwd-2021-homepage">
		<!-- hero component. example: -->
		<!-- <homepage-hero :content="heroContentGroup" /> -->
		<!-- loan categories component -->
		<!-- how it works component -->
		<!-- mind the gap component -->
		<!-- iwd kiva stats component -->
		<!-- testimonials component -->
		<!-- partners component -->
		<!-- bottom cta component -->
	</div>
</template>

<script>
export default {
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
		// Example: get content group for a component from the page data
		// heroContentGroup() {
		// 	return this.content?.page?.contentGroups?.homepageHero ?? null;
		// },
	},
};
</script>
