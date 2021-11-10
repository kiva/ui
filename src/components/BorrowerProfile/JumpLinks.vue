<template>
	<div class="tw-text-primary tw-text-center">
		<hr class="tw-border-tertiary">
		<a
			class="tw-text-primary tw-mr-2.5"
			v-kv-track-event="['Borrower profile', 'click-jump-link', 'Borrower story']"
			href="#loanStory"
		>
			<kv-material-icon
				class="tw-my-3 tw-align-middle"
				:icon="mdiAccount"
			/>
			Borrower story
		</a>
		<a
			class="tw-text-primary tw-mr-2.5"
			v-kv-track-event="['Borrower profile', 'click-jump-link', 'Loan details']"
			href="#loanDetails"
		>
			<kv-material-icon
				class="tw-my-3 tw-align-middle"
				:icon="mdiFormatListBulleted"
			/>
			Loan details
		</a>
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
