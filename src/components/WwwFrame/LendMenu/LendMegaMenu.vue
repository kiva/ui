<template>
	<div class="lend-mega-menu">
		<div class="categories-section" :style="{ marginLeft: categoriesMargin }">
			<h2>Categories</h2>
			<ul :style="categoriesStyle" ref="categoryList">
				<li
					v-for="(category, index) in categories"
					:key="index"
					:class="{ 'last-category': category == categories[categories.length - 1] }"
				>
					<a
						:href="category.url"
						v-kv-track-event="['TopNav', 'click-Lend-Category', category.name, index + 1]">
						{{ category.name }}
					</a>
				</li>
				<li>
					<router-link
						to="/categories"
						v-kv-track-event="['TopNav','click-Lend-All_Categories']">
						All categories
					</router-link>
				</li>
				<li ref="allLoans">
					<router-link
						to="/lend"
						v-kv-track-event="['TopNav','click-Lend-All_Loans']">
						All loans
					</router-link>
				</li>
			</ul>
		</div>
		<kv-expandable property="width">
			<div class="close-section" v-show="sectionOpen">
				<button @click="closeSection">
					<kv-icon class="close-icon" name="medium-chevron" />
				</button>
			</div>
		</kv-expandable>
		<div class="middle-section">
			<h2>Regions</h2>
			<ul>
				<li v-for="region in regions" :key="region.name">
					<button
						@click="openSection(region.name)"
						:aria-pressed="isOpenSection(region.name) ? 'true' : 'false'"
					>
						{{ region.name }}
					</button>
				</li>
			</ul>
			<h2 v-if="userId" class="my-kiva-title">My Kiva</h2>
			<ul v-if="userId">
				<li>
					<router-link
						v-if="favorites > 0"
						:to="{ path: '/lend', query: { lenderFavorite: userId } }"
						v-kv-track-event="['TopNav','click-Lend-Favorites']">
						Starred loans
					</router-link>
					<span v-else>Starred loans</span>
				</li>
				<li>
					<button
						v-if="hasSearches"
						@click="openSection(savedSearchesTitle)"
						:aria-pressed="isOpenSection(savedSearchesTitle) ? 'true' : 'false'"
					>
						{{ savedSearchesTitle }}
					</button>
					<span v-else>Saved searches</span>
				</li>
				<li>
					<router-link
						to="/lend/countries-not-lent"
						v-kv-track-event="['TopNav','click-Lend-Countries_Not_Lent']">
						Countries I haven't lent to
					</router-link>
				</li>
			</ul>
		</div>
		<kv-expandable property="width" :skip-leave="true">
			<div
				v-for="region in regions"
				:key="region.name"
				v-if="isOpenSection(region.name)"
				class="right-section"
			>
				<h2>{{ region.name }}</h2>
				<country-list :countries="region.countries" />
			</div>
			<div v-if="isOpenSection(savedSearchesTitle)" class="right-section">
				<h2>{{ savedSearchesTitle }}</h2>
				<search-list :searches="searches" />
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import numeral from 'numeral';
import KvExpandable from '@/components/Kv/KvExpandable';
import KvIcon from '@/components/Kv/KvIcon';
import CountryList from './CountryList';
import SearchList from './SearchList';

export default {
	components: {
		CountryList,
		KvExpandable,
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
	data() {
		return {
			categoriesWidth: null,
			openedSection: '',
			savedSearchesTitle: 'Saved searches',
		};
	},
	computed: {
		categoriesStyle() {
			return {
				height: `${Math.ceil((this.categories.length + 3) / 2) * 1.5}rem`,
				width: this.categoriesWidth,
			};
		},
		categoriesMargin() {
			return this.categoriesWidth && this.sectionOpen ? `-${this.categoriesWidth}` : '1rem';
		},
		hasSearches() {
			return this.searches.length > 0;
		},
		sectionOpen() {
			return this.openedSection !== '';
		}
	},
	watch: {
		categories() {
			this.checkCategoryWidth();
		}
	},
	methods: {
		// js workaround for flex column wrap bug (https://github.com/philipwalton/flexbugs#flexbug-14)
		// We expect the categories section to be 2 columns wide. This will force the section to be
		// that wide if it isn't, due to the flexbox bug mentioned above.
		checkCategoryWidth() {
			this.categoriesWidth = null;
			this.$nextTick(() => {
				const listStyle = window.getComputedStyle(this.$refs.categoryList);
				const listWidth = Math.ceil(numeral(listStyle.getPropertyValue('width')).value());
				const columnStyle = window.getComputedStyle(this.$refs.allLoans);
				const columnWidth = Math.ceil(numeral(columnStyle.getPropertyValue('width')).value());
				if (listWidth <= columnWidth) {
					this.categoriesWidth = `${columnWidth * 2}px`;
				} else {
					this.categoriesWidth = `${listWidth}px`;
				}
			});
		},
		onOpen() {
			this.checkCategoryWidth();
		},
		onClose() {
			this.closeSection();
		},
		isOpenSection(section) {
			return this.openedSection === section;
		},
		openSection(section) {
			if (this.isOpenSection(section)) {
				this.closeSection();
			} else {
				this.openedSection = section;
			}
		},
		closeSection() {
			this.openedSection = '';
		},
	},
	mounted() {
		this.checkCategoryWidth();
	},
};
</script>

<style lang="scss">
@import 'settings';

.lend-mega-menu {
	$section-header-font-size: rem-calc(21);
	$section-padding: 1.5rem;

	display: flex;
	padding: 1rem 0;
	white-space: nowrap;
	overflow: hidden;

	h2 {
		font-size: $section-header-font-size;
		font-weight: normal;
	}

	li {
		font-size: $small-text-font-size;
		line-height: 1.5rem;
	}

	button:focus {
		outline: none;
	}

	& > * + * {
		border-left: solid 1px $kiva-stroke-gray;
	}

	.categories-section {
		overflow: hidden;
		transition: margin 500ms ease;

		ul {
			display: flex;
			flex-flow: column wrap;
			justify-content: space-between;
		}

		li {
			padding-right: 1rem;
		}

		.last-category {
			flex-grow: 1;
		}
	}

	.close-section {
		border-left: none;

		button {
			padding: 0 1rem;
		}

		.close-icon {
			width: 3.25rem;
			height: 6rem;
			transform: rotate(90deg);
		}
	}

	.middle-section h2,
	.middle-section button,
	.middle-section a,
	.middle-section span,
	.right-section h2,
	.right-section a,
	.right-section span {
		padding: 0 $section-padding;
	}

	.middle-section {
		button {
			color: $kiva-textlink;
			padding: 0 $section-padding;
			width: 100%;
			line-height: inherit;
			text-align: left;

			&:hover {
				color: $kiva-textlink-hover;
				text-decoration: underline;
			}

			&[aria-pressed="true"] {
				color: $kiva-text-light;
				text-decoration: none;
				background-color: $kiva-bg-darkgray;
			}
		}

		span {
			color: $kiva-text-light;
		}

		.my-kiva-title {
			margin-top: 1.5rem;
		}
	}

	.right-section span {
		color: $kiva-text-light;
	}
}
</style>
