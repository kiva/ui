<script>
import { h } from 'vue';

export default {
	name: '15YearsButton',
	render() {
		const options = {
			class: ['fifteen-yr-button', this.variant ? `fifteen-yr-button--${this.variant}` : ''],
			on: { click: this.onClick },
		};
		if (this.to) {
			options.to = this.to;
		}
		if (this.href) {
			options.href = this.href;
		}
		return h(this.tag, options, this.$slots.default());
	},
	emits: ['click'],
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
				e.preventDefault();
				this.$emit('click', e);
			}
		},
	}
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;
@use '#src/assets/scss/components/15-years/15-years' as *;

.fifteen-yr-button {
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

	@include h5();

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
