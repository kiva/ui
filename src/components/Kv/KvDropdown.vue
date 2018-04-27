<template>
	<div class="dropdown-pane"
		:class="{'is-open': show}"
		:style="styles"
		:aria-hidden="show ? 'false' : 'true'"
	>
		<slot></slot>
	</div>
</template>

<script>
import Popper from 'popper.js';
import { mapState } from 'vuex';
import _map from 'lodash/map';

export default {
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
		};
	},
	computed: {
		reference() {
			return document.getElementById(this.controller);
		},
		...mapState({
			usingTouch: state => state.browser.usingTouch
		}),
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
		this.initPopper();
		this.attachEvents();
	},
	updated() {
		if (this.popper) {
			this.popper.scheduleUpdate();
		}
	},
	beforeDestroy() {
		this.removeEvents();
		if (this.popper) {
			this.popper.destroy();
		}
	},
	methods: {
		open() {
			this.setTimeout(() => {
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
		initPopper() {
			this.popper = new Popper(this.reference, this.$el, {
				placement: 'bottom',
				modifiers: {
					applyStyle: data => {
						this.styles = data.styles;
						this.setAttributes(data.attributes);
					}
				}
			});
		},
		bodyTapHandler(e) {
			if (e.target === this.reference ||
				e.target === this.$el ||
				this.reference.contains(e.target) ||
				this.$el.contains(e.target)
			) {
				return;
			}
			this.show = false;
			this.removeBodyEvents();
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
			[...document.body.children].forEach(child => child.addEventListener('touchstart', this.bodyTapHandler));
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
			[...document.body.children].forEach(child => child.removeEventListener('touchstart', this.bodyTapHandler));
		},
		setAttributes(attrs) {
			_map(attrs, (value, attr) => {
				if (value === false) {
					this.$el.removeAttribute(attr);
				} else {
					this.$el.setAttribute(attr, value);
				}
			});
		},
		setTimeout(fn, delay) {
			window.clearTimeout(this.timeout);
			this.timeout = window.setTimeout(() => {
				fn();
				window.clearTimeout(this.timeout);
			}, delay);
		}
	},
};
</script>

<style lang="scss">
@import 'settings';
@import 'foundation';
@include foundation-dropdown;
</style>
