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
import { processPageContent } from '@/util/contentfulUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import MainCategoryTile from '@/components/Categories/MainCategoryTile';
import LoanSpotlight from '@/components/Categories/LoanSpotlight';
import MonthlyGoodModule from '@/components/Categories/MonthlyGoodModule';
import FrequentlyAskedQuestions from '@/components/Contentful/FrequentlyAskedQuestions';
import { gql } from '@apollo/client';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experiment/experimentUtils';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const CATEGORIES_REDIRECT_EXP_KEY = 'categories_redirect';

const categoriesExperimentsQuery = gql`
	query experimentsQuery {
		general {
			categoriesRedirect: uiExperimentSetting(key: "categories_redirect") {
				key
				value
			}
		}
	}
`;

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
	metaInfo() {
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
		preFetch(config, client) {
			return client.query({
				query: categoriesExperimentsQuery
			}).then(() => {
				// Get the array of channel objects from settings
				return Promise.all([
					// experiment: CORE-1057 A/B test - redirect / hide kiva.org/categories
					client.query({ query: experimentQuery, variables: { id: CATEGORIES_REDIRECT_EXP_KEY } }),
				]);
			}).then(expAssignments => {
				const experimentSettings = expAssignments.filter(item => item?.data?.experiment);
				// Initialize CORE-1057 A/B test - redirect / hide kiva.org/categories
				const CategoriesRedirectExp = experimentSettings
					.find(item => item.data.experiment.id === CATEGORIES_REDIRECT_EXP_KEY);
				const enableCategoriesRedirect = CategoriesRedirectExp?.data?.experiment?.version === 'b' ?? false;
				if (enableCategoriesRedirect) {
					return Promise.reject({
						path: '/lend-by-category',
					});
				}
				Promise.resolve();
			}).then(() => {
				return client.query({
					query: allCategoriesPageQuery
				});
			});
		},
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

		// Tracking for EXP-CORE-1057-Feb-2023
		const { enabled } = getExperimentSettingCached(this.apollo, CATEGORIES_REDIRECT_EXP_KEY);
		if (enabled) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				CATEGORIES_REDIRECT_EXP_KEY,
				'EXP-CORE-1057-Feb2023'
			);
		}
	},
};

</script>
