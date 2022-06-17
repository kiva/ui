<template>
	<div class="category tw-mb-8">
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
</template>

<script>
export default {
	name: 'MainCategoryTile',
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
</style>
