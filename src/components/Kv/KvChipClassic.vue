<template>
	<button
		class="
			tw-bg-tertiary
			tw-rounded
			tw-p-1
			tw-pl-1.5
			tw-mb-0.5
			tw-text-small
			tw-inline-flex
			tw-items-center
			tw-shrink-0
		"
		@click.prevent="click"
	>
		<slot></slot> <kv-material-icon :icon="mdiClose" class="tw-w-2 tw-h-2 tw-ml-1" />
	</button>
</template>

<script>
import { mdiClose } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'KvChipClassic',
	components: {
		KvMaterialIcon,
	},
	data() {
		return {
			mdiClose,
		};
	},
	methods: {
		click(event) {
			this.$emit('click', event);
		},
	}
};
</script>
