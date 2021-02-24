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
					v-for="(supporter, index) in supportersText"
					:key="supporter.key"
					class="testimonials__supporter-card medium-text small-12 large-4 columns"
				>
					<div class="testimonials__supporter-card--img-wrapper">
						<!-- Supporter image -->
						<img
							v-if="supporter.image.url"
							:class="'testimonials__supporter-card--img testimonials__supporter-card--img-' + index"
							:src="supporter.image.url"
							:alt="supporter.image.description"
						>

						<!-- Supporter card flourish images -->
						<!-- eslint-disable max-len -->
						<img
							v-for="flourishImg in flourishImgs[index]"
							:key="flourishImg.class"
							:class="'testimonials__supporter-card--page-flourish testimonials__supporter-card--' + flourishImg.class"
							:src="flourishImg.url"
							:alt="flourishImg.description"
						>
						<!-- eslint-enable max-len -->
					</div>
					<!-- Supporter name -->
					<p
						v-html="supporter.headline"
						class="testimonials__supporter-card--name"
					>
					</p>
					<!-- Supporter title -->
					<p
						class="testimonials__supporter-card--title"
						v-html="supporter.subHeadline"
					>
					</p>
					<!-- Supporter quote -->
					<p
						v-html="supporter.quote"
						class="testimonials__supporter-card--quote"
					>
					</p>
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
			flourishImgs: [
				[
					{
						description: 'Support card flourish image',
						class: 'page-flourish-1',
						url: imgRequire('./supporter_card_1_flourish.png'),
					}],
				[
					{
						description: 'Support card flourish image',
						class: 'page-flourish-2',
						url: imgRequire('./supporter_card_2_flourish_A.png'),
					},
					{
						description: 'Support card flourish image',
						class: 'page-flourish-3',
						url: imgRequire('./supporter_card_2_flourish_B.png'),
					},
				],
				[
					{
						description: 'Support card flourish image',
						class: 'page-flourish-4',
						url: imgRequire('./supporter_card_3_flourish.png'),
					}
				],
			],
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
	&__header {
		margin-bottom: rem-calc(70);
	}

	&__supporter-card {
		&--img-wrapper {
			position: relative;
		}

		&--img {
			border-radius: 50%;
			max-width: rem-calc(166);
			margin-bottom: rem-calc(30);
			line-height: 1;
		}

		// Setting margin offset to make up for the width
		// of the flourish image that's positioned absolutely
		&--img-0 {
			margin-right: rem-calc(-50);
		}

		&--img-1 {
			margin-right: rem-calc(-105);
		}

		&--img-2 {
			margin-right: rem-calc(-50);
		}

		&--name {
			font-weight: 600;
			color: $kiva-green;
			margin-bottom: 0;
			line-height: 1;
		}

		&--title {
			line-height: 1.3;
		}

		&--quote {
			line-height: 1.5;
		}

		&--page-flourish {
			position: relative;
		}

		&--page-flourish-1 {
			width: rem-calc(50);
			left: rem-calc(-140);
			top: rem-calc(22);
		}

		&--page-flourish-2 {
			width: rem-calc(45);
			top: rem-calc(-45);
			left: rem-calc(-84);
		}

		&--page-flourish-3 {
			width: rem-calc(60);
			top: rem-calc(27);
			left: rem-calc(9);
		}

		&--page-flourish-4 {
			width: rem-calc(50);
			top: rem-calc(25);
			left: rem-calc(14);
		}
	}
}

</style>
