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
		&--img {
			border-radius: 50%;
			max-width: rem-calc(166);
			margin-bottom: rem-calc(30);
			line-height: 1;
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
			left: rem-calc(-77);
			top: rem-calc(-311);

			@include breakpoint(374) {
				top: rem-calc(-280);
			}

			@include breakpoint(large) {
				left: rem-calc(-76);
				top: rem-calc(-433);
			}

			// Halfway between lg and xlg breakpoints
			@include breakpoint(721) {
				top: rem-calc(-396);
			}

			@include breakpoint(xlarge) {
				top: rem-calc(-372);
			}

			// Halfway between xlg and xxlg breakpoints
			@include breakpoint(875) {
				top: rem-calc(-339);
			}

			@include breakpoint(xxlarge) {
				top: rem-calc(-308);
			}
		}

		&--page-flourish-2 {
			width: rem-calc(45);
			top: rem-calc(-418);
			left: rem-calc(-49);

			@include breakpoint(374) {
				top: rem-calc(-383);
			}

			@include breakpoint(medium) {
				top: rem-calc(-400);
			}

			@include breakpoint(large) {
				top: rem-calc(-578);
				left: rem-calc(-47);
			}

			// Halfway between lg and xlg breakpoints
			@include breakpoint(721) {
				top: rem-calc(-546);
			}

			@include breakpoint(xlarge) {
				top: rem-calc(-479);
			}

			// Halfway between xlg and xxlg breakpoints
			@include breakpoint(875) {
				top: rem-calc(-449);
			}
		}

		&--page-flourish-3 {
			width: rem-calc(60);
			top: rem-calc(-342);
			left: rem-calc(42);

			@include breakpoint(374) {
				top: rem-calc(-308);
			}

			@include breakpoint(medium) {
				top: rem-calc(-287);
			}

			@include breakpoint(large) {
				width: rem-calc(60);
				top: rem-calc(-498);
				left: rem-calc(43);
			}

			// Halfway between lg and xlg breakpoints
			@include breakpoint(721) {
				top: rem-calc(-468);
			}

			@include breakpoint(xlarge) {
				top: rem-calc(-402);
			}

			// Halfway between xlg and xxlg breakpoints
			@include breakpoint(875) {
				top: rem-calc(-374);
			}
		}

		&--page-flourish-4 {
			width: rem-calc(50);
			top: rem-calc(-409);
			left: rem-calc(76);
			margin-bottom: rem-calc(-80);

			@include breakpoint(374) {
				top: rem-calc(-377);
			}

			@include breakpoint(medium) {
				top: rem-calc(-359);
			}

			@include breakpoint(large) {
				width: rem-calc(50);
				top: rem-calc(-602);
				left: rem-calc(74);
			}

			// Halfway between lg and xlg breakpoints
			@include breakpoint(721) {
				top: rem-calc(-533);
			}

			@include breakpoint(xlarge) {
				top: rem-calc(-466);
			}

			// Breakpoint halfway between xlg and xxlg
			@include breakpoint(875) {
				top: rem-calc(-436);
			}
		}
	}
}

</style>
