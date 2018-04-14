<template>
	<li class="expandable-list-item">
		<button
			@click="toggle"
			:aria-controls="id"
			:aria-expanded="open ? 'true' : 'false'"
		>
			<slot name="title"></slot>
		</button>
		<transition
			name="expandable"
			@enter="enter"
			@after-enter="finish"
			@leave="leave"
			@after-leave="finish"
		>
			<div
				:id="id"
				v-show="open"
				class="kv-expandable-pane"
				:aria-hidden="open ? 'false' : 'true'"
			>
				<slot></slot>
			</div>
		</transition>
	</li>
</template>

<script>
export default {
	props: {
		id: {
			type: String,
			required: true,
			validator: v => v.length > 0 && !/\s/g.test(v), // must be a valid html5 id
		},
		startOpen: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			open: this.startOpen,
		};
	},
	methods: {
		toggle() {
			this.open = !this.open;
		},
		expand() {
			this.open = true;
		},
		collapse() {
			this.open = false;
		},
		/* eslint-disable no-param-reassign */
		enter(el, done) {
			// temporarily reset the styling
			el.style.height = 'auto';
			el.style.display = null;

			// measure the height
			const height = window.getComputedStyle(el).getPropertyValue('height');

			// show with no height...
			el.style.height = 0;

			// ...and set the height immediately after so it animates w/ css
			window.setTimeout(() => {
				el.style.height = height;
			}, 1);

			// finally, finish the animation after 0.5s
			window.setTimeout(done, 500);
		},
		leave(el, done) {
			// explicitly set the height...
			el.style.height = window.getComputedStyle(el).getPropertyValue('height');

			// ...and set the height to 0 immediately after so it animates w/ css
			window.setTimeout(() => {
				el.style.height = 0;
			}, 1);

			// finally, finish the animation after 0.5s
			window.setTimeout(done, 500);
		},
		finish(el) {
			// unset the applied height style
			el.style.height = null;
		},
		/* eslint-enable */
	}
};
</script>

<style lang="scss">
.expandable-enter-active,
.expandable-leave-active {
	transition: height 500ms ease-in-out;
	overflow: hidden;
}
</style>
