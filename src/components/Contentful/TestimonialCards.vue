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
				v-for="(singleCard, index) in cardData"
				:key="singleCard.key"
				class="testimonials__supporter-card medium-text small-12 large-4 columns"
			>
				<div class="testimonials__supporter-card--img-wrapper">
					<!-- Supporter image -->
					<kv-contentful-img
						v-if="singleCard.imageUrl"
						:class="'testimonials__supporter-card--img testimonials__supporter-card--img-' + index"
						:contentful-src="singleCard.imageUrl"
						:alt="singleCard.name"
						:width="166"
						:height="166"
						loading="lazy"
						fallback-format="jpg"
					/>
				</div>
				<!-- Supporter name -->
				<p
					v-html="singleCard.name"
					class="testimonials__supporter-card--name"
				>
				</p>
				<!-- Supporter title -->
				<p
					class="testimonials__supporter-card--title"
					v-html="singleCard.title"
				>
				</p>
				<!-- Supporter quote -->
				<p
					v-html="singleCard.quote"
					class="testimonials__supporter-card--quote"
				>
				</p>
			</div>
		</div>
	</section>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';

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
	computed: {
		contentfulComponentData() {
			const contentfulData = [];
			const rawContentfulData = this.content?.contents;

			rawContentfulData.forEach(arrayItem => {
				console.log('test', arrayItem);
				contentfulData.push(arrayItem);
			});
			return contentfulData;
		},
		testimonialsHeadline() {
			return this.contentfulComponentData[0].headline;
		},
		cardData() {
			const allCardData = [];
			this.contentfulComponentData.forEach(arrayItem => {
				if (arrayItem.bodyCopy) {
					const name = arrayItem.headline;
					const title = arrayItem.subHeadline;
					const imageUrl = arrayItem.bodyCopy.content[0].data.target.fields.file.url;
					const quote = arrayItem.bodyCopy.content[2].content[0].value;

					const cardData = {
						name, title, imageUrl, quote
					};
					allCardData.push(cardData);
				}
			});

			return allCardData;
		},
		supportersText() {
			this.contentfulComponentData.forEach(arrayItem => {
				if (arrayItem.bodyCopy) {
					const cardData = arrayItem.bodyCopy.content[2].content[0].value;
					return cardData;
				}
			});
			return false;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

// .testimonials {
// 	padding: 2rem 0;

// 	&__header {
// 		margin-bottom: rem-calc(64);
// 	}

// 	&__supporter-card {
// 		margin-bottom: rem-calc(40);

// 		@include breakpoint(large) {
// 			margin-bottom: 0;
// 		}

// 		&--img-wrapper {
// 			position: relative;
// 			width: rem-calc(166);
// 			margin: 0 auto;
// 		}

// 		&--img {
// 			border-radius: 50%;
// 			overflow: hidden;
// 			margin-bottom: rem-calc(30);
// 			line-height: 1;
// 		}

// 		&--name {
// 			font-weight: 600;
// 			color: $kiva-green;
// 			margin-bottom: 0;
// 			line-height: 1;
// 		}

// 		&--title {
// 			line-height: 1.3;
// 		}

// 		&--quote {
// 			line-height: 1.5;
// 			margin-bottom: 0;
// 		}
// 	}
// }

</style>
