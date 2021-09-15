<template>
	<div class="kv-tailwind">
		<design-header />
		<kv-page-container>
			<header class="tw-py-8">
				<h1>
					<span class="tw-text-primary">Everything</span>
					you need to create <span class="tw-text-brand">good</span> experiences.
				</h1>
			</header>
			<section id="intro">
				<kv-grid class="tw-grid-cols-12 tw-py-8">
					<div class="tw-col-span-12 md:tw-col-span-8">
						<dynamic-rich-text :html="parseRichText(pageIntroContentGroup)" />
					</div>
				</kv-grid>
			</section>
			<section id="logo">
				<design-section-intro :content-group="logoIntroContentGroup" />
				<design-two-up :content-group="logoPrimaryLogoContentGroup" />
			</section>
			<section id="colors">
				<design-section-intro :content-group="colorsIntroContentGroup" />
				<design-two-up :content-group="colorsPrimaryPaletteContentGroup" />
			</section>
			<section id="type">
				<design-section-intro :content-group="typeIntroContentGroup" />
			</section>
		</kv-page-container>
		<design-footer />
	</div>
</template>

<script>
import gql from 'graphql-tag';
import { processPageContent } from '@/util/contentfulUtils';
import DynamicRichText from '@/components/Contentful/DynamicRichText';

import { parseRichTextFromContentGroup } from './util';

import DesignHeader from './DesignHeader';
import DesignFooter from './DesignFooter';
import DesignSectionIntro from './DesignSectionIntro';
import DesignTwoUp from './DesignTwoUp';

// import KvButton from '~/@kiva/kv-components/vue/KvButton';
// import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const pageQuery = gql`
	query designPage {
		contentful {
			entries(contentType: "page", contentKey: "design")
		}
	}
`;

export default {
	components: {
		DesignHeader,
		DesignFooter,
		DesignSectionIntro,
		DesignTwoUp,
		DynamicRichText,
		// KvButton,
		// KvContentfulImg,
		KvGrid,
		KvPageContainer,
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client
				.query({
					query: pageQuery,
				});
		},
		result({ data }) {
			// Check for contentful content
			const pageEntry = data.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContent(pageEntry) : null;
		},
	},
	computed: {
		contentGroups() {
			return this.pageData?.page?.pageLayout?.contentGroups ?? [];
		},
		pageIntroContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'creative-studio-intro' : false;
			});
		},
		logoIntroContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'creative-studio-logo-intro' : false;
			});
		},
		logoPrimaryLogoContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'creative-studio-logo-primary-logo' : false;
			});
		},
		colorsIntroContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'creative-studio-colors-intro' : false;
			});
		},
		colorsPrimaryPaletteContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'creative-studio-colors-primary-palette' : false;
			});
		},
		typeIntroContentGroup() {
			return this.contentGroups?.find(({ key }) => {
				return key ? key === 'creative-studio-type-intro' : false;
			});
		},
	},
	methods: {
		parseRichText(contentGroup) {
			return parseRichTextFromContentGroup(contentGroup);
		},
	}
};
</script>
