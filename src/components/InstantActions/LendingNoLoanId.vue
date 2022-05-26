<template>
	<div class="instant-lending-processor">
		<div
			v-if="loanNotFound || tokenValidationFailed"
		>
			<template v-if="loanNotFound">
				<h1>We couldn't find that loan.</h1>
				<p>This loan may have already been funded.</p>
				<p>Find another loan</p>
			</template>
			<template v-else-if="tokenValidationFailed">
				<h1>Validation of your unique email link failed.</h1>
				<p>Find another loan</p>
			</template>
		</div>
	</div>
</template>

<script>
// import logFormatter from '@/util/logFormatter';

export default {
	name: 'LendingNoLoanId',
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
		},
		loanNotFound: {
			type: Boolean,
			default: false
		},
		tokenValidationFailed: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			errorCode: this.$route.query.error,
			errorDescription: this.$route.query.error_description,
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
