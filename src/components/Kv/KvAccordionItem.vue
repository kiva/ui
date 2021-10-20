<template>
	<div
		class="kv-accordion"
		:class="{
			'kv-accordion--open' : isOpen,
		}"
	>
		<button
			class="kv-accordion__header-button"
			@click.prevent="toggle"
			:disabled="disabled"
			:aria-controls="`kv-accordion-${id}`"
			:aria-expanded="isOpen ? 'true' : 'false'"
		>
			<span class="kv-accordion__header-text">
				<slot name="header"></slot>
			</span>
			<kv-icon
				class="kv-accordion__header-icon"
				name="small-chevron"
				:from-sprite="true"
				aria-hidden="true"
			/>
		</button>
		<kv-expandable>
			<div
				class="kv-accordion__pane"
				:id="`kv-accordion-${id}`"
				v-show="isOpen"
				:aria-hidden="isOpen ? 'false' : 'true'"
			>
				<slot></slot>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
// Accordion a11y resources
// https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
// https://www.aditus.io/patterns/accordion/

// Future improvement
// Currently the slot content is inside the button, which means h2, h3 etc. won't be
// navigatable via headings. See https://daverupert.com/2019/12/why-details-is-not-an-accordion/
// h2 + button // ✅ H1 will show up when navigating by headings
// button + h2 // ❌ H1 will not show up when navigating by headings
// Perhaps we could do some magic DOM reordering via this.$slots.header or
// pass a prop like 'tag' that sets the parent node of the button. <accordion tag="h3">...

import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvExpandable,
		KvIcon,
	},
	props: {
		/**
		 * Unique id. used for a11y
		* */
		id: {
			type: String,
			required: true,
			validator: v => v.length > 0 && !/\s/g.test(v), // must be a valid html5 id
		},
		/**
		 * Whether the body is shown initially
		* */
		open: {
			type: Boolean,
			default: false,
		},
		/**
		 * Whether the accordion can be toggled
		* */
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			isOpen: this.open
		};
	},
	methods: {
		toggle() {
			if (!this.disabled) {
				this.isOpen = !this.isOpen;
				/**
				 * Fires when the accordion has been toggled.
				 * Contains an object with a boolean 'open' property of the current open state of the accordion
				 * @event toggle
				 * @type {Event}
				 */
				this.$emit('toggle', { open: this.isOpen });
			}
		},
		expand() {
			if (!this.disabled) {
				this.isOpen = true;
			}
		},
		collapse() {
			if (!this.disabled) {
				this.isOpen = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-accordion {
	position: relative;
	border-bottom: 1px solid #ccc;

	&:last-child {
		border-bottom: 0;
	}

	&__header-icon {
		height: 1.5rem;
		width: rem-calc(25);
		transition: transform 300ms ease;
	}

	&__header-button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		text-align: left;
		color: initial;

		&[disabled] {
			@include disabled();
		}

		&:not([disabled]) {
			&:hover,
			&:focus {
				outline: 0;
				color: $anchor-color-hover;
				fill: $anchor-color-hover;
			}
		}
	}

	&__header-text {
		flex: 1;

		> * {
			margin-bottom: 0;
		}
	}

	/* &__pane {
	} */

	// modifiers
	&--open {
		.kv-accordion__header-icon {
			transform: rotate(-180deg);
		}
	}
}

</style>
