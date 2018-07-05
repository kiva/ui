<template>
	<kv-button
		class="secondary"
		v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', id, 'true']"
		to="/basket">
		<kv-icon name="check-in-circle" />
		Checkout now
	</kv-button>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvIcon,
		KvButton,
	},
	props: {
		id: {
			type: Number,
			default: null
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

a.secondary.button,
&:focus  {
	padding: rem-calc(13) 0;

	.icon-check-in-circle {
		width: rem-calc(30);
		height: rem-calc(30);
		vertical-align: middle;
		position: relative;
		margin-top: rem-calc(-5);
		margin-right: rem-calc(5);
	}

	&:hover,
	&:active {
		color: $blue;
		border: 1px solid $blue;
		box-shadow: 0 rem-calc(2) $blue;

		svg.icon-check-in-circle {
			color: $blue;
		}
	}
}
</style>
