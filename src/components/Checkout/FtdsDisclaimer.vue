<template>
	<p class="tw-text-small tw-text-black">
		<!-- eslint-disable-next-line max-len -->
		1. Disclaimer: While funds last, one ${{ ftdCreditAmount }} free credit will be applied to your account after you complete your first loan between now and {{ ftdValidDate }}.You will receive a notification email when your free credit has been applied to your account. Free credits expire after 14 days. Free credits have no cash value and repayments will return to Kiva.
	</p>
</template>

<script>
export default {
	name: 'FtdsDisclaimer',
	props: {
		ftdCreditAmount: {
			type: String,
			default: ''
		},
		ftdValidDate: {
			type: String,
			default: ''
		},
	},
};
</script>
