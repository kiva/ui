<template>
	<div class="row text-center frame">
		<h1 class="columns small-12 impact-text heading-text">
			Browse loans by category
		</h1>
		<div class="row card-row">
			<a
				:href="`/lend-by-category/${loanChannel.name.toLowerCase()}`"
				v-for="loanChannel in loanChannels" :key="loanChannel.id"
				class="columns small-6 medium-4 category-card"
				v-kv-track-event="[
					'homepage',
					'click-Category-card',
					`${loanChannel.name}-category-card`,
					'true']"
			>
				<kv-responsive-image
					:images="[
						['small', loanChannel.image.url],
						['small-retina', loanChannel.retinaImage.url]
					]"
					class="loan-channel-image"
				/>
				<div class="category-card-title-wrap">
					<p class="category-card-title featured-text">
						{{ loanChannel.name }}
					</p>
				</div>
			</a>
			<div class="columns small-12 medium-4 view-all-card">
				<router-link
					:to="`/lend-by-category`"
					class="view-all-card-text featured-text"
					v-kv-track-event="[
						'homepage',
						'click-View all categories',
						'view-all-categories-homepage-card',
						'true']"
				>
					View all
				</router-link>
			</div>
		</div>
		<div class="featured-text row small-10 category-sub-text">
			By lending as little as $25, you can help people around the world
			create opportunity for themselves and their communities.<br>
			<router-link
				:to="`/lend-by-category`"
				class="get-started-link"
				v-kv-track-event="[
					'homepage',
					'click-Get started',
					'lend-by-category-homepage-redirect',
					'true'
				]"
			>
				Get started
			</router-link>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import categoryRowsQuery from '@/graphql/query/categoryRows.graphql';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

export default {
	components: {
		KvResponsiveImage,
	},
	inject: ['apollo'],
	data() {
		return {
		};
	},
	apollo: {
		query: categoryRowsQuery,
		preFetch: true,
		result({ data }) {
			this.loanChannels = _get(data, 'lend.loanChannels.values');
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.heading-text {
	padding: 3rem;
	font-weight: 300;
}

.get-started-link {
	display: contents;
}

.view-all-card-text {
	color: $white;
	line-height: 2.5;
}

.category-sub-text {
	padding-top: 6.25rem;
	padding-bottom: 6.25rem;
	color: $kiva-text-medium;
	margin: 0 auto;

}

.frame {
	padding: 0 0.625rem;
	max-width: 61.875rem;
	margin: 0 auto;

	@include breakpoint(medium) {
		padding: 0 1.25rem;
	}
}

.category-card {
	position: relative;
	padding: 2px;
}

.loan-channel-image {
	width: 100%;
}

.category-card-title-wrap {
	top: 80%;
	position: absolute;
	width: 100%;
	transform: translateY(-50%);
}

.category-card-title {
	padding: 0 0.375rem;
	margin: 0;
	text-align: center;
	text-shadow: 1px 1px 3px #333;
	color: $white;
}

.view-all-card {
	height: 4rem;
	background-color: $kiva-accent-blue;

	@include breakpoint(medium) {
		height: inherit;
	}
}

</style>
