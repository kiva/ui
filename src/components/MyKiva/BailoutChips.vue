<template>
	<div class="tw-flex tw-flex-col tw-gap-4">
		<div>
			<h3 class="tw-mb-1.5">
				Featured
			</h3>
			<PillsContainer
				key="featured"
				:items="featuredItems"
				@pill-clicked="handlePillClick"
			/>
		</div>
		<div v-if="categories.length">
			<h3 class="tw-mb-1.5">
				Find borrowers by category
			</h3>
			<PillsContainer
				key="categories"
				:items="categories"
				@pill-clicked="handlePillClick"
			/>
		</div>
		<div v-if="regionItems.length">
			<h3 class="tw-mb-1.5">
				Find borrowers by location
			</h3>
			<PillsContainer
				key="regions"
				:items="regionItems"
				@pill-clicked="handlePillClick"
			/>
		</div>
	</div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import logFormatter from '#src/util/logFormatter';
import { indexIn } from '#src/util/comparators';
import publicLendMenuQuery from '#src/graphql/query/lendMenuData.graphql';
import countryListQuery from '#src/graphql/query/countryList.graphql';
import PillsContainer from './PillsContainer';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');

const CATEGORY_PAGE = 'lend-by-category';
const FILTER_PAGE = 'lend/filter';

const categories = ref([]);
const regionItems = ref([]);

const featuredItems = [
	{ label: 'Women', url: `/${CATEGORY_PAGE}/women` },
	{ label: 'Kenya', url: `/${CATEGORY_PAGE}/kenya` },
	{ label: 'Almost Funded', url: `/${CATEGORY_PAGE}/loans-that-are-almost-funded` },
	{ label: 'Philippines', url: `/${CATEGORY_PAGE}/philippines` },
	{ label: 'Agriculture', url: `/${CATEGORY_PAGE}/agriculture` },
];

const regionDisplayOrder = [
	'North America',
	'Central America',
	'South America',
	'Africa',
	'Eastern Europe',
	'Middle East',
	'Asia',
	'Oceania'
];

const handlePillClick = item => {
	const itemLabel = item.label?.toLowerCase()?.replace(' ', '-');
	$kvTrackEvent('portfolio', 'click', `bailout-${itemLabel}`);
	window.location.href = item.url;
};

const fetchCategories = () => {
	apollo.query({
		query: publicLendMenuQuery,
	}).then(({ data }) => {
		const categoriesData = data.lend?.loanChannels?.values ?? [];
		categories.value = categoriesData.map(category => {
			const updatedCat = JSON.parse(JSON.stringify(category));
			updatedCat.label = updatedCat.name;
			updatedCat.url = updatedCat.url
				.replace('lend', `${CATEGORY_PAGE}`);
			return updatedCat;
		});
		categories.value = categories.value.sort((a, b) => a.name.localeCompare(b.name));
	}).catch(error => {
		logFormatter(error, 'MyKiva LendMenuQuery');
	});
};

const fetchCountries = () => {
	apollo.query({
		query: countryListQuery,
	}).then(({ data }) => {
		const countryFacets = data.lend?.countryFacets ?? [];
		const facets = countryFacets.map(facet => {
			return {
				region: facet.country.region,
				isoCode: facet.country.isoCode,
				count: facet.count || 0,
			};
		});
		const facetsByRegion = Object.entries(Object.groupBy(facets, ({ region }) => region));
		const regions = facetsByRegion.map(([region, rFacets]) => {
			return {
				name: region,
				countries: rFacets
					.filter(facet => facet.count > 0)
					.map(facet => {
						return {
							isoCode: facet.isoCode,
						};
					})
			};
		}).sort(indexIn(regionDisplayOrder, 'name'));

		regionItems.value = regions.map(region => {
			return {
				label: region.name,
				url: `/${FILTER_PAGE}?country=${region.countries.map(country => country.isoCode).join(',')}`
			};
		});
	}).catch(error => {
		logFormatter(error, 'MyKiva CountryListQuery');
	});
};

onMounted(() => {
	fetchCategories();
	fetchCountries();
});
</script>
