<template>
	<transition name="fade">
		<div class="tooltip-pane popper"
			:style="styles"
			:aria-hidden="show ? 'false' : 'true'"
			v-show="show">
			<div class="tooltip-content">
				<div class="title-slot">
					<slot name="title"></slot>
				</div>
				<div class="default-slot">
					<slot></slot>
				</div>
			</div>
			<div class="tooltip-arrow" x-arrow=""></div>
		</div>
	</transition>
</template>

<script>
import Popper from 'popper.js';
import _map from 'lodash/map';
import dropdownQuery from '@/graphql/query/shared/usingTouchClient.graphql';
import {
	onBodyTouchstart,
	offBodyTouchstart,
	isTargetElement,
} from '@/util/touchEvents';

export default {
	inject: ['apollo'],
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
					applyStyle: data => {
						this.styles = data.styles;
						this.setAttributes(data.attributes);
					},
					preventOverflow: {
						padding: 10,
					}
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

<style lang="scss" scoped>
@import 'settings';

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.tooltip-pane {
	position: absolute;
	background: lightblue;
	border-radius: rem-calc(3);
	box-shadow: 0 0 1px rgba(25, 81, 130, 0.5);
}

.tooltip-content {
	padding: 0.8rem 1rem;
	max-width: rem-calc(250);
	line-height: $small-text-line-height;
}

.tooltip-content .title-slot {
	font-weight: 800;
	margin-bottom: 0.5rem;
}

.tooltip-arrow {
	width: 0;
	height: 0;
	border-style: solid;
	position: absolute;
	margin: 8px;
	border-color: lightblue;
}

.tooltip-pane[x-placement^="top"] {
	margin-bottom: 8px;
}

.tooltip-pane[x-placement^="top"] .tooltip-arrow {
	border-width: 8px 8px 0 8px;
	border-left-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	bottom: -8px;
	left: calc(50% - 8px);
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip-pane[x-placement^="bottom"] {
	margin-top: 8px;
}

.tooltip-pane[x-placement^="bottom"] .tooltip-arrow {
	border-width: 0 8px 8px 8px;
	border-left-color: transparent;
	border-right-color: transparent;
	border-top-color: transparent;
	top: -8px;
	left: calc(50% - 8px);
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip-pane[x-placement^="right"] {
	margin-left: 8px;
}

.tooltip-pane[x-placement^="right"] .tooltip-arrow {
	border-width: 8px 8px 8px 0;
	border-left-color: transparent;
	border-top-color: transparent;
	border-bottom-color: transparent;
	left: -8px;
	top: calc(50% - 8px);
	margin-left: 0;
	margin-right: 0;
}

.tooltip-pane[x-placement^="left"] {
	margin-right: 8px;
}

.tooltip-pane[x-placement^="left"] .tooltip-arrow {
	border-width: 8px 0 8px 8px;
	border-top-color: transparent;
	border-right-color: transparent;
	border-bottom-color: transparent;
	right: -8px;
	top: calc(50% - 8px);
	margin-left: 0;
	margin-right: 0;
}
</style>
