<template>
	<kv-page-container>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 tw-text-center justify-items-center tw-bg-gray-50">
				<p
					v-html="testimonialHeadline"
					class="tw-text-h2"
				>
				</p>

				<div
					v-for="(singleCard, index) in cardData"
					:key="index"
					class="small-12 large-4 columns tw-bg-white tw-rounded"
				>
					<div class="tw-rounded-full">
						<!-- Supporter image -->
						<kv-contentful-img
							v-if="singleCard.imageUrl"
							:class="'testimonial-card-' + index"
							:contentful-src="singleCard.imageUrl"
							:alt="singleCard.name"
							:width="64"
							:height="64"
							loading="lazy"
							fallback-format="jpg"
						/>
					</div>
					<!-- Supporter quote -->
					<p
						v-html="singleCard.quote"
						class="tw-text-subhead"
					>
					</p>
					<!-- Supporter name -->
					<p
						v-html="singleCard.name"
						class="tw-text-h3"
					>
					</p>
					<!-- Supporter title -->
					<p
						class="tw-text-h4 tw-text-gray-500"
						v-html="singleCard.title"
					>
					</p>
				</div>
			</div>
		</kv-grid>
	</kv-page-container>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	components: {
		KvContentfulImg,
		KvGrid,
		KvPageContainer,
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
				contentfulData.push(arrayItem);
			});
			return contentfulData;
		},
		testimonialHeadline() {
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
	}
};
</script>
