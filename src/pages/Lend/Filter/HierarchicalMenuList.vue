<template>
	<ul class="hierarchical-menu-list">
		<li
			v-for="item in items"
			:key="item.value"
			class="hierarchical-menu-item"
			:class="{child: item.isChild}"
		>
			<label
				@click.prevent="refine(item.value)"
				class="hierarchical-menu-item-label"
				:class="{selected: item.isRefined}"
			>
				<input
					type="checkbox"
					:checked="item.isRefined"
					class="hierarchical-menu-item-checkbox"
				>
				<span class="hierarchical-menu-item-text">
					<span class="hierarchical-menu-item-description">{{ item.label }}</span>
					<span class="hierarchical-menu-item-count">({{ item.count }})</span>
				</span>
			</label>
			<!-- eslint-disable vue/attribute-hyphenation -->
			<hierarchical-menu-list
				v-if="item.data"
				:items="item.data"
				:refine="refine"
				:createURL="createURL"
			/>
			<!-- eslint-enable vue/attribute-hyphenation -->
		</li>
	</ul>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'HierarchicalMenuList',
	components: {
		KvIcon,
	},
	props: {
		items: {
			type: Array,
			required: true,
		},
		createURL: {
			type: Function,
			required: true,
		},
		refine: {
			type: Function,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
@import "settings";

.hierarchical-menu-list {
	.hierarchical-menu-item {
		.hierarchical-menu-item-label {
			cursor: pointer;
			user-select: none;

			.hierarchical-menu-item-checkbox {
				pointer-events: none;
			}

			.hierarchical-menu-item-text {
				color: $charcoal;
			}
		}

		&.child {
			.hierarchical-menu-item-label {
				margin-left: 1.5rem;
			}
		}
	}
}
</style>
