<template>
	<div class="columns small-1">
		<label class="switch-wrap">
			<input
				type="checkbox"
				class="switch"
				checked="checked"
			>
			<span class="switch-label"></span>
		</label>
	</div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
@import "settings";

.switch-wrap {
	margin-top: rem-calc(5);

	.switch {
		opacity: 0;
		position: absolute;
		z-index: 1;
		width: rem-calc(18);
		height: rem-calc(18);
		cursor: pointer;

		+ .switch-label {
			position: relative;
			display: inline-block;
			cursor: pointer;
		}

		+ .switch-label::before {
			border-radius: rem-calc(12);
			float: left;
			content: "";
			background-color: $kiva-stroke-gray;
			width: rem-calc(52);
			height: rem-calc(22);
			-webkit-transition: background 0.1s ease;
			-o-transition: background 0.1s ease;
			transition: background 0.1s ease;
		}

		+ .switch-label::after {
			content: '';
			position: absolute;
			top: rem-calc(2);
			left: rem-calc(2);
			border-radius: rem-calc(12);
			width: rem-calc(18);
			height: rem-calc(18);
			background-color: $white;
			-webkit-transition: left 0.2s ease;
			-o-transition: left 0.2s ease;
			transition: left 0.2s ease;
		}
	}

	.switch:checked + .switch-label::before {
		// Check with adam about this color
		// Do we want to add a new color to the styleguide?
		// Or should we set an standard opacity on a current green
		// to define this color?
		background-color: #8ccb8c;
	}

	.switch:checked + .switch-label::after {
		left: rem-calc(32);
		background-color: $white;
		border: rem-calc(4) solid $white;
	}
}

</style>
