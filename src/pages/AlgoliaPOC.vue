<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Algolia Search!</h1>

				<div class="algolia-wrap">
					<ais-index
						v-if="algoliaAppId"
						:app-id="algoliaAppId"
						:api-key="algoliaApiKey"
						:index-name="algoliaDefaultIndex">
						<ais-search-box />
						<ais-results>
							<template slot-scope="{ result }">
								<h2>
									<ais-highlight
										:result="result"
										attribute-name="name" />
								</h2>
							</template>
						</ais-results>
					</ais-index>
				</div>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
// Import your specific Algolia Components here
// V1 components are here: https://community.algolia.com/vue-instantsearch/getting-started/using-components.html
import { Index, SearchBox, Results, Highlight, Pagination } from 'vue-instantsearch';

export default {
	components: {
		WwwPage,
		// Declare them for use here, the key gets converted to lower kabab case for use in the html markup
		// -> To match their example code we add Ais before each component name
		AisIndex: Index,
		AisSearchBox: SearchBox,
		AisResults: Results,
		AisHighlight: Highlight,
		AisPagination: Pagination
	},
	metaInfo: {
		title: 'Algolia Search'
	},
	data() {
		return {
			algoliaAppId: null, // eslint-disable-line
			algoliaApiKey: null, // eslint-disable-line
			algoliaDefaultIndex: null, // eslint-disable-line
		};
	},
	mounted() {
		this.algoliaAppId = typeof window !== 'undefined' ? window.__KV_CONFIG__.algoliaAppId : null; // eslint-disable-line
		this.algoliaApiKey = typeof window !== 'undefined' ? window.__KV_CONFIG__.algoliaApiKey : null; // eslint-disable-line
		this.algoliaDefaultIndex = typeof window !== 'undefined' ? window.__KV_CONFIG__.algoliaDefaultIndex : null; // eslint-disable-line
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.algolia-wrap {
	.ais-index {
		.ais-results {
			h2 {
				font-size: 1.2rem;
			}

			.ais-highlight {
				em {
					color: $kiva-green;
					text-decoration: underline;
					font-weight: 400;
				}
			}
		}
	}
}
</style>
