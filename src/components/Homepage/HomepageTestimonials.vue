<template>
	<section class="testimonials section text-center">
		<div class="row">
			<p
				v-html="testimonialsHeadline"
				class="testimonials__header large-text small-12 columns"
			>
			</p>
			<div class="row">
				<div
					v-for="supporter in supportersText"
					:key="supporter.key"
					class="testimonials__supporter-card medium-text small-12 large-4"
				>
					<!-- Supporter image -->
					<img
						v-if="supporter.image.url"
						class="testimonials__supporter-card--img"
						:src="supporter.image.url"
						:alt="supporter.image.description"
					>
					<!-- Supporter name -->
					<p
						v-html="supporter.headline"
						class="testimonials__supporter-card--name"
					>
					</p>
					<!-- Supporter title -->
					<p
						v-html="supporter.subHeadline"
					>
					</p>
					<!-- Supporter quote -->
					<p
						v-html="supporter.quote"
					>
					</p>
					<!-- Supporter card flourish images -->
					<img
						v-if="flourishImgs.card1[0].cardNumber === supporter.key"
						:class="'testimonials__supporter-card--' + flourishImgs.card1[0].class"
						:src="flourishImgs.card1[0].url"
						:alt="flourishImgs.card1[0].description"
					>
					<img
						v-if="flourishImgs.card2[0].cardNumber === supporter.key"
						:class="'testimonials__supporter-card--' + flourishImgs.card2[0].class"
						:src="flourishImgs.card2[0].url"
						:alt="flourishImgs.card2[0].description"
					>
					<img
						v-if="flourishImgs.card2[1].cardNumber === supporter.key"
						:class="'testimonials__supporter-card--' + flourishImgs.card2[1].class"
						:src="flourishImgs.card2[1].url"
						:alt="flourishImgs.card2[1].description"
					>
					<img
						v-if="flourishImgs.card3[0].cardNumber === supporter.key"
						:class="'testimonials__supporter-card--' + flourishImgs.card3[0].class"
						:src="flourishImgs.card3[0].url"
						:alt="flourishImgs.card3[0].description"
					>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
const imgRequire = require.context('@/assets/images/iwd/iwd-2021-Homepage', true);

export default {
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			flourishImgs: {
				card1: [
					{
						description: 'Support card flourish image',
						title: 'Page flourish 1',
						cardNumber: 0,
						class: 'page-flourish-1',
						url: imgRequire('./supporter_card_1_flourish.png'),
					}],
				card2: [
					{
						description: 'Support card flourish image',
						title: 'Page flourish 2',
						cardNumber: 1,
						class: 'page-flourish-2',
						url: imgRequire('./supporter_card_2_flourish_A.png'),
					},
					{
						description: 'Support card flourish image',
						title: 'Page flourish 3',
						cardNumber: 1,
						class: 'page-flourish-3',
						url: imgRequire('./supporter_card_2_flourish_B.png'),
					},
				],
				card3: [
					{
						description: 'Support card flourish image',
						title: 'Page flourish 4',
						cardNumber: 2,
						class: 'page-flourish-4',
						url: imgRequire('./supporter_card_3_flourish.png'),
					}
				],
			},
		};
	},
	computed: {
		testimonialSectionText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-testimonial-section-text') > -1);
		},
		testimonialsHeadline() {
			return this.testimonialSectionText.headline;
		},
		supportersText() {
			const allSupportersText = this.content?.contents?.filter(({ key }) => key.indexOf('testimonial-text') > -1);
			console.log('supporters text', allSupportersText);
			return allSupportersText?.map((supporter, index) => ({
				key: index,
				headline: supporter.headline ?? '',
				subHeadline: supporter.subHeadline ?? '',
				quote: supporter.bodyCopy.content[0].content[0].value ?? '',
				image: this.testimonialImages[index],
			}));
		},
		testimonialImages() {
			const images = this.content?.media ?? [];
			return images.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			}));
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.testimonials {

	&__supporter-card {
		&--img {
			border-radius: 50%;
			max-width: rem-calc(166);
		}

		&--name {
			font-weight: 600;
			color: $kiva-green;
			margin-bottom: 0;
		}
	}

}

</style>
