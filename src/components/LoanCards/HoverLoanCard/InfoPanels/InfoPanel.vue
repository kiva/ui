<template>
	<div class="info-panel tw-bg-primary" style="--tw-bg-opacity: 0.95;">
		<button
			@click.prevent="toggle"
			:aria-controls="id"
			:aria-expanded="open ? 'true' : 'false'"
			class="title-button"
		>
			<h3 class="panel-title">
				<slot name="title"></slot>
			</h3>
			<kv-icon class="panel-icon" v-if="expandable" name="small-chevron-mobile" :from-sprite="true" />
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
	name: 'InfoPanel',
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
		panelId: {
			type: String,
			default: '',
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
			this.$emit('track-interaction', {
				interactionType: `${this.open ? 'open' : 'close'}-${this.panelId}-panel`,
				interactionElement: `mobile-${this.panelId}-panel`
			});
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
	.title-button {
		text-align: left;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 0.5rem;

		.panel-title {
			font-size: rem-calc(26);
			font-weight: 500;
			line-height: 2rem;
			flex: 1;
		}

		.panel-icon {
			height: 1.5rem;
			width: rem-calc(25);
			transition: transform 300ms ease;
		}

		&:focus {
			outline: none;
		}
	}

	.title-button[aria-expanded="true"] {
		.panel-icon {
			transform: rotate(-180deg);
		}
	}

	@include breakpoint(small only) {
		/* Positioning is to handle loading spinner */
		position: relative;
	}
}
</style>
