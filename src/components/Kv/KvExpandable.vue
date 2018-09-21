<template>
	<transition
		@enter="enter"
		@leave="leave"
	>
		<slot></slot>
	</transition>
</template>

<script>
import { expand, collapse } from '@/util/expander';

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
		enter(el, done) {
			if (this.skipEnter) {
				return done();
			}

			expand(el, {
				property: this.property,
				delay: this.delay,
				easing: this.easing,
				done,
			});
		},
		leave(el, done) {
			if (this.skipLeave) {
				return done();
			}

			collapse(el, {
				property: this.property,
				delay: this.delay,
				easing: this.easing,
				done,
			});
		},
	},
};
</script>
