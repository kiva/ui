<template>
	<div @click="handleClick" class="filter-chip">
		<div class="filter-title">{{ title }}</div>
		<kv-icon name="small-x" class="filter-close-button" />
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

$text-purple: #61669C;
$calm-blue: #DDE5FB;
$light-calm-blue: #EEF2FF;

.filter-chip {
	padding: rem-calc(3) rem-calc(12);
	border-radius: rem-calc(4);
	margin-right: rem-calc(6);
	margin-bottom: rem-calc(6);
	display: inline-flex;
	align-items: center;
	color: $text-purple;
	background-color: $light-calm-blue;
	transition: background-color 0.15s linear;
	cursor: pointer;
	user-select: none;

	.filter-close-button {
		margin-left: rem-calc(8);
		width: 1rem;
		height: 1rem;
		fill: $text-purple;
	}

	&:hover {
		background-color: $calm-blue;
	}
}
</style>
