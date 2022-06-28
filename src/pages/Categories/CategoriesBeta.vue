<template>
	<www-page>
		<kv-page-container>
			<kv-grid class="tw-pt-4 md:tw-pt-6 lg:tw-pt-8">
				<h1 class="tw-mb-2">
					Make a loan, change a life
				</h1>
				<p class="tw-mb-4 tw-text-subhead tw-text-secondary">
					Each Kiva loan helps people build a better
					future for themselves and their families.
				</p>
			</kv-grid>
			<kv-grid class="md:tw-pt-6 lg:tw-pt-8">
				<h2>
					Find loans by category
				</h2>
			</kv-grid>
			<kv-grid v-if="categories.length > 0" class="tw-grid-cols-12 tw-pt-3 md:tw-pt-4 lg:tw-pt-6">
				<div v-for="category in categories.slice(0, 4)" :key="category.id"
					class="tw-col-span-12 md:tw-col-span-6"
				>
					<main-category-tile
						tile-size="large"
						:category-url="category.url"
						:category-name="category.name"
						:category-description="category.description"
						:image="getImage(category)"
						:retina-image="getRetinaImage(category)"
						:number-loans="category.loans.totalCount"
					/>
				</div>
			</kv-grid>
			<kv-grid v-if="categories.length > 0" class="tw-grid-cols-12">
				<div v-for="category in categories.slice(4, 7)" :key="category.id"
					class="tw-col-span-12 md:tw-col-span-4"
				>
					<main-category-tile
						tile-size="medium"
						:category-url="category.url"
						:category-name="category.name"
						:category-description="category.description"
						:image="getImage(category)"
						:retina-image="getRetinaImage(category)"
						:number-loans="category.loans.totalCount"
					/>
				</div>
			</kv-grid>
			<kv-grid v-if="categories.length > 0" class="tw-grid-cols-12">
				<div v-for="category in categories.slice(7, 13)" :key="category.id"
					class="tw-col-span-12 md:tw-col-span-6"
				>
					<main-category-tile
						tile-size="small"
						:category-url="category.url"
						:category-name="category.name"
						:category-description="category.description"
						:image="getImage(category)"
						:retina-image="getRetinaImage(category)"
						:number-loans="category.loans.totalCount"
					/>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import MainCategoryTile from '@/components/Categories/MainCategoryTile';
import gql from 'graphql-tag';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const allCategoriesQuery = gql`
	query allCategoriesQuery {
		lend {
			loanChannels (limit: 18, popular: true, applyMinLoanCount: true) {
				values {
					id
					url
					name
					description
					image {
						id
						url (customSize: "w520h301")
					}
					retinaImage {
						id
						url (customSize: "w1040h602")
					}
					loans {
        				totalCount
        			}
				}
			}
		}
	}
`;

export default {
	name: 'CategoriesBeta',
	components: {
		WwwPage,
		MainCategoryTile,
		KvGrid,
		KvPageContainer
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			categoryPlaceholderImageCTF: '',
			categories: [],
		};
	},
	apollo: {
		query: allCategoriesQuery,
		preFetch: true,
		result(result) {
			this.categories = result.data?.lend?.loanChannels?.values ?? [];
		},
	},
	methods: {
		getImage(category) {
			return category.image?.url ?? this.categoryPlaceholderImageCTF;
		},
		getRetinaImage(category) {
			return category.retinaImage?.url ?? '';
		}
	},
	mounted() {
		this.apollo.query({
			query: gql`
				query bpHeroBackgroundImage($placeholderKey: String) {
					contentful {
						placeholder: entries(contentType: "background", contentKey: $placeholderKey)
					}
				}
			`,
			variables: {
				placeholderKey: 'bp-hero-country-placeholder',
			},
		}).then(result => {
			const placeholderMedia = result?.data?.contentful?.placeholder?.items?.[0]?.fields?.backgroundMedia ?? {};
			this.categoryPlaceholderImageCTF = placeholderMedia?.fields?.file?.url ?? '';
		});
	},
};

</script>
