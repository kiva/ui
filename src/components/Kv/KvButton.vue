<script>
import { h } from 'vue';

/* eslint-disable vue/require-prop-types */
export default {
	name: 'KvButton',
	render() {
		const options = {
			class: { button: true },
		};
		if (this.to) {
			options.to = this.to;
		}
		if (this.href) {
			options.href = this.href;
		}
		return h(this.tag, options, this.$slots.default());
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
@use 'sass:color';
@use '#src/assets/scss/settings' as *;
@use 'foundation-sites/scss/foundation' as f;

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
	font-weight: $button-font-weight;
	box-shadow: $button-primary-shadow;

	@include f.button();
	@include button-primary-styles();

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
		box-shadow: $button-secondary-shadow color.adjust($kiva-accent-red, $lightness: -10%);

		@include f.button-style($kiva-accent-red, auto, $white);
	}

	&.classic {
		border: rem-calc(3) solid $kiva-green;
		box-shadow: none;
		border-radius: rem-calc(20);
		color: $white;
		background-color: $kiva-green;

		&:hover,
		&:focus {
			border-color: color.adjust($kiva-green, $lightness: -10%);
			background-color: color.adjust($kiva-green, $lightness: -10%);
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
			border-color: color.adjust($kiva-green, $lightness: -10%);
			color: color.adjust($kiva-green, $lightness: -10%);
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
		@include f.button-disabled();
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
