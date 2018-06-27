<template>
	<a class="success button">
		<kv-icon name="check-in-circle" />
		Checkout now
	</a>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
};

</script>

<style lang="scss">
@import 'settings';

.success.button {
	color: $charcoal;
	background-color: $white;
	border: 1px solid $charcoal;
	box-shadow: 0 rem-calc(2) $charcoal;
	padding: rem-calc(13) 0;

	&:hover {
		color: $blue;
		border: 1px solid $blue;
		box-shadow: 0 rem-calc(2) $blue;

		.icon-check-in-circle {
			color: $blue;
		}
	}

	.icon-check-in-circle {
		width: rem-calc(30);
		height: rem-calc(30);
		vertical-align: middle;
		position: relative;
		margin-top: rem-calc(-5);
		margin-right: rem-calc(5);
	}
}
</style>
