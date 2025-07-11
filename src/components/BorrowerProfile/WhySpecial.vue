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
		<p v-if="!loading" class="tw-text-h2 tw-my-1">
			{{ fullWhySpecial }}
		</p>
	</article>
</template>

<script>
import { gql } from 'graphql-tag';
import { createIntersectionObserver } from '#src/util/observerUtils';
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
	methods: {
		createObserver() {
			// Watch for this element being close to entering the viewport
			this.observer = createIntersectionObserver({
				targets: [this.$el],
				rootMargin: '500px',
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$el && entry.intersectionRatio > 0) {
							// This element is close to being in the viewport, so load the data.
							// Because of the apollo cache it's safe to call this repeatedly.
							this.loadData();
						}
					});
				}
			});
			if (!this.observer) {
				// Observer was not created, so call loadData right away as a fallback.
				this.loadData();
			}
		},
		destroyObserver() {
			if (this.observer) {
				this.observer.disconnect();
			}
		},
		loadData() {
			this.apollo.query({
				query: gql`query whySpecial($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							whySpecial
						}
					}
				}`,
				variables: {
					loanId: this.loanId
				},
			}).then(result => {
				this.whySpecial = result?.data?.lend?.loan?.whySpecial ?? '';

				this.loading = false;
			});
		},
	},
	mounted() {
		this.createObserver();
	},
	beforeUnmount() {
		this.destroyObserver();
	},
};
</script>
