<template>
	<div class="filter-chip-container">
		<div @click="handleClick" class="filter-chip">
			<div class="filter-title">
				{{ title }}
			</div>
			<div class="filter-close-button-container">
				<kv-icon name="small-x" class="filter-close-button" />
			</div>
		</div>
	</div>
</template>
<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: { KvIcon },
	props: {
		title: {
			type: String,
			required: true,
		},
	},
	methods: {
		handleClick() {
			this.$emit('click-chip');
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$calm-blue: #cadcea;
$light-calm-blue: #e7f3fd;

.filter-chip-container {
	display: inline-flex;

	.filter-chip {
		align-items: center;
		background-color: $light-calm-blue;
		border-radius: rem-calc(4);
		color: $faded-blue;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		height: rem-calc(32);
		margin-bottom: rem-calc(6);
		margin-right: rem-calc(6);
		padding-bottom: rem-calc(8);
		padding-left: rem-calc(12);
		padding-top: rem-calc(9);
		padding-right: rem-calc(11.6);
		transition: background-color 0.15s linear;
		user-select: none;
		white-space: nowrap;

		.filter-close-button-container {
			margin-left: rem-calc(11.6);
			padding-top: rem-calc(1);
			text-align: right;

			.filter-close-button {
				fill: $faded-blue;
				height: rem-calc(9.5);
				width: rem-calc(9.5);
			}
		}

		.filter-title {
			font-size: rem-calc(14);
		}

		&:hover {
			background-color: $calm-blue;
		}
	}
}
</style>
