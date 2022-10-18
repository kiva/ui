<template>
	<div
		class="dropdown-pane"
		:class="{'is-open': show}"
		:style="styles"
		:aria-hidden="show ? 'false' : 'true'"
	>
		<slot></slot>
	</div>
</template>

<script>
import dropdownQuery from '@/graphql/query/dropdown.graphql';
import {
	onBodyTouchstart,
	offBodyTouchstart,
	isTargetElement,
} from '@/util/touchEvents';

export default {
	name: 'KvDropdown',
	inject: ['apollo', 'cookieStore'],
	props: {
		controller: { type: String, required: true },
		openDelay: { type: Number, default: 0 },
		closeDelay: { type: Number, default: 200 },
	},
	data() {
		return {
			popper: null,
			styles: {},
			show: false,
			timeout: null,
			usingTouch: false,
		};
	},
	computed: {
		reference() {
			return document.getElementById(this.controller);
		},
	},
	apollo: {
		query: dropdownQuery,
		result({ data }) {
			this.usingTouch = data.usingTouch;
		}
	},
	watch: {
		usingTouch() {
			if (this.usingTouch && this.popper) {
				this.removeMouseEvents();
			}
		},
		show(showing) {
			if (this.reference) {
				this.reference.setAttribute('aria-expanded', showing ? 'true' : 'false');
			}
			this.$emit(showing ? 'show' : 'hide');
		},
	},
	mounted() {
		this.makeDropdown();
	},
	updated() {
		if (this.popper) {
			this.popper.scheduleUpdate();
		}
	},
	beforeDestroy() {
		this.unmakeDropdown();
	},
	methods: {
		open() {
			this.setTimeout(async () => {
				await this.initPopper();
				this.show = true;
				if (this.usingTouch) {
					this.attachBodyEvents();
				}
			}, this.openDelay);
		},
		close() {
			this.setTimeout(() => {
				this.show = false;
				if (this.usingTouch) {
					this.removeBodyEvents();
				}
			}, this.closeDelay);
		},
		toggle() {
			if (this.show) {
				this.close();
			} else {
				this.open();
			}
		},
		makeDropdown() {
			this.attachEvents();
		},
		unmakeDropdown() {
			this.removeEvents();
			if (this.popper) {
				this.popper.destroy();
			}
		},
		remakeDropdown() {
			this.unmakeDropdown();
			this.makeDropdown();
		},
		async initPopper() {
			if (this.popper) return;
			const { default: Popper } = await import('popper.js');
			if (this.popper) return; // in case popper was initialized in another callback while importing
			this.popper = new Popper(this.reference, this.$el, {
				placement: 'bottom-start',
				modifiers: {
					applyStyle: data => {
						this.styles = data.styles;
						this.setAttributes(data.attributes);
					},
					preventOverflow: {
						padding: 0,
					},
				}
			});
		},
		bodyTouchHandler(e) {
			if (!isTargetElement(e, [this.reference, this.$el])) {
				this.show = false;
				this.removeBodyEvents();
			}
		},
		referenceTapHandler(e) {
			e.preventDefault();
			this.toggle();
		},
		attachEvents() {
			this.reference.addEventListener('mouseover', this.open);
			this.reference.addEventListener('mouseout', this.close);
			this.$el.addEventListener('mouseover', this.open);
			this.$el.addEventListener('mouseout', this.close);
			this.reference.addEventListener('touchstart', this.referenceTapHandler);
		},
		attachBodyEvents() {
			onBodyTouchstart(this.bodyTouchHandler);
		},
		removeEvents() {
			this.removeMouseEvents();
			this.removeBodyEvents();
			this.reference.removeEventListener('touchstart', this.referenceTapHandler);
		},
		removeMouseEvents() {
			this.reference.removeEventListener('mouseover', this.open);
			this.reference.removeEventListener('mouseover', this.close);
			this.$el.removeEventListener('mouseover', this.open);
			this.$el.removeEventListener('mouseout', this.close);
		},
		removeBodyEvents() {
			offBodyTouchstart(this.bodyTouchHandler);
		},
		setAttributes(attrs) {
			Object.keys(attrs).forEach(attr => {
				const value = attrs[attr];
				if (value === false) {
					this.$el.removeAttribute(attr);
				} else {
					this.$el.setAttribute(attr, value);
				}
			});
		},
		setTimeout(fn, delay) {
			window.clearTimeout(this.timeout);
			this.timeout = window.setTimeout(fn, delay);
		}
	},
};
</script>

<style lang="scss">
@import 'settings';
@import 'foundation';
@include foundation-dropdown;
</style>

<style lang="postcss" scoped>
.dropdown-pane {
	@apply !tw-z-overlay;
}
</style>
