<template>
	<div
		class="tw-bg-primary tw-flex tw-items-center filter-pill"
	>
		<slot></slot>
		<span class="tw-mx-1.5">{{ selectedItem }}</span>
		<kv-material-icon
			class="tw-w-2.5 tw-h-2.5"
			:icon="mdiChevronDown"
		/>
	</div>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'DropdownPill',
	components: {
		KvMaterialIcon
	},
	props: {
		selectedItem: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			mdiChevronDown
		};
	}
};
</script>

<style lang="postcss" scoped>
.filter-pill {
	border-radius: 16px;
	padding: 10px 20px;
	font-weight: bold;
	box-shadow: 0px 4px 15px 0px #0000000D;
	transition: all .2s ease-in;
}

.filter-pill:hover {
	cursor: pointer;
	background-color: #000;
	color: #FFF;
}
</style>
