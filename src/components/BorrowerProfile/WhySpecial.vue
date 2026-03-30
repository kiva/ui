<template>
	<article>
		<div v-if="loading" class="tw-w-full">
			<kv-loading-placeholder class="tw-w-full tw-mb-2 lg:tw-mb-3" :style="{height: '1.6rem'}" />
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 60 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
		</div>

		<h2 class="tw-sr-only">
			Why this loan is special
		</h2>
		<p v-if="!loading" class="tw-text-headline tw-my-1">
			{{ fullWhySpecial }}
		</p>
	</article>
</template>

<script>
import { gql } from 'graphql-tag';
import { formatWhySpecial } from '#src/util/loanUtils';

import { KvLoadingPlaceholder } from '@kiva/kv-components';

export default {
	name: 'WhySpecial',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvLoadingPlaceholder,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			loading: true,
			whySpecial: '',
		};
	},
	computed: {
		fullWhySpecial() {
			return formatWhySpecial(this.whySpecial);
		}
	},
	apollo: {
		lazy: true,
		query: gql`query whySpecial($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					whySpecial
				}
			}
		}`,
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			this.whySpecial = data?.lend?.loan?.whySpecial ?? '';
			this.loading = false;
		},
	},
};
</script>
