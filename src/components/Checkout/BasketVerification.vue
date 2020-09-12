<template>
	<div>
	</div>
</template>

<script>
import getVerificationState from '@/graphql/query/checkout/basketVerificationState.graphql';

export default {
	inject: ['apollo'],
	data() {
		return {
			verificationState: '',
		};
	},
	apollo: {
		preFetch: true,
		query: getVerificationState,
		result({ data }) {
			this.setState(data?.shop?.basketVerificationState || this.verificationState);
		},
	},
	computed: {
		verificationRequired() {
			return this.verificationState === 'required' || this.verificationState === 'pending';
		},
	},
	methods: {
		setState(state) {
			this.verificationState = state;
			this.$emit('verification-state', this.verificationState);
			this.$emit('verification-required', this.verificationRequired);
		},
	},
};
</script>
