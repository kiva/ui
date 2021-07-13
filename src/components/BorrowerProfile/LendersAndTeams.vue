<template>
	<section>
		<!-- Display Content  v-if="!loading && this.totalItemCount" -->
		<div>
			<h2 class="tw-text-h2">
				{{ sectionTitle }}
			</h2>

			<div class="tw-mb-3">
				<kv-material-icon
					class="tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle"
					:icon="mdiLightningBolt"
				/>

				<kv-loading-placeholder
					v-if="loading"
					:style="{width: 20 + (Math.random() * 15) + '%', height: '14px'}"
					class="tw-ml-1 tw-inline-block tw-align-middle"
				/>
				<span v-else>
					{{ poweredByText }}
				</span>
			</div>

			<div v-if="loading" class="tw-grid tw-grid-cols-2 tw-gap-2">
				<!-- Loading placeholder for team or lender item elements -->
				<div v-for="i in 5" :key="i" class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-mb-3">
					<kv-loading-placeholder class="tw-rounded md:tw-hidden tw-mb-1.5" :style="{height: '128px'}" />
					<kv-loading-placeholder
						class="tw-rounded md:tw-block tw-hidden tw-mr-2" :style="{width: '88px', height: '88px'}"
					/>
					<div :style="{display: 'block', height: 'auto', width: '50%'}">
						<kv-loading-placeholder class="tw-mb-1 tw-w-full" :style="{height: '14px'}" />
						<kv-loading-placeholder :style="{width: 40 + (Math.random() * 15) + '%', height: '14px'}" />
					</div>
				</div>
			</div>

			<div v-if="!loading" class="section-items tw-mb-3 tw-grid tw-grid-cols-2 tw-gap-2">
				<!-- Replace with Generic component for showing Either Team or Lender image and information -->
				<div
					v-for="(item, index) in truncatedItemList" :key="index"
					class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-mb-3"
				>
					<kv-loading-placeholder class="tw-rounded md:tw-hidden tw-mb-1.5" :style="{height: '128px'}" />
					<kv-loading-placeholder
						class="tw-rounded md:tw-block tw-hidden tw-mr-2" :style="{width: '88px', height: '88px'}"
					/>
					<div>
						{{ item.name }}<br>
						{{ item.lenderPage.whereabouts }}
					</div>
				</div>
			</div>

			<div
				v-if="totalItemCount > initialItemLimit"
				class="tw-text-h4"
				@click="openLightbox"
			>
				{{ seeAllLinkText }}
			</div>
		</div>

		<!-- TODO: Build out Lightbox Content -->
	</section>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import gql from 'graphql-tag';
import { createIntersectionObserver } from '@/util/observerUtils';
// TODO: replace the loading placeholder with component from kv-components when available.
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const teamsQuery = gql`query teamsQuery($loanId: Int!, $limit: Int, $offset: Int) {
	lend {
		loan(id: $loanId) {
			id
			teams(limit: $limit, offset: $offset) {
				totalCount
				values {
					id
					name
					# image {
					# 	id
					# 	hash
					# }
				}
			}
		}
	}
}`;

const lendersQuery = gql`query lendersQuery($loanId: Int!, $limit: Int, $offset: Int) {
	lend {
		loan(id: $loanId) {
			id
			lenders(limit: $limit, offset: $offset) {
				totalCount
				values {
					id
					name
					lenderPage {
						whereabouts
					}
					# image {
					# 	id
					# 	hash
					# }
				}
			}
		}
	}
}`;

export default {
	components: {
		KvLoadingPlaceholder,
		KvMaterialIcon,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		displayType: {
			type: String,
			default: 'lenders',
			validator: value => {
				return ['lenders', 'teams'].indexOf(value) !== -1;
			}
		},
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			initialItemLimit: 6,
			items: [],
			loading: true,
			mdiLightningBolt,
			observer: null,
			totalItemCount: 0,
		};
	},
	computed: {
		countAwareName() {
			const pluralName = this.displayType;
			const singularName = pluralName.slice(0, -1);
			return this.totalItemCount > 1 || this.totalItemCount === 0 ? pluralName
				: singularName;
		},
		poweredByText() {
			return `powered by ${this.totalItemCount} ${this.countAwareName}`;
		},
		sectionTitle() {
			return `Contributing ${this.displayType === 'teams' ? 'lending ' : ''}${this.countAwareName}`;
		},
		seeAllLinkText() {
			// eslint-disable-next-line max-len
			return `See all ${this.totalItemCount} ${this.displayType === 'teams' ? 'lending ' : ''}${this.countAwareName}`;
		},
		truncatedItemList() {
			return this.items.slice(0, this.initialItemLimit);
		}
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
							// exit if already initialized
							if (this.items.length) return false;
							// This element is close to being in the viewport, so load the data.
							// Because of the apollo cache it's safe to call this repeatedly.
							this.fetchItems();
						}
					});
				}
			});
			if (!this.observer) {
				// Observer was not created, so call loadData right away as a fallback.
				this.fetchItems();
			}
		},
		destroyObserver() {
			if (this.observer) {
				this.observer.disconnect();
			}
		},
		fetchItems() {
			if (this.loanId === 0) return false;

			// run apollo query
			this.apollo.query({
				query: this.displayType === 'teams' ? teamsQuery : lendersQuery,
				variables: {
					loanId: this.loanId,
					// TODO: add option for load more limit (20)
					limit: this.initialItemLimit,
					// TODO: add option offset during load more action
					offset: 0
				}
			}).then(({ data }) => {
				this.totalItemCount = data?.lend?.loan?.[this.displayType]?.totalCount ?? 0;
				const items = data?.lend?.loan?.[this.displayType]?.values ?? 0;
				// patch in list items
				// TODO: ensure proper handling once we add load more functionality
				this.items = [...this.items, ...items];

				this.loading = false;
			});
		},
		openLightbox() {
			// Todo: implement lightbox and content
			return false;
		}
	},
	mounted() {
		this.createObserver();
	},
	beforeDestroy() {
		this.destroyObserver();
	},
};
</script>
