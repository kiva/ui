<template>
	<section>
		<!-- Display Content -->
		<div>
			<h2 :data-testid="`bp-${displayType}-header`">
				{{ sectionTitle }}
			</h2>

			<div class="tw-mb-3">
				<kv-material-icon
					class="tw-w-2.5 tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle"
					:icon="mdiLightningBolt"
				/>

				<kv-loading-placeholder
					v-if="loading"
					:style="{width: 20 + (Math.random() * 15) + '%', height: '14px'}"
					class="tw-ml-1 tw-inline-block tw-align-middle"
				/>
				<span
					v-else
					class="tw-text-upper"
					:data-testid="`bp-powered-by-${displayType}-message`"
				>
					{{ poweredByText }}
				</span>
			</div>

			<div v-if="loading" class="tw-grid tw-grid-cols-2 tw-gap-2">
				<!-- Loading placeholder for team or lender item elements -->
				<div v-for="i in 5" :key="i" class="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-mb-3">
					<kv-loading-placeholder
						class="tw-rounded md:tw-hidden tw-mb-1.5" :style="{width: '135px', height: '101px'}"
					/>
					<kv-loading-placeholder
						class="tw-rounded md:tw-block tw-hidden tw-mr-2" :style="{width: '96px', height: '96px'}"
					/>
					<div :style="{display: 'block', height: 'auto', width: '50%'}">
						<kv-loading-placeholder class="tw-mb-1 tw-flex-shrink-0 tw-w-full" :style="{height: '14px'}" />
						<kv-loading-placeholder :style="{width: 40 + (Math.random() * 15) + '%', height: '14px'}" />
					</div>
				</div>
			</div>

			<div
				v-if="!loading"
				class="section-items tw-grid tw-grid-cols-2 tw-gap-2 tw-mb-3"
				:data-testid="`bp-${displayType}-grid`"
			>
				<supporter-details
					v-if="supporterOfLoan"
					:data-testid="`bp-${displayType}-support-details-supporter`"
					display-type="lenders"
					:hash="userImageHash"
					:name="userName"
					:whereabouts="userWhereabouts"
					:supporter-page-url="lenderPageUrl"
				/>
				<supporter-details
					v-for="(item, index) in truncatedItemList" :key="index"
					:data-testid="`bp-${displayType}-support-details-${index}`"
					:name="item.name"
					:hash="item.image && item.image.hash ? item.image.hash : ''"
					:item-data="item"
					:display-type="displayType"
					:public-id="`${ displayType === 'lenders' ? item.publicId : item.teamPublicId}`"
					:whereabouts="`${ displayType === 'lenders' ? item.lenderPage.whereabouts : ''}`"
				/>
				<supporter-details
					v-if="hasAnonymousSupporters && displayType === 'lenders'"
					:data-testid="`bp-${displayType}-support-details-anonymous`"
					name="+ Anonymous lenders"
					display-type="lenders"
					:has-anonymous-supporters="hasAnonymousSupporters"
				/>
			</div>

			<kv-text-link
				v-if="totalItemCount > initialItemLimit"
				:data-testid="`bp-${displayType}-see-all-link`"
				@click="openLightbox"
			>
				{{ seeAllLinkText }}
			</kv-text-link>
		</div>

		<kv-lightbox
			:data-testid="`bp-${displayType}-lightbox`"
			:visible="isLightboxVisible"
			:title="sectionTitle"
			@lightbox-closed="isLightboxVisible = false"
		>
			<template #header>
				<h2>
					{{ sectionTitle }}
				</h2>
				<div class="tw-mb-3">
					<kv-material-icon
						class="tw-w-2.5 tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle"
						:icon="mdiLightningBolt"
					/>
					<span :data-testid="`bp-${displayType}-lightbox-powered-by-message`">{{ poweredByText }}</span>
				</div>
			</template>

			<div
				class="tw-mb-3 tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2"
				:data-testid="`bp-lightbox-${displayType}-grid`"
			>
				<supporter-details
					v-if="supporterOfLoan"
					:data-testid="`bp-lightbox-${displayType}-support-details-supporter`"
					display-type="lenders"
					:hash="userImageHash"
					:name="userName"
					:whereabouts="userWhereabouts"
					:supporter-page-url="lenderPageUrl"
				/>
				<supporter-details
					v-for="(item, index) in filteredItemList" :key="`lb_item_${index}`"
					:data-testid="`bp-lightbox-${displayType}-support-details-${index}`"
					:name="item.name"
					:hash="item.image && item.image.hash ? item.image.hash : ''"
					:item-data="item"
					:display-type="displayType"
					:public-id="`${ displayType === 'lenders' ? item.publicId : item.teamPublicId}`"
					:whereabouts="`${ displayType === 'lenders' ? item.lenderPage.whereabouts : ''}`"
				/>
				<supporter-details
					v-if="hasAnonymousSupporters && displayType === 'lenders'"
					:data-testid="`bp-lightbox-${displayType}-support-details-anonymous`"
					name="+ Anonymous lenders"
					display-type="lenders"
					:has-anonymous-supporters="hasAnonymousSupporters"
				/>
			</div>

			<kv-button
				v-if="items.length < totalItemCount"
				:data-testid="`bp-lightbox-${displayType}-load-more-button`"
				class="tw-w-full"
				@click.prevent="loadMore"
				:state="fetchingLightboxItems ? 'loading' : ''"
				variant="ghost"
			>
				Load more
			</kv-button>
		</kv-lightbox>
	</section>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import { gql } from 'graphql-tag';

