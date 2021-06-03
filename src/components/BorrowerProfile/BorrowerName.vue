<template>
	<h1 class="text-h2">{{ name }}</h1>
</template>

<script>
import gql from 'graphql-tag';

export default {
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			name: '',
		};
	},
	apollo: {
		query: gql`
			query borrowerName($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						name
					}
				}
			}
		`,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				loanId: route?.params?.id ?? 0,
			};
		},
		variables() {
			return {
				loanId: this.$route?.params?.id ?? 0,
			};
		},
		result({ data }) {
			this.name = data?.lend?.loan?.name ?? '';
		},
	},
};
</script>
