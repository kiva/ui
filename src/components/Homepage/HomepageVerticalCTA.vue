<template>
	<section-with-background
		v-if="showVerticalCTA"
		class="vertical-cta"
		:background-content="sectionBackground"
	>
		<template #content>
			<section
				class="row"
			>
				<kv-contentful-img
					v-if="image.url"
					class="tw-mx-auto vertical-cta__image"
					:contentful-src="image.url"
					:alt="image.description"
					:width="250"
					:height="150"
					loading="lazy"
					fallback-format="png"
				/>
				<h2 v-html="headline" class="small-12 columns vertical-cta__header">
				</h2>
				<div v-html="body" class="small-12 columns vertical-cta__body">
				</div>
			</section>
		</template>
	</section-with-background>
</template>

<script>
import SectionWithBackground from '@/components/Contentful/SectionWithBackground';
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	name: 'HomepageVerticalCTA',
	components: {
		KvContentfulImg,
		SectionWithBackground,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			showVerticalCTA: true
		};
	},
	computed: {
		sectionText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('vertical-cta-text') > -1);
		},
		image() {
			const image = this.content?.media?.[0] ?? {};
			return {
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			};
		},
		headline() {
			return this.sectionText.headline;
		},
		body() {
			const text = this.sectionText?.bodyCopy ?? '';
			return text ? documentToHtmlString(text) : '';
		},
		sectionBackground() {
			return this.content?.contents?.find(({ contentType }) => {
				return contentType ? contentType === 'background' : false;
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.vertical-cta {
	padding: 2rem 0;
	text-align: center;

	&__image {
		margin-bottom: 2.5rem;
	}

	&__header {
		font-size: 3rem;
		font-weight: 500;
		line-height: rem-calc(73.6);
		margin-bottom: 2rem;

		@include breakpoint(large) {
			font-size: 4rem;
		}
	}

	&__body {
		max-width: rem-calc(415);
		margin: 0 auto;
	}
}
</style>
