<template>
	<transition
		@enter="enter"
		@after-enter="finish"
		@leave="leave"
		@after-leave="finish"
	>
		<slot></slot>
	</transition>
</template>

<script>
export default {
	props: {
		property: {
			type: String,
			default: 'height',
		},
		delay: {
			type: Number,
			default: 500,
		},
		easing: {
			type: String,
			default: 'ease'
		},
		skipEnter: {
			type: Boolean,
			default: false,
		},
		skipLeave: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		/* eslint-disable no-param-reassign */
		enter(el, done) {
			if (this.skipEnter) {
				return done();
			}

			this.setAnimationStyles(el);

			// to measure the property, set the value to auto and unset display:none from v-show
			el.style[this.property] = 'auto';
			el.style.display = null;

			// measure the property
			const propValue = window.getComputedStyle(el).getPropertyValue(this.property);

			// set the property to 0...
			el.style[this.property] = 0;

			// ...and set the property to the measured value on the next tick so it animates w/ css
			window.setTimeout(() => {
				el.style[this.property] = propValue;
			}, 1);

			// finally, finish the animation after the delay
			window.setTimeout(done, this.delay);
		},
		leave(el, done) {
			if (this.skipLeave) {
				return done();
			}

			this.setAnimationStyles(el);

			// explicitly set the property value...
			el.style[this.property] = window.getComputedStyle(el).getPropertyValue(this.property);

			// ...and set the property to 0 on the next tick so it animates w/ css
			window.setTimeout(() => {
				el.style[this.property] = 0;
			}, 1);

			// finally, finish the animation after 0.5s
			window.setTimeout(done, 500);
		},
		finish(el) {
			// unset the applied styles
			el.style[this.property] = null;
			el.style.overflow = null;
			el.style.transition = null;
		},
		setAnimationStyles(el) {
			// set the initial styles
			el.style.overflow = 'hidden';
			el.style.transition = `${this.property} ${this.delay}ms ${this.easing}`;
		}
		/* eslint-enable */
	},
};
</script>
