<template>
	<ul class="lend-list-menu">
		<expandable-list-item id="lend-menu-category-panel" ref="categories">
			<template slot="title">
				<span>Categories</span>
				<kv-icon name="small-chevron-mobile" />
			</template>
			<ul>
				<li v-for="category in categories" :key="category.index">
					<a :href="category.url">{{ category.name }}</a>
				</li>
			</ul>
		</expandable-list-item>
		<expandable-list-item id="lend-menu-region-panel" ref="regions">
			<template slot="title">
				<span>Regions</span>
				<kv-icon name="small-chevron-mobile" />
			</template>
			<ul>
				<expandable-list-item
					v-for="region in regions"
					:key="region.name"
					:id="`lend-menu-${region.name}-panel` | kebabCase"
					ref="regionCountries"
				>
					<template slot="title">
						<span>{{ region.name }}</span>
						<kv-icon name="small-chevron-mobile" />
					</template>
					<country-list :countries="region.countries" />
				</expandable-list-item>
			</ul>
		</expandable-list-item>
		<router-link to="/lend">All loans</router-link>
		<expandable-list-item id="lend-menu-my-kiva-panel" ref="myKiva" v-if="userId">
			<template slot="title">
				<span>My Kiva</span>
				<kv-icon name="small-chevron-mobile" />
			</template>
			<ul>
				<li v-show="favorites > 0">
					<router-link :to="{ path: 'lend', query: { lenderFavorite: userId } }">
						Starred loans
					</router-link>
				</li>
				<expandable-list-item id="lend-menu-saved-searches-panel" ref="searches" v-show="hasSearches">
					<template slot="title">
						<span>Saved searches</span>
						<kv-icon name="small-chevron-mobile" />
					</template>
					<ul>
						<li v-for="search in searches" :key="search.id">
							<a :href="search.url">{{ search.name }}</a>
						</li>
						<li>
							<router-link to="/lend/saved-search">Manage saved searches</router-link>
						</li>
					</ul>
				</expandable-list-item>
				<li>
					<router-link to="/lend/countries-not-lent">
						Countries I haven't lent to
					</router-link>
				</li>
			</ul>
		</expandable-list-item>
	</ul>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import CountryList from './CountryList';
import ExpandableListItem from './ExpandableListItem';

export default {
	components: {
		CountryList,
		ExpandableListItem,
		KvIcon,
	},
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
		favorites: {
			type: Number,
			default: 0,
		},
		userId: {
			type: Number,
			default: null,
		},
		regions: {
			type: Array,
			default: () => [],
		},
		searches: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		hasSearches() {
			return this.searches.length > 0;
		},
	},
	methods: {
		onClose() {
			this.$refs.categories.collapse();
			this.$refs.regions.collapse();
			this.$refs.regionCountries.forEach(region => region.collapse());
			this.$refs.myKiva.collapse();
			this.$refs.searches.collapse();
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.lend-list-menu {
	margin: 0;
	font-size: 1rem;

	button,
	a {
		display: block;
		width: 100%;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid $kiva-stroke-gray;
	}

	button {
		text-align: left;
		line-height: inherit;

		.icon {
			float: right;
			height: 1.5rem;
			width: rem-calc(25);
			transition: transform 300ms ease;
		}
	}

	ul {
		margin: 0;
		background-color: $kiva-bg-lightgray;

		button,
		a {
			padding-left: 2rem;
		}
	}

	ul ul {
		background-color: $kiva-bg-darkgray;

		button,
		a {
			padding-left: 3rem;
			border-bottom: none;
		}
	}

	button:focus {
		outline: none;
	}

	button[aria-expanded="true"] {
		span {
			color: $kiva-text-light;
		}

		.icon {
			transform: rotate(-180deg);
		}
	}

	li {
		list-style: none;
	}
}
</style>
