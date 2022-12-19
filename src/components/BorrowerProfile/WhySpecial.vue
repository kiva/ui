<template>
	<article>
		<div v-if="loading" class="tw-w-full tw-my-5 md:tw-my-6 lg:tw-my-8">
			<kv-loading-placeholder class="tw-w-full tw-mb-2 lg:tw-mb-3" :style="{height: '1.6rem'}" />
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 60 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
		</div>

		<h2 class="tw-sr-only">
			Why this loan is special
		</h2>
		<p v-if="!loading" class="tw-text-h2 tw-my-5 md:tw-my-6 lg:tw-my-8">
			{{ fullWhySpecial }}
		</p>
	</article>
</template>

<script>
import { gql } from '@apollo/client';
import { createIntersectionObserver } from '@/util/observerUtils';
import { formatWhySpecial } from '@/util/loanUtils';
// TODO: replace the loading placeholder with component from kv-components when available.
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';

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
	beforeDestroy() {
		this.destroyObserver();
	},
};
</script>
