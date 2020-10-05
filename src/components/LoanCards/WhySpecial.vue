<template>
	<div class="why-special-loan-card">
		<kv-icon
			class="why-special-loan-card__icon"
			name="star"
			:from-sprite="true"
		/>
		<p class="why-special-loan-card__text">
			<strong>This loan is special because</strong> {{ text }}
		</p>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	props: {
		text: {
			type: String,
			required: true,
		}
	},
	components: {
		KvIcon,
	},
};
</script>

<style lang="scss">
@import 'settings';

$color: #e1e1e1;
$bg-color: #fff;

.why-special-loan-card {
	border: 1px solid $color;
	border-radius: rem-calc(10);
	width: 100%;
	margin-bottom: rem-calc(16);
	overflow: hidden;
	display: flex;
	flex: row nowrap;
	align-items: stretch;

	&__icon {
		background-color: $color;
		color: $bg-color;
		fill: $color;
		padding: rem-calc(7);
		flex-shrink: 0;
		align-items: center;

		.icon {
			width: rem-calc(13);
			height: rem-calc(13);
		}

		@include breakpoint(large up) {
			padding: rem-calc(12);

			.icon {
				width: rem-calc(23);
				height: rem-calc(23);
			}
		}
	}

	&__text {
		line-height: (22 / 16);
		margin: rem-calc(14) rem-calc(10);
		flex-grow: 1;
	}
}
</style>
