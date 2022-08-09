<template>
	<div
		class="
		tw-flex tw-items-stretch tw-flex-nowrap
		tw-overflow-hidden
		tw-border tw-border-tertiary
		tw-rounded tw-w-full tw-mb-2"
	>
		<div class="tw-bg-tertiary tw-p-1 tw-flex-shrink-0 tw-flex tw-items-center">
			<kv-material-icon
				:icon="mdiStar"
				class="tw-w-3 tw-h-3 tw-fill-current tw-text-primary-inverse"
			/>
		</div>
		<p class="tw-bg-primary tw-p-2 tw-flex-1">
			<strong>This loan is special because</strong> {{ text }}
		</p>
	</div>
</template>

<script>
import { mdiStar } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'WhySpecial',
	props: {
		text: {
			type: String,
			required: true,
		}
	},
	components: {
		KvMaterialIcon,
	},
	data() { return { mdiStar }; }
};
</script>
