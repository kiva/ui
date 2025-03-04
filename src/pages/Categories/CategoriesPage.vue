<template>
	<www-page>
		<kv-page-container>
			<kv-grid class="tw-pt-4 md:tw-pt-6 lg:tw-pt-8 tw-mb-4">
				<h1 class="tw-mb-2">
					Make a loan, change a life
				</h1>
				<p class="tw-mb-4 tw-text-subhead tw-text-secondary">
					Each Kiva loan helps people build a better
					future for themselves and their families.
				</p>
			</kv-grid>
		</kv-page-container>
		<div class="tw-bg-primary md:tw-bg-secondary tw-mb-2">
			<kv-page-container>
				<kv-grid>
					<loan-spotlight
						category-slug="recommended-by-lenders"
						fallback-category-slug="women"
					/>
				</kv-grid>
			</kv-page-container>
		</div>
		<kv-page-container>
			<kv-grid class="tw-pt-6">
				<h2>
					Find loans by category
				</h2>
			</kv-grid>
			<kv-grid v-if="categories.length > 0" class="tw-grid-cols-12 tw-pt-3 md:tw-pt-4 lg:tw-pt-6">
				<div
					v-for="category in categories.slice(0, 4)" :key="category.id"
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
				<div
					v-for="category in categories.slice(4, 7)" :key="category.id"
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
			<kv-grid class="tw-bg-secondary tw-mb-5 tw-rounded">
				<div class="tw-flex tw-items-center tw-justify-center tw-pt-6 tw-pb-6">
					<kv-button
						to="/lend"
						variant="secondary"
						v-kv-track-event="['Lending', 'click-view-all', 'View All']"
					>
						View all loans
					</kv-button>
				</div>
			</kv-grid>
			<kv-grid v-if="categories.length > 0" class="tw-grid-cols-12">
				<div
					v-for="category in categories.slice(7, 13)" :key="category.id"
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
		<monthly-good-module />
		<frequently-asked-questions
			:content="faqContentGroup"
		/>
	</www-page>
</template>

<script>
import { processPageContent } from '#src/util/contentfulUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MainCategoryTile from '#src/components/Categories/MainCategoryTile';
import LoanSpotlight from '#src/components/Categories/LoanSpotlight';
import MonthlyGoodModule from '#src/components/Categories/MonthlyGoodModule';
import FrequentlyAskedQuestions from '#src/components/Contentful/FrequentlyAskedQuestions';
import { gql } from 'graphql-tag';
import { KvGrid, KvPageContainer, KvButton } from '@kiva/kv-components';

const allCategoriesPageQuery = gql`
	query allCategoriesPageQuery {
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
		contentful {
			entries(contentType: "page", contentKey: "categories")
		}
	}
`;

export default {
	name: 'CategoriesPage',
	components: {
		WwwPage,
		MainCategoryTile,
		KvGrid,
		KvPageContainer,
		KvButton,
		LoanSpotlight,
		MonthlyGoodModule,
		FrequentlyAskedQuestions
	},
	head() {
		return {
			title: 'Choose a category and fund a loan',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Find and lend to the categories that you\'re passionate about, from women to refugees to '
                    + 'climate, and more. With as little as $25 you can support entrepreneurs around the world on Kiva.'
				}
			]
		};
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			categoryPlaceholderImageCTF: '',
			categories: [],
			pageData: {},
		};
	},
	apollo: {
		query: allCategoriesPageQuery,
		result(result) {
			this.categories = result.data?.lend?.loanChannels?.values ?? [];
			const pageEntry = result.data?.contentful?.entries?.items?.[0] ?? null;
			this.pageData = pageEntry ? processPageContent(pageEntry) : null;
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
	computed: {
		contentGroups() {
			return this.pageData?.page?.pageLayout?.contentGroups ?? [];
		},
		faqContentGroup() {
			return this.contentGroups?.find(({ type }) => {
				return type ? type === 'frequentlyAskedQuestions' : false;
			});
		},
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
