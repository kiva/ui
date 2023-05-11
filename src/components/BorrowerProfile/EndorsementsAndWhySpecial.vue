<template>
	<article>
		<div v-if="loading" class="tw-w-full tw-my-5 md:tw-my-6 lg:tw-my-8">
			<kv-loading-placeholder class="tw-w-full tw-mb-2 lg:tw-mb-3" :style="{height: '1.6rem'}" />
			<kv-loading-placeholder
				class="tw-mb-2" :style="{width: 60 + (Math.random() * 15) + '%', height: '1.6rem'}"
			/>
		</div>

		<h2 class="tw-sr-only">
			Loan Endorsements
		</h2>
		<div v-if="!loading" class="tw-my-5 md:tw-my-6 lg:tw-my-8">
			<kv-carousel :multiple-slides-visible="false" :embla-options="{ loop: false }">
				<template v-for="(comment, index) in comments" #[`slide${index}`]>
					<div :key="index">
						<h2>
							<em>"{{ comment.body }}"</em>
						</h2>
						<h2 class="tw-text-right">
							{{ comment.authorName }}
						</h2>
					</div>
				</template>

				<why-special data-testid="bp-why-special" :loan-id="loanId" />
			</kv-carousel>
		</div>
	</article>
</template>

<script>
import { gql } from '@apollo/client';
import { createIntersectionObserver } from '@/util/observerUtils';
import WhySpecial from '@/components/BorrowerProfile/WhySpecial';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'EndorsementsAndWhySpecial',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvCarousel,
		KvLoadingPlaceholder,
		WhySpecial,
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
			comments: [],
		};
	},
	computed: {
	},
	apollo: {
		query: gql`query endorsements($loanId: Int!) {
			lend {
				loan(id: $loanId) {
					id
					comments {
						values {
							id
							userId
							body
							date
						}
					}
				}
			}
		}`,
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			this.comments = result?.data?.lend?.loan?.comments?.values ?? [];
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
				query: gql`query endorsements($loanId: Int!) {
					lend {
						loan(id: $loanId) {
							id
							comments {
								values {
									id
									authorName
									body
								}
							}
						}
					}
				}`,
				variables: {
					loanId: this.loanId
				},
			}).then(result => {
				this.comments = result?.data?.lend?.loan?.comments?.values ?? [];
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
