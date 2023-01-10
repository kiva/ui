<template>
	<section>
		<!-- Display Content -->
		<h2 class="tw-text-h2 tw-mb-3" :data-testid="`bp-updates-header`">
			<!-- eslint-disable-next-line max-len -->
			{{ sectionTitle }} <kv-loading-placeholder v-if="firstLoading" class="tw-inline-block tw-align-middle tw-mb-0.5" :style="{width: '27%', height: '28px' }" />
		</h2>

		<div
			:data-testid="`bp-updates-section`"
		>
			<update-details
				v-for="(journal, index) in journals" :key="journal.id"
				:body="journal.body"
				:date="journal.date"
				:subject="journal.subject"
				:index="totalItemCount - index"
				:image-url="journal.image ? journal.image.url : null"
			/>
		</div>

		<div v-if="loading" class="tw-rounded tw-bg-primary tw-p-3 tw-mb-3">
			<!-- Loading placeholder for journal elements -->
			<kv-loading-placeholder
				class="tw-rounded tw-mb-2 tw-w-full" :style="{ height: '121px' }"
			/>
			<kv-loading-placeholder
				class="tw-mb-2" :style="{ height: '14px', width: '96%' }"
			/>
			<kv-loading-placeholder
				class="tw-mb-2" :style="{ height: '14px', width: '41%' }"
			/>
			<div class="tw-flex tw-justify-between tw-align-baseline">
				<kv-loading-placeholder class="tw-mb-2" :style="{height: '28px', width: '33%'}" />
				<kv-loading-placeholder class="tw-mb-2" :style="{height: '14px', width: '24%'}" />
			</div>
		</div>

		<!-- Load More Button -->
		<div v-if="journals.length < totalItemCount" class="tw-mb-3 tw-text-center">
			<kv-button
				class="tw-mb-3"
				@click="loadMore"
				variant="secondary"
				:disabled="loading"
				:state="buttonState"
				:aria-label="`See older updates`"
			>
				See older updates
			</kv-button>
		</div>
	</section>
</template>

<script>
import { gql } from '@apollo/client';
import { createIntersectionObserver } from '@/util/observerUtils';
// TODO: replace the loading placeholder with component from kv-components when available.
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import UpdateDetails from './UpdateDetails';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const updatesQuery = gql`query updatesQuery($loanId: Int!, $limit: Int, $offset: Int) {
	lend {
		loan(id: $loanId) {
			id
			name
			updates(limit: $limit, offset: $offset ) {
				totalCount
				values {
					id
					body
					subject
					date
					image {
						id
						url
					}
				}
			}
		}
	}
}`;

export default {
	name: 'JournalUpdates',
	components: {
		KvButton,
		KvLoadingPlaceholder,
		UpdateDetails
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			observer: null,
			loading: true,
			loanName: '',
			journals: [],
			itemQueryOffset: 0,
			itemQueryLimit: 3,
			totalItemCount: 0,
		};
	},
	computed: {
		sectionTitle() {
			return `Updates from ${this.loanName}`;
		},
		firstLoading() {
			return this.loading && this.journals.length === 0;
		},
		buttonState() {
			if (this.loading) return 'loading';
			return '';
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
							// exit if already initialized
							if (this.journals.length) return false;
							// This element is close to being in the viewport, so load the data.
							// Because of the apollo cache it's safe to call this repeatedly.
							this.fetchItems();
						}
					});
				}
			});
			if (!this.observer) {
				// Observer was not created, so call fetchItems right away as a fallback.
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

			this.loading = true;

			const updateVars = {
				loanId: this.loanId,
				limit: this.itemQueryLimit,
				offset: this.itemQueryOffset,
			};

			// run apollo query
			this.apollo.query({
				query: updatesQuery,
				variables: updateVars,
			}).then(({ data }) => {
				this.loanName = data?.lend?.loan?.name ?? '';

				this.totalItemCount = data?.lend?.loan?.updates?.totalCount ?? 0;
				if (!this.totalItemCount) {
					this.$emit('hide-section');
				}
				this.journals = this.journals.concat(data?.lend?.loan?.updates?.values ?? []);
				this.loading = false;
			});
		},
		loadMore() {
			this.itemQueryOffset += this.itemQueryLimit;
			this.fetchItems();
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
