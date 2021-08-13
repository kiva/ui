<template>
	<section-with-background :background-content="background">
		<template #content>
			<kv-page-container class="tw-bg-gray-50">
				<kv-grid class="tw-grid-cols-12 tw-text-center">
					<h2
						v-html="testimonialHeadline"
						class="tw-py-4 tw-col-span-12"
					>
					</h2>

					<div
						v-for="(singleCard, index) in cardData"
						:key="index"
						class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-6
							tw-mb-2
							tw-bg-white tw-rounded"
					>
						<div class="tw-pt-4 tw-pb-3">
							<kv-contentful-img
								v-if="singleCard.imageUrl"
								class="tw-rounded-full tw-overflow-hidden"
								:class="'testimonial-card-' + index"
								:contentful-src="singleCard.imageUrl"
								:alt="singleCard.parsedName"
								:width="64"
								:height="64"
								loading="lazy"
								fallback-format="jpg"
							/>
						</div>

						<p
							v-html="singleCard.quote"
							class="tw-text-subhead tw-pb-4 tw-px-2"
						>
						</p>

						<h3
							v-html="singleCard.name + ','"
							class="tw-pb-2"
						>
						</h3>

						<h4
							v-html="singleCard.title"
							class="tw-text-gray-500 tw-pb-4"
						>
						</h4>
					</div>
					<!-- </div> -->
				</kv-grid>
			</kv-page-container>
		</template>
	</section-with-background>
</template>

<script>
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import SectionWithBackground from '@/components/Contentful/SectionWithBackground';
import { richTextRenderer } from '@/util/contentful/richTextRenderer';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	components: {
		KvContentfulImg,
		KvGrid,
		KvPageContainer,
		SectionWithBackground,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		contentfulComponentData() {
			const contentfulData = this.content.contents.filter(({ contentType }) => {
				return contentType === 'genericContentBlock';
			});
			return contentfulData;
		},
		testimonialHeadline() {
			return this.contentfulComponentData[0].headline;
		},
		cardData() {
			const allCardData = [];
			this.contentfulComponentData.forEach(arrayItem => {
				const bodyCopy = richTextRenderer(arrayItem.bodyCopy);

				console.log('arrayItem', arrayItem.bodyCopy);
				if (bodyCopy) {
					// Gathering and formatting all the contentful data
					// to construct the testimonial/supporter card for display
					const nameNode = arrayItem.bodyCopy.content.find(({ nodeType }) => {
						return nodeType === 'heading-3';
					});

					const nameObject = nameNode.content.find(({ nodeType }) => {
						return nodeType === 'text';
					});

					const titleNode = arrayItem.bodyCopy.content.find(({ nodeType }) => {
						return nodeType === 'heading-4';
					});

					const titleObject = titleNode.content.find(({ nodeType }) => {
						return nodeType === 'text';
					});

					const quoteNode = arrayItem.bodyCopy.content.find(({ nodeType }) => {
						return nodeType === 'paragraph';
					});

					const quoteObject = quoteNode.content.find(({ nodeType }) => {
						return nodeType === 'text';
					});

					const imageNode = arrayItem.bodyCopy.content.find(({ nodeType }) => {
						return nodeType === 'embedded-asset-block';
					});

					const name = nameObject.value;
					const title = titleObject.value;
					const imageUrl = imageNode.data.target.fields.file.url;
					const quote = quoteObject.value;

					const cardData = {
						name, title, imageUrl, quote
					};
					allCardData.push(cardData);
				}
			});

			return allCardData;
		},
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
	}
};
</script>
