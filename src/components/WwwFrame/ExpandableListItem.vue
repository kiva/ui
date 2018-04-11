<template>
	<li>
		<button @click="toggle" :aria-controls="name" :aria-expanded="open ? 'true' : 'false'">
			{{ title }}
		</button>
		<div :id="name" :aria-hidden="open ? 'false' : 'true'">
			<slot></slot>
		</div>
	</li>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
			validator: v => v.length > 0 && !/\s/g.test(v),
		},
		open: {
			type: Boolean,
			required: false,
			default: false,
		},
		title: {
			type: String,
			required: true,
		},
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
	}
};
</script>

<style>
</style>
