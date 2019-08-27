<template>
	<div>
		<h1 class="impact-text text-center">
			Browse loans by category
		</h1>
		<div class="row text-center">
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
			<div class="columns small-6 medium-4">
				<img class="category-image">
				<div class="category-card-title-wrap">
					<p class="category-card-title"></p>
				</div>
			</div>
		</div>
		<p class="featured-text row text-center category-sub-text">
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
		</p>
	</div>
</template>

<script>

export default {
	components: {
	},
	inject: ['apollo'],
	data() {
		return {
		};
	},
	// apollo: {
	// 	query: whyKivaQuery,
	// 	preFetch: true,
	// 	result({ data }) {
	// 		this.repaymentRate = _get(data, 'general.kivaStats.repaymentRate');
	// 		this.totalLoansInDollars = _get(data, 'general.kivaStats.amountFunded');
	// 		this.numCountries = _get(data, 'general.kivaStats.numCountries');
	// 	}
	// },
	computed: {
	}

};
</script>

<style lang="scss" scoped>
@import 'settings';

.get-started-link {
	display: contents;
}

.category-sub-text {
	padding-top: 6.25rem;
	padding-bottom: 6.25rem;
	color: $kiva-text-medium;
	max-width: 47rem;
}

</style>