import {
	KvLoadingPlaceholder, KvButton, KvLightbox, KvMaterialIcon, KvTextLink
} from '@kiva/kv-components';
import SupporterDetails from './SupporterDetails';

const teamsQuery = gql`query teamsQuery($loanId: Int!, $limit: Int, $offset: Int, $sortBy: TeamSearchSortByEnum) {
	lend {
		loan(id: $loanId) {
			id
			teams(limit: $limit, offset: $offset, sortBy: $sortBy ) {
				totalCount
				values {
					category
					id
					image {
						id
						hash
					}
					lenderCount
					lenderCountForLoan(id: $loanId)
					name
					teamPublicId
				}
			}
		}
	}
}`;

const lendersQuery = gql`query lendersQuery($loanId: Int!, $limit: Int, $offset: Int) {
	lend {
		loan(id: $loanId) {
			id
			userProperties {
				lentTo
			}
			lenders(limit: $limit, offset: $offset) {
				totalCount
				values {
					id
					name
					publicId
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

const userQuery = gql`query userQuery {
	my {
		id
		lender {
			id
			publicId
			image {
				id
				hash
			}
			name
			lenderPage {
				whereabouts
			}
		}
	}
}`;

export default {
	name: 'LendersAndTeams',
	components: {
		KvButton,
		KvLightbox,
		KvLoadingPlaceholder,
		KvMaterialIcon,
		KvTextLink,
		SupporterDetails,
	},
	inject: ['apollo', 'cookieStore'],
	emits: ['hide-section'],
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
	// Select the correct items query based on displayType before the apollo plugin processes it.
	// Props are resolved before beforeCreate, so this.displayType is available.
	// The plugin's created() hook runs after this, picking up the updated query.
	beforeCreate() {
		this.$options.apollo = this.$options.apollo.map(op => ({ ...op }));
		const itemsOp = this.$options.apollo[0];
		itemsOp.query = this.displayType === 'teams' ? teamsQuery : lendersQuery;
	},
	apollo: [
		{
			lazy: true,
			query: lendersQuery, // replaced in beforeCreate based on displayType
			variables() {
				const vars = {
					loanId: this.loanId,
					limit: this.itemQueryLimit,
					offset: this.itemQueryOffset,
				};
				if (this.displayType === 'teams') {
					vars.sortBy = this.sortBy;
				}
				return vars;
			},
			result({ data }) {
				this.totalItemCount = data?.lend?.loan?.[this.displayType]?.totalCount ?? 0;
				if (!this.totalItemCount) {
					this.$emit('hide-section');
				}
				const values = data?.lend?.loan?.[this.displayType]?.values ?? [];

				// Check if current user has lent to loan (lenders query only)
				if (this.displayType === 'lenders') {
					const lentTo = data?.lend?.loan?.userProperties?.lentTo ?? false;
					if (lentTo) {
						this.supporterOfLoan = true;
					}
				}

				// Replace items on initial load, append on pagination
				if (this.itemQueryOffset === 0) {
					this.items = values;
				} else {
					this.items = [...this.items, ...values];
				}

				this.loading = false;
				this.fetchingLightboxItems = false;
			},
		},
		{
			query: userQuery,
			result({ data }) {
				const lender = data?.my?.lender;
				this.userId = lender?.id ?? '';
				this.userImageHash = lender?.image?.hash ?? '';
				this.userName = lender?.name ?? '';
				this.userWhereabouts = lender?.lenderPage?.whereabouts ?? '';
				this.lenderPageUrl = lender?.lenderPage?.url ?? '';
			},
		},
	],
	data() {
		return {
			fetchingLightboxItems: false,
			initialItemLimit: 6,
			isLightboxVisible: false,
			items: [],
			loading: true,
			mdiLightningBolt,
			itemQueryOffset: 0,
			itemQueryLimit: 20,
			sortBy: 'memberCount',
			totalItemCount: 0,
			supporterOfLoan: false,
			userId: '',
			userImageHash: '',
			userName: '',
			userWhereabouts: '',
			publicId: '',
			teamPublicId: '',
			lenderPageUrl: '',
		};
	},
	computed: {
		countAwareName() {
			const pluralName = this.displayType;
			const singularName = pluralName.slice(0, -1);
			return this.totalItemCount > 1 || this.totalItemCount === 0 ? pluralName
				: singularName;
		},
		filteredItemList() {
			// extract anon lenders
			return this.items.filter(item => item.name !== 'Anonymous' && item.id !== this.userId);
		},
		hasAnonymousSupporters() {
			const filterItemsList = this.items.filter(item => item.name === 'Anonymous');
			if (filterItemsList.length) {
				return true;
			}
			return false;
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
			let modifier = 0;
			if (this.hasAnonymousSupporters && this.supporterOfLoan) {
				modifier = 2;
			} else if (this.supporterOfLoan) {
				modifier = 1;
			} else if (this.hasAnonymousSupporters) {
				modifier = 1;
			}

			return this.filteredItemList.slice(0, this.initialItemLimit - modifier);
		},
	},
	methods: {
		loadMore() {
			this.fetchingLightboxItems = true;
			this.itemQueryOffset += this.itemQueryLimit;
		},
		openLightbox() {
			this.isLightboxVisible = true;
			if (this.items.length <= this.initialItemLimit) {
				this.loadMore();
			}
		},
	},
};
</script>
