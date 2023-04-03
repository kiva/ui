<template>
	<transition :name="transitionType">
		<div
			class="tw-absolute"
			:style="styles"
			:aria-hidden="show ? 'false' : 'true'"
			v-show="show"
		>
			<slot></slot>
		</div>
	</transition>
</template>

<script>
import {
	onBodyTouchstart,
	offBodyTouchstart,
	isTargetElement,
} from '@/util/touchEvents';

export default {
	name: 'KvPopper',
	props: {
		controller: {
			validator(value) {
				if (value instanceof String) return true;
				if (typeof window === 'object'
					&& 'HTMLElement' in window
					&& value instanceof HTMLElement) return true;
				return false;
			},
			required: true,
		},
		openDelay: { type: Number, default: 0 },
		closeDelay: { type: Number, default: 200 },
		// must be defined in our globa/transitions.scss
		transitionType: { type: String, default: '' },
		popperPlacement: { type: String, default: 'bottom-start' },
		popperModifiers: { type: Object, default: () => {} }
	},
	data() {
		return {
			popper: null,
			popperPromise: null,
			styles: {},
			show: false,
			timeout: null,
		};
	},
	computed: {
		reference() {
			return typeof this.controller === 'string' ? document.getElementById(this.controller) : this.controller;
		},
	},
	watch: {
		show(showing) {
			if (this.reference) {
				this.reference.setAttribute('aria-expanded', showing ? 'true' : 'false');
			}
			this.$emit(showing ? 'show' : 'hide');
		},
	},
	mounted() {
		this.reference.tabIndex = 0;
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
			this.initPopper().then(() => {
				this.setTimeout(() => {
					this.show = true;
					this.attachBodyEvents();
				}, this.openDelay);
			});
		},
		close() {
			this.setTimeout(() => {
				this.show = false;
				this.removeBodyEvents();
			}, this.closeDelay);
		},
		toggle() {
			if (this.show) {
				this.close();
			} else {
				this.open();
			}
		},
		update() {
			if (this.popper) {
				this.popper.scheduleUpdate();
			}
		},
		initPopper() {
			// skip loading if popper already created
			if (this.popper) return Promise.resolve();
			// skip loading if loading already started
			if (this.popperPromise) return this.popperPromise;
			// import and init Popper.js
			this.popperPromise = import('popper.js').then(({ default: Popper }) => {
				this.popper = new Popper(this.reference, this.$el, {
					placement: this.popperPlacement,
					modifiers: {
						applyStyle: data => {
							this.styles = data.styles;
							this.setAttributes(data.attributes);
						},
						preventOverflow: {
							padding: 0,
						},
						...this.popperModifiers,
					},
				});
			});
			return this.popperPromise;
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
			this.reference.addEventListener('focus', this.open);
			this.reference.addEventListener('mouseout', this.close);
			this.reference.addEventListener('blur', this.close);
			this.$el.addEventListener('mouseover', this.open);
			this.$el.addEventListener('mouseout', this.close);
			this.reference.addEventListener('touchstart', this.referenceTapHandler);
		},
		attachBodyEvents() {
			onBodyTouchstart(this.bodyTouchHandler);
		},
		removeEvents() {
			this.removeBodyEvents();
			this.reference.removeEventListener('touchstart', this.referenceTapHandler);
			this.reference.removeEventListener('mouseover', this.open);
			this.reference.removeEventListener('mouseout', this.close);
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
