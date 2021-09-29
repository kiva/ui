<template>
	<div :class=" {'lend-list-menu--mg-exp' : mgHighlightInNavVersion === 'shown' }">
		<template v-if="mgHighlightInNavVersion === 'shown'">
			<router-link
				to="/monthlygood"
				class="lend-list-menu--mg-exp__link"
				v-kv-track-event="['TopNav','click-mg-exp-mobile-cause', 'Find a cause']"
			>
				Find a cause
			</router-link>
			<router-link
				to="/lend-by-category"
				class="lend-list-menu--mg-exp__link"
				v-kv-track-event="['TopNav','click-mg-exp-mobile-borrower', 'Find a borrower']"
			>
				Find a borrower
			</router-link>
		</template>
		<ul class="lend-list-menu">
			<router-link to="/lend-by-category" v-if="mgHighlightInNavVersion !== 'shown'">
				Explore Categories
			</router-link>
			<expandable-list-item id="lend-menu-category-panel" ref="categories">
				<template #title>
					<span>Categories</span>
					<kv-icon class="chevron-icon" name="small-chevron-mobile" :from-sprite="true" />
				</template>
				<ul>
					<li v-if="isChannelsLoading">
						<kv-loading-spinner />
					</li>
					<li v-for="(category, index) in categories" :key="index">
						<a
							:href="category.url"
							v-kv-track-event="['TopNav', 'click-Lend-Category', category.name, index + 1]"
						>
							{{ category.name }}
						</a>
					</li>
				</ul>
			</expandable-list-item>
			<expandable-list-item id="lend-menu-region-panel" ref="regions">
				<template #title>
					<span>Regions</span>
					<kv-icon class="chevron-icon" name="small-chevron-mobile" :from-sprite="true" />
				</template>
				<ul>
					<li v-if="isRegionsLoading">
						<kv-loading-spinner />
					</li>
					<expandable-list-item
						v-for="region in regions"
						:key="region.name"
						:id="`lend-menu-${region.name}-panel` | changeCase('paramCase')"
						ref="regionCountries"
					>
						<template #title>
							<span v-kv-track-event="['TopNav','click-Lend-Region', region.name]">
								{{ region.name }}
							</span>
							<kv-icon class="chevron-icon" name="small-chevron-mobile" :from-sprite="true" />
						</template>
						<country-list :countries="region.countries" />
					</expandable-list-item>
				</ul>
			</expandable-list-item>
			<router-link to="/lend" class="lend-link">
				All loans
			</router-link>
			<expandable-list-item id="lend-menu-my-kiva-panel" ref="myKiva" v-if="userId">
				<template #title>
					<span>My Kiva</span>
					<kv-icon class="chevron-icon" name="small-chevron-mobile" :from-sprite="true" />
				</template>
				<ul>
					<li>
						<router-link
							v-if="favorites > 0"
							:to="{ path: '/lend', query: { lenderFavorite: userId } }"
							v-kv-track-event="['TopNav','click-Lend-Favorites']"
						>
							Starred loans
						</router-link>
						<span v-else>Starred loans</span>
					</li>
					<expandable-list-item id="lend-menu-saved-searches-panel" ref="searches" v-if="hasSearches">
						<template #title>
							<span>Saved searches</span>
							<kv-icon class="chevron-icon" name="small-chevron-mobile" :from-sprite="true" />
						</template>
						<search-list :searches="searches" />
					</expandable-list-item>
					<li v-else>
						<span>Saved searches</span>
					</li>
					<li>
						<router-link
							to="/lend/countries-not-lent"
							v-kv-track-event="['TopNav','click-Lend-Countries_Not_Lent']"
						>
							Countries I haven't lent to
						</router-link>
					</li>
				</ul>
			</expandable-list-item>
		</ul>
	</div>
</template>

<script>
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import CountryList from './CountryList';
import ExpandableListItem from './ExpandableListItem';
import SearchList from './SearchList';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		CountryList,
		ExpandableListItem,
		KvIcon,
		SearchList,
		KvLoadingSpinner
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
		isRegionsLoading: {
			type: Boolean,
			default: true,
		},
		isChannelsLoading: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			mgHighlightInNavVersion: null,
		};
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
	created() {
		// EXP SUBS-680 present main nav options for subscription or individual lending
		const mgHighlightInNav = this.apollo.readFragment({
			id: 'Experiment:mg_highlight_in_nav',
			fragment: experimentVersionFragment,
		}) || {};
		this.mgHighlightInNavVersion = mgHighlightInNav.version;
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

		.chevron-icon {
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

		.chevron-icon {
			transform: rotate(-180deg);
		}
	}
}

// TODO make this css more elegant
/* stylelint-disable no-descending-specificity */
.lend-list-menu--mg-exp {
	&__link {
		color: $kiva-accent-blue;
	}

	// Second level drop down items
	.lend-list-menu > .expandable-list-item > button > span,
	.lend-list-menu > .expandable-list-item > li > span {
		padding-left: 1rem;
	}

	// Second level link
	.lend-list-menu > a.lend-link {
		padding-left: 2rem;
	}

	// Third level items
	.kv-expandable-pane > ul > li {
		& a,
		& span {
			padding-left: 3rem;
		}

		// Fourth level items
		& .kv-expandable-pane > ul > li a,
		& .kv-expandable-pane > ul > li span {
			padding-left: 5rem;
		}
	}
}
</style>
