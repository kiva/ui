<template>
	<span v-if="text">
		<kv-material-icon
			v-if="tone === 'repaid'"
			:icon="mdiCheckboxMarkedCircle"
			class="tw-w-3 tw-h-3 tw-align-middle tw-text-eco-green"
		/>
		<kv-material-icon
			v-else-if="tone === 'delinquent'"
			:icon="mdiMinusCircle"
			class="tw-w-3 tw-h-3 tw-align-middle tw-text-desert-rose"
		/>
		{{ text }}
	</span>
</template>

<script>
import { mdiCheckboxMarkedCircle, mdiMinusCircle } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';

export default {
	name: 'RepaymentComment',
	components: {
		KvMaterialIcon,
	},
	props: {
		tone: {
			type: String,
			default: '',
		},
		text: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			mdiCheckboxMarkedCircle,
			mdiMinusCircle,
		};
	},
};
</script>
