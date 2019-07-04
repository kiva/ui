<template>
	<div class="info-panel">
		<button
			@click="toggle"
			:aria-controls="id"
			:aria-expanded="open ? 'true' : 'false'"
			class="title-button"
		>
			<h3 class="panel-title">
				<slot name="title"></slot>
			</h3>
			<kv-icon v-if="expandable" name="small-chevron-mobile" />
		</button>
		<kv-expandable>
			<div
				:id="id"
				v-show="open"
				class="kv-expandable-pane"
				:aria-hidden="open ? 'false' : 'true'"
			>
				<slot></slot>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvExpandable,
		KvIcon,
	},
	props: {
		id: {
			type: String,
			required: true,
			validator: v => v.length > 0 && !/\s/g.test(v), // must be a valid html5 id
		},
		expandable: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.open = !this.expandable;
	},
	methods: {
		toggle() {
			this.open = !this.open || !this.expandable;
		},
		expand() {
			this.open = true;
		},
		collapse() {
			this.open = false;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.info-panel {
	background: rgba($white, 0.8);

	button {
		text-align: left;
		width: 100%;

		.panel-title {
			display: inline-block;
		}

		.icon {
			float: right;
			height: 1.5rem;
			width: rem-calc(25);
			transition: transform 300ms ease;
		}
	}

	button[aria-expanded="true"] {
		.icon {
			transform: rotate(-180deg);
		}
	}
}
</style>
