<template>
	<div
		v-for="i in lines" :key="i"
		class="tw-flex tw-justify-between tw-h-2"
		:class="condensed ? 'tw-mb-1' : 'tw-mb-3'"
	>
		<kv-loading-placeholder :style="{width: 20 + (Math.random() * 20) + '%'}" />
		<kv-loading-placeholder :style="{width: 5 + (Math.random() * 5) + '%'}" />
	</div>
</template>

<script>
import { KvLoadingPlaceholder } from '@kiva/kv-components';

export default {
	name: 'DescriptionListLoading',
	components: {
		KvLoadingPlaceholder,
	},
	inject: {
		condensed: { default: false },
	},
	props: {
		lines: {
			type: Number,
			default: 6,
		},
	},
};
</script>
