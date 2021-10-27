<template>
	<div class="instant-lending-processor">
		{{ loanId }} | {{ lendAmount }}
	</div>
</template>

<script>
// import logFormatter from '@/util/logFormatter';

export default {
	inject: ['locale'],
	metaInfo: {
		title: 'Error'
	},
	props: {
		loanId: {
			type: Number,
			default: 0
		},
		lendAmount: {
			type: Number,
			default: 25
		}
	},
	data() {
		return {
			clientId: this.$route.query.client_id,
			lenderLogin: this.$route.query.lender_login !== '0',
		};
	},
	computed: {

	},
	created() {
		// logFormatter(
		// 	`Auth0 authentication error: ${this.errorCode}: ${this.errorDescription}`,
		// 	'warn',
		// 	{ ...this.$route.query }
		// );
	},
};
</script>
