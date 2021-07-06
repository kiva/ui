<template>
	<article>
		<h2 class="tw-sr-only">
			Why this loan is special
		</h2>
		<p class="tw-text-h2 tw-my-5 md:tw-my-6 lg:tw-my-8">
			{{ fullWhySpecial }}
		</p>
	</article>
</template>

<script>
import gql from 'graphql-tag';
import { formatWhySpecial } from '@/util/loanUtils';

export default {
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			whySpecial: '',
		};
	},
	computed: {
		fullWhySpecial() {
			return formatWhySpecial(this.whySpecial);
		}
	},
	apollo: {
		query: gql`query whySpecial($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					whySpecial
				}
			}
		}`,
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			this.whySpecial = result?.data?.lend?.loan?.whySpecial ?? '';
		},
	},
};
</script>
