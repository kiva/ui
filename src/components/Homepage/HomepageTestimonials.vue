<template>
	<section class="testimonials section text-center">
		<div class="row">
			<p
				v-html="testimonialsHeadline"
				class="testimonials__header large-text small-12 columns"
			>
			</p>
		</div>
		<div class="row">
			<div
				v-for="(supporter, index) in supportersText"
				:key="supporter.key"
				class="testimonials__supporter-card medium-text small-12 large-4 columns"
			>
				<div class="testimonials__supporter-card--img-wrapper">
					<!-- Supporter image -->
					<kv-contentful-img
						v-if="supporter.image.url"
						:class="'testimonials__supporter-card--img testimonials__supporter-card--img-' + index"
						:contentful-src="supporter.image.url"
						:alt="supporter.image.description"
						:width="166"
						:height="166"
						loading="lazy"
						fallback-format="jpg"
					/>

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
	</section>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

const imgRequire = require.context('@/assets/images/iwd/iwd-2021-Homepage', true);

export default {
	components: {
		KvContentfulImg,
	},
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
	padding: 2rem 0;

	&__header {
		margin-bottom: rem-calc(64);
	}

	&__supporter-card {
		margin-bottom: rem-calc(40);

		@include breakpoint(large) {
			margin-bottom: 0;
		}

		&--img-wrapper {
			position: relative;
			width: rem-calc(166);
			margin: 0 auto;
		}

		&--img {
			border-radius: 50%;
			overflow: hidden;
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
			margin-bottom: 0;
		}

		&--page-flourish {
			position: absolute;
		}

		&--page-flourish-1 {
			width: rem-calc(50);
			left: rem-calc(-18);
			top: rem-calc(85);
		}

		&--page-flourish-2 {
			width: rem-calc(45);
			top: rem-calc(10);
			left: rem-calc(-20);
		}

		&--page-flourish-3 {
			width: rem-calc(60);
			top: rem-calc(82);
			right: rem-calc(-13);
		}

		&--page-flourish-4 {
			width: rem-calc(50);
			top: rem-calc(81);
			right: rem-calc(-20);
		}
	}
}

</style>
