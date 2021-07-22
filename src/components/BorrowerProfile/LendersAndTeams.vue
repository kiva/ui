<template>
	<section>
		<!-- Display Content -->
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
				<span
					v-else
					class="tw-text-h4"
				>
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
						<kv-loading-placeholder class="tw-mb-1 tw-flex-shrink-0 tw-w-full" :style="{height: '14px'}" />
						<kv-loading-placeholder :style="{width: 40 + (Math.random() * 15) + '%', height: '14px'}" />
					</div>
				</div>
			</div>

			<div v-if="!loading" class="section-items tw-grid tw-grid-cols-2 tw-gap-2 tw-mb-3">
				<supporter-details
					v-for="(item, index) in truncatedItemList" :key="index"
					:name="item.name"
					:hash="item.image.hash"
					:display-type="displayType"
					:lender-page="`${ displayType === 'lenders' ? item.lenderPage : null}`"
					:whereabouts="`${ displayType === 'lenders' ? item.lenderPage.whereabouts : ''}`"
				/>
			</div>

			<!-- TODO: Use incoming TextLink component -->
			<button
				v-if="totalItemCount > initialItemLimit"
				class="tw-text-h4"
				@click="openLightbox"
			>
				{{ seeAllLinkText }}
			</button>
		</div>

		<kv-lightbox
			:visible="isLightboxVisible"
			:title="sectionTitle"
			@lightbox-closed="isLightboxVisible = false"
		>
			<template #header>
				<h2 class="tw-text-h2">
					{{ sectionTitle }}
				</h2>
				<div class="tw-mb-3">
					<kv-material-icon
						class="tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle"
						:icon="mdiLightningBolt"
					/>
					<span>{{ poweredByText }}</span>
				</div>
			</template>

			<div class="tw-mb-3 tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2">
				<!-- TODO: Replace with Generic component for showing Either Team or Lender image and information -->
				<div
					v-for="(item, index) in items" :key="index"
					class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-mb-3"
				>
					<kv-loading-placeholder class="tw-rounded md:tw-hidden tw-mb-1.5" :style="{height: '128px'}" />
					<kv-loading-placeholder
						class="tw-rounded md:tw-block tw-hidden tw-mr-2" :style="{width: '88px', height: '88px'}"
					/>
					<div>
						<span v-if="item.name">{{ item.name }}</span><br>
						<span v-if="item.lenderPage && item.lenderPage.whereabouts">
							{{ item.lenderPage.whereabouts }}
						</span>
					</div>
				</div>
			</div>

			<kv-button
				v-if="items.length < totalItemCount"
				class="tw-w-full"
				@click.prevent="loadMore"
				:state="fetchingLightboxItems ? 'loading' : ''"
				variant="ghost"
			>
				Load more
			</kv-button>

			<template #controls>
				<kv-button @click="isLightboxVisible = false">
					Close
				</kv-button>
			</template>
		</kv-lightbox>
	</section>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import gql from 'graphql-tag';
import { createIntersectionObserver } from '@/util/observerUtils';
// TODO: replace the loading placeholder with component from kv-components when available.
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import SupporterDetails from './SupporterDetails';

const teamsQuery = gql`query teamsQuery($loanId: Int!, $limit: Int, $offset: Int) {
	lend {
		loan(id: $loanId) {
			id
			teams(limit: $limit, offset: $offset) {
				totalCount
				values {
					id
					name
					image {
						id
						hash
					}
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
					image {
						id
						hash
					}
				}
			}
		}
	}
}`;

export default {
	components: {
		KvButton,
		KvLightbox,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		SupporterDetails,
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
			fetchingLightboxItems: false,
			initialItemLimit: 6,
			isLightboxVisible: false,
			items: [],
			loading: true,
			mdiLightningBolt,
			observer: null,
			itemQueryLimit: 20,
			itemQueryOffset: 0,
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
		fetchItems(fromLightbox = false) {
			if (this.loanId === 0) return false;

			const queryLimit = fromLightbox ? this.itemQueryLimit : this.initialItemLimit;
			const queryOffset = this.items.length + this.itemQueryOffset;

			// run apollo query
			this.apollo.query({
				query: this.displayType === 'teams' ? teamsQuery : lendersQuery,
				variables: {
					loanId: this.loanId,
					limit: queryLimit,
					offset: queryOffset
				}
			}).then(({ data }) => {
				this.totalItemCount = data?.lend?.loan?.[this.displayType]?.totalCount ?? 0;
				const items = data?.lend?.loan?.[this.displayType]?.values ?? 0;
				// patch in list items
				this.items = [...this.items, ...items];

				this.loading = false;
				if (fromLightbox) {
					this.fetchingLightboxItems = false;
				}
			});
		},
		loadMore() {
			this.fetchingLightboxItems = true;
			// calculate proper offset after initial item limit
			const newOffset = this.items.length === this.initialItemLimit ? 6 : this.offset + 20;
			this.offset = newOffset;
			this.fetchItems(true);
		},
		openLightbox() {
			this.isLightboxVisible = true;
			if (this.items.length <= this.initialItemLimit) {
				this.loadMore();
			}
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
