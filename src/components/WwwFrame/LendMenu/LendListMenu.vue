<template>
	<ul class="lend-list-menu">
		<expandable-list-item id="lend-menu-category-panel" ref="categories">
			<template slot="title">
				<span>Categories</span>
				<kv-icon name="small-chevron-mobile" />
			</template>
			<ul>
				<li v-for="(category, index) in categories" :key="index">
					<a
						:href="category.url"
						v-kv-track-event="['TopNav', 'click-Lend-Category', category.name, index + 1]">
						{{ category.name }}
					</a>
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
				<li>
					<router-link
						v-if="favorites > 0"
						:to="{ path: '/lend', query: { lenderFavorite: userId } }"
						v-kv-track-event="['TopNav','click-Lend-Favorites']">
						Starred loans
					</router-link>
					<span v-else>Starred loans</span>
				</li>
				<expandable-list-item id="lend-menu-saved-searches-panel" ref="searches" v-if="hasSearches">
					<template slot="title">
						<span>Saved searches</span>
						<kv-icon name="small-chevron-mobile" />
					</template>
					<search-list :searches="searches" />
				</expandable-list-item>
				<li v-else>
					<span>Saved searches</span>
				</li>
				<li>
					<router-link
						to="/lend/countries-not-lent"
						v-kv-track-event="['TopNav','click-Lend-Countries_Not_Lent']">
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
import SearchList from './SearchList';

export default {
	components: {
		CountryList,
		ExpandableListItem,
		KvIcon,
		SearchList,
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
			if (this.categories.length) {
				this.$refs.categories.collapse();
			}
			if (this.regions.length) {
				this.$refs.regions.collapse();
				this.$refs.regionCountries.forEach(region => region.collapse());
			}
			if (this.userId) {
				this.$refs.myKiva.collapse();
			}
			if (this.hasSearches) {
				this.$refs.searches.collapse();
			}
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.lend-list-menu {
	margin: 0;

	button {
		text-align: left;
		line-height: inherit;
		color: $kiva-text-dark;

		.icon {
			float: right;
			height: 1.5rem;
			width: rem-calc(25);
			transition: transform 300ms ease;
		}
	}

	a {
		color: $kiva-text-dark;
		text-decoration: none;
	}

	li > span {
		color: $kiva-text-light;
	}

	ul {
		background-color: $kiva-bg-lightgray;

		button,
		a,
		li > span {
			padding-left: 2rem;
		}
	}

	ul ul {
		background-color: $kiva-bg-darkgray;

		button,
		a,
		li > span {
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
}
</style>
