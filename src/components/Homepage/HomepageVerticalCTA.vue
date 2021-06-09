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
					class="small-12 columns vertical-cta__image"
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
import _get from 'lodash/get';
import gql from 'graphql-tag';

import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import SectionWithBackground from '@/components/Contentful/SectionWithBackground';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

const pageQuery = gql`
  query homepageVerticalCTA {
    general {
      homepage_verticalcta_active: uiConfigSetting(key: "homepage_verticalcta_active") {
        key
        value
      }
      homepage_verticalcta_exp: uiExperimentSetting(key: "homepage_verticalcta") {
        key
        value
      }
    }
  }
`;

export default {
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
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			}).then(() => {
				return client.query({ query: experimentAssignmentQuery, variables: { id: 'homepage_verticalcta' } });
			});
		},
		result({ data }) {
			// EXP-GROW-612 is only targed for homepage
			// Always show the comopnent unless we're on the homepage
			if (this.$route.path !== '/') {
				this.showVerticalCTA = true;
			} else {
				// eslint-disable-next-line max-len
				const verticalCTAExpActive = _get(data, 'general.homepage_verticalcta_active.value') === 'true' || false;
				if (verticalCTAExpActive) {
					const verticalCTAExp = this.apollo.readFragment({
						id: 'Experiment:homepage_verticalcta',
						fragment: experimentVersionFragment,
					}) || {};
					const { version } = verticalCTAExp;
					this.showVerticalCTA = version === 'shown';
					this.$kvTrackEvent('Home', 'EXP-GROW-612-May2021', this.showVerticalCTA ? 'b' : 'a');
				}
			}
		}
	},
	data() {
		return {
			showVerticalCTA: false
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
