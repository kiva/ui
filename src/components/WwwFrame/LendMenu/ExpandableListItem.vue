<template>
	<li class="expandable-list-item">
		<button
			@click="toggle"
			:aria-controls="id"
			:aria-expanded="open ? 'true' : 'false'"
		>
			<slot name="title"></slot>
		</button>
		<kv-expandable easing="ease-in-out">
			<div
				:id="id"
				v-show="open"
				class="kv-expandable-pane"
				:aria-hidden="open ? 'false' : 'true'"
			>
				<slot></slot>
			</div>
		</kv-expandable>
	</li>
</template>

<script>
import KvExpandable from '@/components/Kv/KvExpandable';

export default {
	components: {
		KvExpandable
	},
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
	}
};
</script>
