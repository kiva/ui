<template>
	<p class="tw-text-small tw-text-secondary">
		<template v-if="enableMultiMatching && simultaneousMatching.length > 0">
			{{ totalRatio }}x matching by contributing partners
		</template>
		<template v-else>
			Matched by {{ matchingText }}
		</template>
		<button
			:id="tooltipId"
			type="button"
			class="tw-inline-flex tw-text-secondary tw-align-middle tw--mt-0.5"
			aria-label="More information about loan matching"
		>
			<kv-material-icon
				class="tw-w-2 tw-h-2"
				:icon="mdiInformationOutline"
			/>
		</button>
		<kv-tooltip :controller="tooltipId">
			Loans will be matched while funds last, up to the full loan amount.
		</kv-tooltip>
	</p>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { KvTooltip, KvMaterialIcon } from '@kiva/kv-components';
import { mdiInformationOutline } from '@mdi/js';

export default {
	name: 'LoanMatcher',
	components: {
		KvMaterialIcon,
		KvTooltip,
	},
	data() {
		return { mdiInformationOutline };
	},
	props: {
		matchingText: {
			type: String,
			default: ''
		},
		simultaneousMatching: {
			type: Array,
			default: () => []
		},
		enableMultiMatching: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		tooltipId() {
			return `loan-matcher-tooltip-${getCurrentInstance().uid}`;
		},
		totalRatio() {
			// 1 base match + each org's ratio. e.g. 3 orgs each with ratio 1 => 1 + 1 + 1 + 1 = 4x
			// or 1 org at ratio 2 + 2 orgs at ratio 1 => 1 + 2 + 1 + 1 = 5x
			return this.simultaneousMatching.reduce((sum, m) => sum + m.ratio, 1);
		},
	},
};
</script>
