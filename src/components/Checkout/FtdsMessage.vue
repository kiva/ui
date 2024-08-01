<template>
	<div class="tw-bg-brand-100 tw-rounded-sm tw-py-1 tw-px-1.5 tw-flex tw-justify-center tw-items-center">
		<img :src="sparkleUrl" alt="FTDs Sparkle">
		<p>
			<!-- eslint-disable-next-line max-len -->
			You’ll earn <span class="tw-font-medium">${{ ftdCreditAmount }} in lending credits</span> after checkout to help support another borrower. <sup>1</sup>
		</p>
	</div>
</template>

<script>
import sparkleUrl from '#src/assets/images/checkout/ftds_sparkle.svg?url';

export default {
	name: 'FtdsMessage',
	props: {
		ftdCreditAmount: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			sparkleUrl,
		};
	},
};
</script>
