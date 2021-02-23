<template>
	<section class="how-it-works section text-center">
		<div class="row">
			<p
				v-html="testimonialsHeadline"
				class="testimonials__header large-text small-12 columns"
			>
			</p>
		</div>
	</section>
</template>

<script>
export default {
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		testimonialSectionText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-testimonial-section-text') > -1);
		},
		testimonialsHeadline() {
			return console.log(this.testimonialSectionText);
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
