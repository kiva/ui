<template>
	<div class="tw-bg-brand-100 tw-rounded-sm tw-py-1 tw-px-1.5 tw-flex tw-justify-center tw-items-center">
		<img src="@/assets/images/checkout/ftds_sparkle.svg" alt="FTDs Sparkle">
		<p>
			<!-- eslint-disable-next-line max-len -->
			You’ll earn <span class="tw-font-medium">${{ ftdCreditAmount }} in lending credits</span> after checkout to help support another borrower. <sup>1</sup>
		</p>
	</div>
</template>

<script>
export default {
	name: 'FtdsMessage',
	props: {
		ftdCreditAmount: {
			type: String,
			default: ''
		},
	},
};
</script>
