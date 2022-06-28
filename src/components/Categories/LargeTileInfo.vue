<template>
	<div>
		<div class="tw-text-center tw-flex tw-justify-between">
			<h3 class="tw-mt-2 tw-mb-2">
				Lend to {{ categoryName }}
			</h3>
			<h4 class="tw-mt-2 tw-mb-2">
				{{ numberLoans }} loans
			</h4>
		</div>
		<div>
			<p class="tw-line-clamp-3">
				{{ categoryDescription }}
			</p>
		</div>
	</div>
</template>

<script>

export default {
	name: 'LargeTileInfo',
	props: {
		categoryName: {
			type: String,
			default: ''
		},
		categoryDescription: {
			type: String,
			default: ''
		},
		numberLoans: {
			type: Number,
			default: 0
		},
	}
};
</script>
