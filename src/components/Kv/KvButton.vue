<script>
/* eslint-disable vue/require-prop-types */
export default {
	name: 'KvButton',
	render(createElement) {
		const options = {
			class: { button: true },
			props: {},
			attrs: {},
		};
		if (this.to) {
			options.props.to = this.to;
		}
		if (this.href) {
			options.attrs.href = this.href;
		}
		return createElement(this.tag, options, this.$slots.default);
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
	border-bottom: none;
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

	&.rounded {
		border-radius: rem-calc(10);
	}

	&.smaller {
		@include button-smaller-styles();
		@include breakpoint(medium) {
			box-shadow: $button-smaller-medium-shadow;
		}
	}

	&.smallest {
		@include button-smallest-styles();
		@include breakpoint(medium) {
			box-shadow: $button-smaller-medium-shadow;
		}
	}

	&.alert {
		@include button-style($kiva-accent-red, auto, $white);

		box-shadow: $button-secondary-shadow darken($kiva-accent-red, 10%);
	}

	&.classic {
		border: rem-calc(3) solid $kiva-green;
		box-shadow: none;
		border-radius: rem-calc(20);
		color: $white;
		background-color: $kiva-green;

		&:hover,
		&:focus {
			border-color: darken($kiva-green, 10%);
			background-color: darken($kiva-green, 10%);
			box-shadow: none;
		}
	}

	&.classic.hollow {
		border: rem-calc(3) solid $kiva-green;
		color: $kiva-green;
		background-color: $button-secondary-background;
		box-shadow: none;

		&:hover,
		&:focus {
			background-color: $button-secondary-background;
			box-shadow: none;
			border-color: darken($kiva-green, 10%);
			color: darken($kiva-green, 10%);
		}

		&[disabled] {
			border-color: $magnemite;
			color: $magnemite;
		}
	}

	&.secondary {
		@include secondary-styles();
		@include button-secondary-styles();
	}

	&.secondary.smaller {
		@include button-smaller-styles();
	}

	&.secondary.smallest {
		@include button-smallest-styles();
	}

	&.setting {
		@include secondary-styles();
		@include button-setting-styles();
	}

	&.disabled,
	&[disabled] {
		@include button-disabled();
	}

	&.expanded {
		width: 100%;
	}
}

.text-link {
	display: inline-block;
	color: $anchor-color;
	text-decoration: $anchor-text-decoration;
	line-height: inherit;
	margin: 0;
	border: 0;
	padding: 0;
	border-radius: 0;
	box-shadow: none;
	background: transparent;
	font-size: 1em;
	transition: none;
	vertical-align: baseline;

	&:hover,
	&:focus {
		color: $anchor-color-hover;
		text-decoration: $anchor-text-decoration-hover;
		background: transparent;
	}

	&--alert {
		color: $kiva-accent-red;

		&:hover,
		&:focus {
			color: $kiva-accent-red;
		}
	}
}

a.button {
	&:hover,
	&:focus {
		text-decoration: none;
	}
}
</style>
