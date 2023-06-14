<template>
	<section :data-testid="sectionId" class="stats-section">
		<h2 class="tw-flex tw-gap-2 tw-mb-4">
			<span>{{ title }}</span>
			<span class="lent-count tw-text-base tw-bg-brand tw-text-white tw-py-0.5 tw-px-1 tw-self-center">
				{{ lentTo.length }}/{{ itemCount }}
			</span>
		</h2>
		<div class="row tw-overflow-hidden" ref="list">
			<div class="columns small-6">
				<h3 class="tw-pb-2">
					You've lent to
				</h3>
				<item-list
					:items="lentTo"
					:item-key="itemKey"
					:icon-key="iconKey"
					:param="queryParam"
				/>
			</div>
			<div class="columns small-6">
				<template v-if="hasUnlent">
					<h3 class="tw-pb-2">
						You haven't lent to
					</h3>
					<item-list
						:items="notLentTo"
						:item-key="itemKey"
						:icon-key="iconKey"
						:param="queryParam"
					/>
				</template>
				<div v-else class="tw-flex tw-gap-2">
					<kv-material-icon
						class="tw-text-brand tw-w-4 tw-h-4 md:tw-w-6 md:tw-h-6"
						:icon="mdiCheckCircle"
					/>
					<h3 class="tw-text-h2 tw-text-brand">
						Great job!
					</h3>
				</div>
			</div>
		</div>
		<div class="button-area tw-w-full tw-flex tw-flex-col tw-flex-nowrap tw-items-center">
			<button
				v-if="canExpand"
				@click="toggle"
				class="tw-text-link tw-font-medium tw-my-2"
				:aria-pressed="showingMore ? 'true' : 'false'"
				:data-testid="showMoreId"
			>
				{{ showingMore ? 'Hide' : 'Show more' }}
			</button>
			<kv-button
				v-if="hasUnlent"
				:href="unlentUrlRoute"
				variant="secondary"
				:data-testid="lendNewId"
			>
				Lend to a new {{ noun }}
			</kv-button>
		</div>
	</section>
</template>

<script>
import _map from 'lodash/map';
import { expand, collapse } from '@/util/expander';
import { mdiCheckCircle } from '@mdi/js';
import ItemList from './ItemList';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'StatsSection',
	props: {
		title: { type: String, required: true },
		noun: { type: String, required: true },
		notLentTo: { type: Array, required: true },
		lentTo: { type: Array, required: true },
		total: { type: Number, default: 0 },
		query: { type: String, default: null },
		itemKey: { type: String, default: 'id' },
		iconKey: { type: Function, default: () => 'leaf' },
		unlentUrl: { default: null }, // eslint-disable-line vue/require-prop-types
		showMoreId: { type: String, required: true },
		lendNewId: { type: String, required: true },
		sectionId: { type: String, required: true },
	},
	components: {
		ItemList,
		KvButton,
		KvMaterialIcon,
	},
	data() {
		return {
			numShowing: 12,
			showingMore: false,
			baseHeight: 0,
			mdiCheckCircle,
		};
	},
	computed: {
		canExpand() {
			return this.lentTo.length > this.numShowing || this.notLentTo.length > this.numShowing;
		},
		hasUnlent() {
			return this.notLentTo.length > 0;
		},
		itemCount() {
			return this.total ? this.total : this.lentTo.length + this.notLentTo.length;
		},
		queryParam() {
			return this.query ? this.query : this.noun;
		},
		unlentUrlRoute() {
			return this.unlentUrl ? this.unlentUrl
				: `/lend?${this.queryParam}=${_map(this.notLentTo, this.itemKey).join(',')}`;
		}
	},
	methods: {
		measureBaseHeight() {
			const title = this.$refs.list.querySelector('h3');
			const titleHeight = title.offsetHeight;

			const item = this.$refs.list.querySelector('li');
			const itemHeight = item.offsetHeight;

			const totalHeight = titleHeight + (Math.ceil(this.numShowing / 2) * itemHeight);
			return `${totalHeight}px`;
		},
		toggle() {
			this.showingMore = !this.showingMore;

			if (this.showingMore) {
				expand(this.$refs.list, {
					from: this.baseHeight,
					done: () => {
						this.$refs.list.style.height = 'auto';
					}
				});
			} else {
				collapse(this.$refs.list, {
					to: this.baseHeight,
					done: () => {
						this.$refs.list.style.height = this.baseHeight;
					}
				});
			}
		},
	},
	mounted() {
		if (this.canExpand) {
			this.baseHeight = this.measureBaseHeight();
			this.$refs.list.style.height = this.baseHeight;
		}
	}
};
</script>
