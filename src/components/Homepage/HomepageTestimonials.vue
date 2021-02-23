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

					<!-- eslint-disable max-len -->
					<!-- Supporter card flourish images -->
					<img
						v-for="flourishImg in flourishImgs[index]"
						:key="flourishImg.class"
						:class="'testimonials__supporter-card--page-flourish testimonials__supporter-card--' + flourishImg.class"
						:src="flourishImg.url"
						:alt="flourishImg.description"
					>
					<!-- eslint-enable max-len -->
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

		&--page-flourish {
			position: relative;
		}

		&--page-flourish-1 {
			width: rem-calc(50);
			bottom: 329px;
			left: -77px;

			@include breakpoint(medium) {
				bottom: 293px;
			}

			@include breakpoint(large) {
				width: rem-calc(50);
				top: -329px;
				left: -77px;
			}
		}

		&--page-flourish-2 {
			width: rem-calc(45);
			bottom: 329px;
			left: -17px;

			@include breakpoint(large) {
				width: rem-calc(45);
				top: -478px;
				left: -17px;
			}
		}

		&--page-flourish-3 {
			width: rem-calc(60);
			top: -356px;
			left: 38px;

			@include breakpoint(large) {
				width: rem-calc(60);
				top: -356px;
				left: 38px;
			}
		}

		&--page-flourish-4 {
			width: rem-calc(50);
			top: -435px;
			left: 76px;

			@include breakpoint(large) {
				width: rem-calc(50);
				top: -435px;
				left: 76px;
			}
		}
	}
}

</style>
