<template>
	<div v-if="tileSize === 'large'" class="category tw-mb-6">
		<img class="category__image tw-rounded"
			:src="image"
		>
		<div id="info">
			<h3 class="tw-mt-3 tw-mb-3">
				Lend to women
			</h3>
			<h4 class="tw-mt-3 tw-mb-3 loans">
				258 loans
			</h4>
		</div>
		<div>
			<span>
				Help women around the world pursue their aspirations and gain
				decision-making power in their homes and communities.
			</span>
		</div>
	</div>
	<div v-else-if="tileSize === 'medium'" class="category tw-mb-6">
		<img class="category__medium-image tw-rounded"
			:src="image"
		>
		<h3 class="tw-mt-2 tw-mb-2">
			Lend to women
		</h3>
		<div>
			<span>
				Help women around the world pursue their aspirations and gain
				decision-making power in their homes and communities.
			</span>
		</div>
		<h4 class="tw-mt-2 tw-mb-2 ">
			258 loans
		</h4>
	</div>
	<div v-else-if="tileSize === 'small'" class=" tw-mb-3">
		<div class="small-tile">
			<div class="category tw-mr-2">
				<img class="category__small-image tw-rounded"
					:src="image"
				>
			</div>
			<div class="">
				<h3 class=" tw-mb-1">
					Lend to women
				</h3>
				<div>
					<span>
						Help women around the world pursue their aspirations and gain
						decision-making power in their homes and communities.
					</span>
				</div>
				<h4 class="tw-mt-1 tw-mb-2 ">
					258 loans
				</h4>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MainCategoryTile',
	props: {
		tileSize: {
			type: String,
			default: 'small'
		},
	},
	components: {
	},
	data() {
		return {
			image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZmwTlZfck9YScpFfUPHQ6HVyJ3hU7SnN9Xg&usqp=CAU'
		};
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.category {
	&__image {
		height: 301px;
		width: 100%;
	}

	&__medium-image {
		height: 267px;
		width: 100%;
	}

	&__small-image {
		height: 152px;
		width: 385px;
	}
}

#info {
	display: flex;
	text-align: center;
}

.loans {
	margin-left: auto;
	text-align: center;
	vertical-align: middle;
}

.small-tile {
	display: flex;
}
</style>
