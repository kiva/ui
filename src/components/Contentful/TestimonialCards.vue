<template>
	<div>
		<section-with-background :background-content="background">
			<template #content>
				<kv-page-container>
					<kv-grid class="tw-grid-cols-12 tw-text-center">
						<h2
							v-html="testimonialHeadline"
							class="tw-py-4 tw-col-span-12"
						>
						</h2>

						<figure
							v-for="(singleCard, index) in cardData"
							:key="index"
							class="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-6
							tw-mb-2
							tw-bg-primary tw-rounded"
						>
							<div class="tw-pt-4 tw-pb-3">
								<kv-contentful-img
									v-if="singleCard.imageUrl"
									class="tw-rounded-full tw-overflow-hidden"
									:contentful-src="singleCard.imageUrl"
									:alt="singleCard.parsedName"
									:width="64"
									:height="64"
									loading="lazy"
									fallback-format="jpg"
								/>
							</div>

							<blockquote>
								<p
									v-html="singleCard.quote"
									class="tw-text-subhead tw-pb-4 tw-px-2"
								>
								</p>
							</blockquote>

							<figcaption>
								<h3
									v-html="singleCard.name + ','"
									class="tw-pb-2"
								>
								</h3>

								<h4
									v-html="singleCard.title"
									class="tw-text-secondary tw-pb-4"
								>
								</h4>
							</figcaption>
						</figure>
					</kv-grid>
				</kv-page-container>
			</template>
		</section-with-background>
	</div>
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
			const contentfulData = this.content?.contents?.filter(({ contentType }) => {
				return contentType === 'genericContentBlock';
			});
			return contentfulData;
		},
		testimonialHeadline() {
			const contentfulHeadline = this.content?.contents?.find(({ contentType }) => {
				return contentType === 'richTextContent';
			});
			const richText = richTextRenderer(contentfulHeadline.richText);

			return richText;
		},
		cardData() {
			return this.contentfulComponentData.map(arrayItem => {
				if (arrayItem.bodyCopy) {
					// Gathering and formatting all the contentful data
					// to construct the testimonial/supporter card for display
					const nameNode = arrayItem?.bodyCopy?.content?.find(({ nodeType }) => {
						return nodeType === 'heading-3';
					});

					const nameObject = nameNode?.content?.find(({ nodeType }) => {
						return nodeType === 'text';
					});

					const titleNode = arrayItem?.bodyCopy?.content?.find(({ nodeType }) => {
						return nodeType === 'heading-4';
					});

					const titleObject = titleNode?.content?.find(({ nodeType }) => {
						return nodeType === 'text';
					});

					const quoteNode = arrayItem?.bodyCopy?.content?.find(({ nodeType }) => {
						return nodeType === 'paragraph';
					});

					const quoteObject = quoteNode?.content?.find(({ nodeType }) => {
						return nodeType === 'text';
					});

					const imageNode = arrayItem?.bodyCopy?.content?.find(({ nodeType }) => {
						return nodeType === 'embedded-asset-block';
					});

					const name = nameObject.value;
					const title = titleObject.value;
					const imageUrl = imageNode.data.target.fields.file.url;
					const quote = quoteObject.value;

					const cardData = {
						name, title, imageUrl, quote
					};
					return cardData;
				}
				return false;
			});
		},
		background() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
	}
};
</script>
