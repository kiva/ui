<template>
	<div class="card-container">
		<a
			v-if="!loading"
			:href="url"
			class="tw-block"
			@click="trackEvent('blog-image')"
		>
			<kv-contentful-img
				:alt="headline"
				:width="344"
				:contentful-src="imageUrl"
				class="card-container-image"
				:source-sizes="sourceSizes"
				fallback-format="jpg"
			/>
		</a>
		<kv-loading-placeholder v-else class="placeholder" :style="{ height: '16rem' }" />
		<a
			v-if="!loading"
			:href="url"
			@click="trackEvent('blog-headline')"
			class="tw-text-h3 text-overflow tw-line-clamp-2 tw-mb-0.5 tw-decoration-white tw-cursor-pointer"
		>
			{{ headline }}
		</a>
		<kv-loading-placeholder v-else class="placeholder" :style="{ height: '2rem' }" />
		<p v-if="!loading" class="text-overflow tw-line-clamp-4">
			{{ summary }}
		</p>
		<kv-loading-placeholder v-else class="placeholder" :style="{ height: '2rem' }" />
	</div>
</template>

<script>
import KvContentfulImg from '~/@kiva/kv-components/vue/KvContentfulImg';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'EducationPost',
	components: {
		KvContentfulImg,
		KvLoadingPlaceholder
	},
	props: {
		post: {
			type: Object,
			default: () => {}
		},
		loading: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			sourceSizes: [
				{
					width: 344,
					height: 219,
					media: 'min-width: 734px',
				},
				{
					width: 278,
					height: 200,
					media: 'min-width: 0px',
				},
			]
		};
	},
	methods: {
		trackEvent(property) {
			this.$kvTrackEvent('portfolio', 'click', 'donation-education', property, this.post?.slug);
		}
	},
	computed: {
		imageUrl() {
			return this.post?.image?.fields?.file?.url ?? '';
		},
		headline() {
			return this.post?.promoHeadline ?? this.post?.title ?? '';
		},
		summary() {
			return this.post?.promoSummary ?? this.post?.summary ?? '';
		},
		url() {
			return `https://${this.$appConfig.host}/blog/${this.post?.slug ?? ''}`;
		}
	}
};
</script>

<style lang="postcss" scoped>
.card-container {
	height: 387px;
	@apply tw-block tw-bg-eco-green-4 tw-rounded tw-p-2 tw-grid-rows-3 tw-decoration-white;

	@screen md {
		height: 418px;
	}
}

.card-container-image {
	@apply tw-w-full tw-h-full tw-mb-1;
}

.card-container-image >>> img {
	max-height: 209px;
	@apply tw-rounded;

	@screen md {
		max-height: 239px;
	}
}

.text-overflow {
	@apply tw-text-white tw-overflow-hidden tw-text-ellipsis;
}

.placeholder {
	@apply tw-w-full tw-mb-2;
}
</style>
