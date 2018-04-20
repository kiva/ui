<script>
/* eslint-disable vue/require-prop-types */
export default {
	render(createElement) {
		return createElement(
			this.tag,
			{
				class: {
					button: true
				},
				attrs: {
					href: this.href,
				},
				props: {
					to: this.to,
				},
			},
			this.$slots.default
		);
	},
	props: {
		to: { default: null },
		href: { default: null },
	},
	computed: {
		tag() {
			if (this.to) {
				return 'router-link';
			}
			return this.href ? 'a' : 'button';
		}
	}
};
</script>

<style lang="scss">
@import 'settings';
@import 'foundation';

@mixin secondary-styles() {
	background-color: $button-secondary-background;
	box-shadow: $button-secondary-shadow $button-secondary-border-color;
	border: $button-hollow-border-width solid $button-secondary-border-color;
	color: $button-secondary-color;

	&:hover,
	&:focus {
		background-color: $button-secondary-background;
		box-shadow: $button-secondary-shadow $button-secondary-hover;
		border-color: $button-secondary-hover;
		color: $button-secondary-hover;
	}
}

.button {
	@include button();
	@include button-primary-styles();

	font-weight: $button-font-weight;
	box-shadow: $button-primary-shadow;

	&.smaller {
		@include button-smaller-styles();
		@include breakpoint(medium) {
			box-shadow: $button-smaller-medium-shadow;
		}
	}

	&.secondary {
		@include secondary-styles();
		@include button-secondary-styles();
	}

	&.setting {
		@include secondary-styles();
		@include button-setting-styles();
	}
}

a.button {
	&:hover,
	&:focus {
		text-decoration: none;
	}
}
</style>
