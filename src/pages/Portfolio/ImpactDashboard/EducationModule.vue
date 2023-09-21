<template>
	<async-portfolio-section @visible="whenVisible" data-testid="education-module">
		<kv-grid class="tw-grid-cols-12 tw-items-center">
			<div class="tw-col-span-12 lg:tw-col-span-6 tw-text-center md:tw-text-left">
				<div class="tw-flex tw-rounded tw-h-12 tw-w-12 tw-bg-primary tw-p-1 tw-mr-2">
					<img class="tw-w-10 tw-h-10" alt="Leaf heart" :src="imageRequire(`./leaf_heart.svg`)">
				</div>
				<h2 class="tw-mb-0.5">
					Donations power progress
				</h2>
				<p class="tw-text-subhead">
					<!-- eslint-disable-next-line max-len -->
					Every dollar donated to Kiva helps bring us one step closer to financial access for all. See what we’ve achieved with your support.
				</p>
			</div>
			<div class="tw-col-span-12 lg:tw-col-span-6">
				<education-post :post="post" :loading="loading" />
			</div>
		</kv-grid>
	</async-portfolio-section>
</template>

<script>
import { gql } from '@apollo/client';
import AsyncPortfolioSection from './AsyncPortfolioSection';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import EducationPost from './EducationPost';

const imageRequire = require.context('@/assets/images/', true);

export default {
	name: 'EducationModule',
	inject: ['apollo'],
	components: {
		AsyncPortfolioSection,
		EducationPost,
		KvGrid,
	},
	data() {
		return {
			loading: true,
			loadingPromise: null,
			post: null,
			imageRequire,
		};
	},
	methods: {
		fetchAsyncData() {
			if (this.loading && !this.loadingPromise) {
				this.loadingPromise = this.apollo.query({
					query: gql`query ContentfulBlogPosts (
						$customFields: String,
						$limit: Int
					) {
						contentful {
							blogPosts: entries(contentType:"blogPost", customFields:$customFields, limit:$limit)
						}
					}`,
					variables: {
						customFields: 'metadata.tags.sys.id[in]=impact-page|order=-fields.originalPublishDate'
					},
				}).then(({ data }) => {
					this.loading = false;
					this.post = data?.contentful?.blogPosts?.items?.[0]?.fields ?? null;
					this.$emit('hide-module', this.post === null);
				}).finally(() => {
					this.loadingPromise = null;
				});
			}
		},
		whenVisible() {
			this.fetchAsyncData();
		}
	},
};
</script>
