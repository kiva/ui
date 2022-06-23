<template>
	<div v-if="tileSize === 'large'" class="tw-mb-6">
		<img class="tw-rounded tw-w-full"
			:src="categoryImage"
		>
		<div class="tw-text-center tw-flex tw-justify-between">
			<h3 class="tw-mt-2 tw-mb-2">
				Lend to {{ categoryName }}
			</h3>
			<h4 class="tw-mt-2 tw-mb-2">
				{{ numberLoans }} loans
			</h4>
		</div>
		<div>
			<span class="truncate">
				{{ categoryDescription }}
			</span>
		</div>
	</div>
	<div v-else-if="tileSize === 'medium'" class="tw-mb-6">
		<img class="tw-rounded tw-w-full"
			:src="categoryImage"
		>
		<h3 class="tw-mt-2 tw-mb-2">
			Lend to {{ categoryName }}
		</h3>
		<div>
			<span class="truncate">
				{{ categoryDescription }}
			</span>
		</div>
		<h4 class="tw-mt-2 tw-mb-2 ">
			{{ numberLoans }} loans
		</h4>
	</div>
	<div v-else-if="tileSize === 'small'" class=" tw-mb-3">
		<div class="tw-flex">
			<div class="tw-mr-2">
				<img class="tw-rounded image-sizing"
					:src="categoryImage"
				>
			</div>
			<div>
				<h3 class=" tw-mb-1">
					Lend to {{ categoryName }}
				</h3>
				<!-- <div>
					<span class="truncate ...">
						{{ categoryDescription }}
					</span>
				</div> -->
				<h4 class="tw-mt-2 tw-mb-1 ">
					{{ numberLoans }} loans
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
		categoryName: {
			type: String,
			default: ''
		},
		categoryImage: {
			type: String,
			// eslint-disable-next-line max-len
			default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZmwTlZfck9YScpFfUPHQ6HVyJ3hU7SnN9Xg&usqp=CAU'
		},
		categoryDescription: {
			type: String,
			default: ''
		},
		numberLoans: {
			type: Number,
			default: 0
		}
	},
	components: {
	},
	data() {
		return {
		};
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.image-sizing{
  height: 152px;
  width: 152px;
  object-fit: cover;
}

</style>
