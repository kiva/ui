<script>
export default {
	name: '15YearsButton',
	render(createElement) {
		const options = {
			class: ['fifteen-yr-button', this.variant ? `fifteen-yr-button--${this.variant}` : ''],
			props: {},
			attrs: {},
			on: { click: this.onClick },
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
		to: {
			type: String,
			default: null
		},
		href: {
			type: String,
			default: null
		},
		/**
		 * Styling variant
		 * `'', white, black`
		* */
		variant: {
			type: String,
			default: '' // default appears as mint
		}
	},
	computed: {
		tag() {
			if (this.to) {
				return 'router-link';
			}
			return this.href ? 'a' : 'button';
		}
	},
	methods: {
		onClick(e) {
			if (this.tag === 'button' && this.$attrs.type !== 'submit') {
				// emit a vue event and prevent native event
				// so we don't have to write @click.native in our templates
				e.preventDefault();
				this.$emit('click', e);
			}
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.fifteen-yr-button {
	@include h5();

	display: inline-block;
	border-radius: rem-calc(20);
	text-decoration: none;
	background-color: $mint;
	color: $twilight;
	border: rem-calc(2) solid $mint;
	padding: rem-calc(16) rem-calc(36);
	white-space: normal;
	text-align: center;
	transition:
		background-color 0.3s ease-out,
		color 0.3s ease-out,
		border-color 0.3s ease-out;

	@include breakpoint('large') {
		padding: rem-calc(18) rem-calc(48);
	}

	&:hover {
		text-decoration: none;
		background-color: $twilight;
		color: $offwhite;
		border-color: $twilight;
	}

	&--white {
		background-color: transparent;
		color: $offwhite;
		border-color: $offwhite;

		&:hover {
			background-color: $offwhite;
			color: $tomato;
			border-color: $offwhite;
		}
	}

	&--black {
		background-color: transparent;
		color: $twilight;
		border-color: $twilight;

		&:hover {
			background-color: $twilight;
			color: $offwhite;
		}
	}
}
</style>
