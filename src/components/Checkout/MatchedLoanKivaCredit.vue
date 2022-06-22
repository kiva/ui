<template>
	<div class="tw-flex tw-bg-secondary tw-rounded tw-p-2.5 tw-mb-4 tw-gap-2" style="max-width: 470px;">
		<div class="tw-flex">
			<kv-material-icon name="info" :icon="mdiInformationOutline" class="tw-w-2" />
		</div>
		<div>
			<!-- eslint-disable-next-line max-len -->
			<p>Loan matching applies when you pay in full with new funds using Card, Paypal, Google Pay, or Apple Pay.</p>
			<a href="">Learn more</a>
		</div>
	</div>
</template>

<script>
import { mdiInformationOutline } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'MatchedLoanKivaCredit',
	components: {
		KvMaterialIcon
	},
	data() {
		return {
			mdiInformationOutline
		};
	}
};
</script>
