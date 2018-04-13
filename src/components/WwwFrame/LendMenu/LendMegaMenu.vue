<template>
	<div class="lend-mega-menu">
		<div class="categories-section" v-show="!sectionOpen">
			<h2>Categories</h2>
			<ul :style="categoriesStyle" ref="categoryList">
				<li
					v-for="category in categories"
					:key="category.index"
					:class="{ 'last-category': category == categories[categories.length - 1] }"
				>
					<a :href="category.url">{{ category.name }}</a>
				</li>
				<li><router-link to="/categories">All categories</router-link></li>
				<li><router-link to="/lend">All loans</router-link></li>
			</ul>
		</div>
		<div class="close-section" v-show="sectionOpen">
			<button @click="closeSection">
				<kv-icon class="close-icon" name="medium-chevron" />
			</button>
		</div>
		<div>
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
		</div>
		<div v-for="region in regions" :key="region.name" v-show="isOpenSection(region.name)">
			<h2>{{ region.name }}</h2>
			<country-list :countries="region.countries" />
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import KvIcon from '@/components/Kv/KvIcon';
import CountryList from './CountryList';

export default {
	components: {
		CountryList,
		KvIcon,
	},
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
		regions: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			categoriesWidth: null,
			openedSection: '',
		};
	},
	computed: {
		categoriesStyle() {
			return {
				height: `${Math.ceil((this.categories.length + 3) / 2) * 1.5}rem`,
				width: this.categoriesWidth,
			};
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
		checkCategoryWidth() {
			this.categoriesWidth = null;
			this.$nextTick(() => {
				const listStyle = window.getComputedStyle(this.$refs.categoryList);
				const columnWidth = Math.ceil(numeral(listStyle.getPropertyValue('width')).value());
				this.categoriesWidth = `${columnWidth * 2}px`;
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
};
</script>

<style lang="scss">
@import 'settings';

.lend-mega-menu {
	$section-header-font-size: rem-calc(21);

	display: flex;
	padding: 1rem 0;

	h2 {
		font-size: $section-header-font-size;
		font-weight: normal;
	}

	ul {
		margin: 0;
	}

	li {
		list-style: none;
		font-size: $small-text-font-size;
		line-height: 1.5rem;
	}

	& > * + * {
		border-left: solid 1px $kiva-stroke-gray;
	}

	.categories-section ul {
		display: flex;
		flex-flow: column wrap;
		justify-content: space-between;
		margin-left: 1rem;

		li {
			padding-right: 1rem;
		}

		.last-category {
			flex-grow: 1;
		}
	}

	.close-section {
		.close-icon {
			width: 3.25rem;
			height: 8rem;
			transform: rotate(90deg);
		}
	}
}
</style>
