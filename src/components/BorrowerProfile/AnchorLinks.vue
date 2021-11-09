<template>
	<div class="tw-text-primary">
		<hr class="tw-bg-secondary tw-gray-300">
		<span>
			<kv-material-icon
				class="tw-my-3"
				:icon="mdiAccount"
			/>
			<a class="tw-text-primary">Borrower story</a>
		</span>
		<span>
			<kv-material-icon
				class="tw-my-3"
				:icon="mdiFormatListBulleted"
			/>
			<a class="tw-text-primary">Loan details</a>
		</span>
	</div>
</template>

<script>
import { mdiAccount, mdiFormatListBulleted } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		KvMaterialIcon,
	},
	data() {
		return {
			mdiAccount,
			mdiFormatListBulleted,
		};
	},
};
</script>
