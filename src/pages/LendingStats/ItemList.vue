<template>
	<ul class="lending-stats-item-list">
		<li v-for="item in items" :key="item[itemKey]">
			<kv-flag v-if="isCountry" :country="item.isoCode" />
			<kv-icon v-else :name="iconKey(item)" class="item-icon" />
			<router-link :to="{ path: '/lend', query: { [param]: item[itemKey] }}">
				{{ item.name }}
			</router-link>
		</li>
	</ul>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvFlag from '@/components/Kv/KvFlag';

export default {
	props: {
		items: {
			type: Array,
			required: true,
		},
		itemKey: {
			type: String,
			required: true,
		},
		iconKey: {
			type: Function,
			required: true,
		},
		param: {
			type: String,
			required: true,
		},
	},
	computed: {
		isCountry() {
			return this.param === 'country';
		},
	},
	components: { KvIcon, KvFlag },
};
</script>

<style lang="scss">
@import 'settings';

.lending-stats-item-list {
	margin: 0;

	li {
		list-style: none;
		display: flex;
		align-items: center;
		float: left;
		width: 100%;
		padding-bottom: 0.25rem;
		@include small-text();

		@include breakpoint(xlarge) {
			width: 50%;
		}
	}

	a {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.item-icon {
		width: 1.5rem;
		height: 0.7777rem;
		flex-shrink: 0;
	}
}
</style>
