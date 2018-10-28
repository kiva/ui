<template>
	<div class="tooltip-pane"
		:class="{'is-open': show}"
		:style="styles"
		:aria-hidden="show ? 'false' : 'true'">
		<slot name="title"></slot>
		<slot></slot>
	</div>
</template>

<script>
import Popper from 'popper.js';
import _map from 'lodash/map';
// may be able to pass down a query as a prop if needed
// - If dynamic data is required it would be good to wrap this component
// import dropdownQuery from '@/graphql/query/dropdown.graphql';
import {
	onBodyTouchstart,
	offBodyTouchstart,
	isTargetElement,
} from '@/util/touchEvents';

export default {
	// inject: ['apollo'],
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
	// apollo: {
	// 	query: dropdownQuery,
	// 	result({ data }) {
	// 		this.usingTouch = data.usingTouch;
	// 	}
	// },
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
				placement: 'top',
				modifiers: {
					// applyStyle: data => {
					// 	this.styles = data.styles;
					// 	this.setAttributes(data.attributes);
					// },
					preventOverflow: {
						padding: 0,
					},
					offset: 15
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
			this.timeout = window.setTimeout(fn, delay);
		}
	},
};
</script>

<style scoped lang="scss">
@import 'settings';
@import 'foundation';
/* @include foundation-dropdown; */

.tooltip-pane {
	display: none;
	padding: 0.8rem 1rem;
	background: lightblue;
	max-width: 20rem;
	border-radius: 0.25rem;
}

.tooltip-pane.is-open {
	display: block;
}
</style>
