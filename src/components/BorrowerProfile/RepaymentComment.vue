<template>
	<span v-if="text">
		<kv-material-icon
			v-if="isRepaid"
			:icon="mdiCheckboxMarkedCircle"
			class="tw-w-3 tw-h-3 tw-align-middle tw-text-eco-green"
		/>
		<kv-material-icon
			v-else-if="isDelinquent"
			:icon="mdiMinusCircle"
			class="tw-w-3 tw-h-3 tw-align-middle tw-text-desert-rose"
		/>
		{{ text }}
	</span>
</template>

<script>
import { mdiCheckboxMarkedCircle, mdiMinusCircle } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';
import { DELINQUENT, REPAID } from '#src/util/repaymentSchedule';

const REPAID_COMMENT = 'Repayment received';
const DELINQUENT_COMMENT = 'Delinquent';

export default {
	name: 'RepaymentComment',
	components: {
		KvMaterialIcon,
	},
	props: {
		status: {
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
	computed: {
		isRepaid() {
			return this.status === REPAID;
		},
		isDelinquent() {
			return this.status === DELINQUENT;
		},
		text() {
			if (this.isRepaid) {
				return REPAID_COMMENT;
			}
			if (this.isDelinquent) {
				return DELINQUENT_COMMENT;
			}
			return '';
		},
	},
};
</script>
