<template>
	<section class="stats-section">
		<h2>
			<span>{{ title }}</span>
			<span class="lent-count">{{ lentTo.length }}/{{ itemCount }}</span>
		</h2>
		<div class="row stats-list" ref="list">
			<div class="columns small-6">
				<h3>You've lent to</h3>
				<item-list
					:items="lentTo"
					:item-key="itemKey"
					:icon-key="iconKey"
					:param="queryParam"
				/>
			</div>
			<div class="columns small-6">
				<template v-if="hasUnlent">
					<h3>You haven't lent to</h3>
					<item-list
						:items="notLentTo"
						:item-key="itemKey"
						:icon-key="iconKey"
						:param="queryParam"
					/>
				</template>
				<div v-else class="completed">
					<kv-icon name="confirmation" />
					<span>Great job!</span>
				</div>
			</div>
		</div>
		<div class="button-area">
			<button
				v-if="canExpand"
				@click="toggle"
				class="show-more-button"
				:aria-pressed="showingMore ? 'true' : 'false'"
			>
				{{ showingMore ? 'Hide' : 'Show more' }}
			</button>
			<kv-button v-if="hasUnlent" :to="unlentUrlRoute" class="secondary lend-to-new-button">
				Lend to a new {{ noun }}
			</kv-button>
		</div>
	</section>
</template>

<script>
import _map from 'lodash/map';
import numeral from 'numeral';
import { expand, collapse } from '@/util/expander';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import ItemList from './ItemList';

export default {
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
	},
	components: {
		ItemList,
		KvButton,
		KvIcon,
	},
	data() {
		return {
			numShowing: 12,
			showingMore: false,
			baseHeight: 0,
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
			return this.unlentUrl ? this.unlentUrl : {
				path: '/lend',
				query: {
					[this.queryParam]: _map(this.notLentTo, this.itemKey).join(',')
				},
			};
		}
	},
	methods: {
		measureBaseHeight() {
			const title = this.$refs.list.querySelector('h3');
			const titleHeight = numeral(window.getComputedStyle(title).getPropertyValue('height')).value();

			const item = this.$refs.list.querySelector('li');
			const itemHeight = numeral(window.getComputedStyle(item).getPropertyValue('height')).value();

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

<style lang="scss">
@import 'settings';

.stats-section {
	h2 {
		color: $kiva-green;
	}

	.lent-count {
		color: $white;
		background-color: $kiva-darkgreen;
		margin-left: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		font-weight: normal;
		vertical-align: middle;
	}

	.stats-list {
		overflow: hidden;
		margin-top: 1.5rem;

		h3 {
			padding-bottom: 0.5rem;

			@include breakpoint(medium down) {
				font-size: 1rem; // temporary font styling until we have canonical h3 styles
			}
		}
	}

	.completed {
		display: flex;
		align-items: center;
		color: $kiva-green;
		font-size: 1rem;

		@include breakpoint(large) {
			@include featured-text();
		}

		.icon {
			fill: $kiva-green;
			margin-right: 0.5rem;
			width: 2rem;
			height: 2rem;

			@include breakpoint(large) {
				width: 3rem;
				height: 3rem;
			}
		}
	}

	.button-area {
		width: 100%;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
	}

	.show-more-button {
		padding: 0.75rem;
		font-weight: $global-weight-normal;
		text-decoration: underline;

		&:hover {
			color: $kiva-textlink;
		}

		&:focus {
			outline: none;
		}
	}

	.lend-to-new-button {
		margin-top: 1rem;
	}
}
</style>
