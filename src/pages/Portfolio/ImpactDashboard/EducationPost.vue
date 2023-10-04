<template>
	<div class="card-container">
		<a
			v-if="!loading"
			:href="url"
			class="card-container-link-image"
			@click="trackEvent('blog-image')"
		>
			<kv-contentful-img
				:alt="headline"
				:width="312"
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
			class="tw-text-h3 text-overflow tw-decoration-white tw-cursor-pointer"
			:class="{ 'tw-line-clamp-2' : truncateHeadline }"
		>
			{{ headline }}
		</a>
		<kv-loading-placeholder v-else class="placeholder" :style="{ height: '2rem' }" />
		<p
			v-if="!loading" class="text-overflow tw-mt-0.5"
			:class="{ 'tw-line-clamp-3 md:tw-line-clamp-4' : truncateSummary }"
		>
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
					width: 312,
					height: 184,
					media: 'min-width: 1025px',
				},
				{
					width: 344,
					height: 217,
					media: 'min-width: 734px',
				},
				{
					width: 278,
					height: 180,
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
		truncateHeadline() {
			return !this.post?.promoHeadline;
		},
		truncateSummary() {
			return !this.post?.promoSummary;
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
	height: 395px;
	max-width: 344px;
	@apply tw-block tw-bg-eco-green-4 tw-rounded tw-p-2 tw-grid-rows-3 tw-decoration-white tw-mx-auto;

	@screen md {
		height: 447px;
	}

	@screen xl {
		margin-left: auto;
		width: 344px;
	}
}

.card-container-link-image {
	@apply tw-block tw-mb-1;

	@screen xl {
		width: 312px;
		height: 184px;
	}
}

.card-container-image {
	@apply !tw-block tw-w-full tw-h-full tw-mb-1;
}

.card-container-image >>> img {
	max-height: 180px;
	@apply tw-rounded;

	@screen md {
		max-height: 217px;
	}
}

.text-overflow {
	@apply tw-text-white tw-overflow-hidden tw-text-ellipsis;
}

.placeholder {
	@apply tw-w-full tw-mb-2;
}
</style>
