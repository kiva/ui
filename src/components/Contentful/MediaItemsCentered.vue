<template>
	<section-with-background-classic
		:background-content="sectionBackground"
		:theme-name="themeName"
		:vertical-padding="verticalPadding"
	>
		<template #content>
			<kv-page-container>
				<kv-grid
					:style="customGridStyles"
					class="tw-grid-cols-12 lg:tw-grid-cols-10 lg:tw-gap-y-4
						tw-justify-items-center tw-text-center tw-rounded tw-bg-white
						tw-py-5 lg:tw-px-[177px]"
				>
					<span
						v-for="(item, index) in contentfulMediaItems"
						:key="index"
						class="tw-flex tw-justify-items-center tw-items-center tw-mb-2"
						:class="[itemClasses, {
							'md:tw-col-span-12': index === 9
						}]"
					>
						<kv-contentful-img
							:contentful-src="item.file.url"
							:alt="item.file.description"
							:width="item.file.details.image.width"
							:height="item.file.details.image.height"
							:style="maxWidthStyles"
						/>
					</span>
				</kv-grid>
			</kv-page-container>
		</template>
	</section-with-background-classic>
</template>

<script>
import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import contentfulStylesMixin from '@/plugins/contentful-ui-setting-styles-mixin';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';

export default {
	name: 'MediaItemsCentered',
	components: {
		KvGrid,
		KvPageContainer,
		SectionWithBackgroundClassic,
		KvContentfulImg,
	},
	mixins: [contentfulStylesMixin],
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		sectionBackground() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
		contentfulMediaItems() {
			const mediaItemsContentfulData = this.content?.media ?? [];
			return mediaItemsContentfulData;
		},
		itemClasses() {
			return ['tw-col-span-6', {
				'md:tw-col-span-4': this.contentfulMediaItems.length >= 6,
				'lg:tw-col-span-2': this.contentfulMediaItems.length >= 6,
			}];
		}
	}
};
</script>
