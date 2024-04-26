<template>
	<ul class="lending-stats-item-list">
		<li
			v-for="item in items"
			:key="item[itemKey]"
			class="tw-flex tw-items-center tw-float-left tw-w-full md:tw-w-1/2 tw-pb-0.5"
		>
			<kv-flag
				v-if="isCountry"
				:country="item.isoCode"
				class="item-flag tw-w-2 tw-mr-0.5 tw-flex-shrink-0"
			/>
			<kv-icon
				v-else
				:name="iconKey(item)"
				class="item-icon tw-w-2 tw-h-1.5 tw-mr-0.5 tw-flex-shrink-0"
			/>
			<router-link
				:to="{ path: '/lend', query: { [param]: item[itemKey] }}"
				class="tw-overflow-hidden tw-whitespace-nowrap tw-text-ellipsis"
			>
				{{ item.name }}
			</router-link>
		</li>
	</ul>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvFlag from '@/components/Kv/KvFlag';

export default {
	name: 'ItemList',
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
