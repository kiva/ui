<template>
	<div v-if="tileSize === 'large'" class="tw-mb-6">
		<img class="tw-rounded tw-w-full"
			:src="image"
		>
		<div class="tw-text-center tw-flex tw-justify-between">
			<h3 class="tw-mt-3 tw-mb-3">
				Lend to women
			</h3>
			<h4 class="tw-mt-3 tw-mb-3">
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
	<div v-else-if="tileSize === 'medium'" class="tw-mb-6">
		<img class="tw-rounded tw-w-full"
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
		<div class="tw-flex">
			<div class="tw-mr-2">
				<img class="tw-rounded"
					:src="image"
				>
			</div>
			<div>
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
</style>
