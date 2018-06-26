<template functional>
	<a class="success button">
		<svg class="icon icon-check-in-circle">
			<use xlink:href="#icon-check-in-circle">
				<svg viewBox="0 0 50 50" id="icon-check-in-circle" width="100%" height="100%">
					<title>Check-in-circle icon</title>
					<g fill-rule="evenodd" transform="translate(3 3)">
						<circle cx="22" cy="22" r="22" stroke="currentColor" />
						<path fill="currentColor"
							fill-rule="nonzero"
							d="M9.87 24.04L6 27.9l9.4 9.4 23.7-23.43L35.2 10 15.4 29.55l-5.53-5.5" />
					</g>
				</svg>
			</use>
		</svg>
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

	.icon-check-in-circle {
		color: $charcoal;
		width: rem-calc(30);
		height: rem-calc(30);
		vertical-align: middle;
		position: relative;
		margin-top: rem-calc(-5);
		margin-right: rem-calc(5);
	}
}
</style>
