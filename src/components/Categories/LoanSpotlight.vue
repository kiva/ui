<template>
	<div data-testid="all-categories-loan-spotlight">
		<h2 class="tw-text-headline md:tw-hidden tw-pb-2">
			Today's loan spotlight
		</h2>
		<div class="md:tw-flex md:tw-pt-8 md:tw-pb-8">
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-1 tw-rounded md:tw-mr-3 lg:tw-mr-4
				md:tw-flex-none tw-w-full md:tw-w-1/2" :style="{height: '15.75rem'}"
			/>
			<div v-if="!isLoading" class="md:tw-mr-3 lg:tw-mr-4 md:tw-min-w-[40%]">
				<kv-responsive-image
					class="spotlight-loan-image"
					:images="getSpotlightImage"
					loading="lazy"
					:alt="altText"
				/>
			</div>
			<div class="md:tw-grow">
				<h2 class="tw-text-headline tw-hidden md:tw-block tw-pt-1">
					Today's loan spotlight
				</h2>
				<h3 class="tw-text-title tw-pt-2 tw-mb-1">
					{{ getSpotlightLoanLocation }}
				</h3>
				<kv-loading-paragraph
					v-if="isLoading"
					class="tw-mb-1.5 tw-flex-grow" :style="{width: '100%', height: '5.5rem'}"
				/>
				<p v-if="!isLoading" class="tw-line-clamp-5">
					{{ getSpotlightText }}
				</p>
				<div v-if="!isLoading" class="tw-mt-2">
					<kv-button
						class="tw-w-full md:tw-w-auto"
						:to="`/lend/${getSpotlightLoanID}`"
						variant="primary"
						v-kv-track-event="['Lending', 'click-loan-spotlight', 'View Loan']"
					>
						View loan
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import { toParagraphs } from '#src/util/loanUtils';
import { gql } from 'graphql-tag';
import KvResponsiveImage from '#src/components/Kv/KvResponsiveImage';
import KvLoadingParagraph from '#src/components/Kv/KvLoadingParagraph';
import { KvLoadingPlaceholder, KvButton } from '@kiva/kv-components';

const allCategoriesQuery = gql`
	query allCategoriesQuery {
		browsingCategories(limit: 1000) {
			values {
				id
				url
				name
				... on LoanCategorySearchOutput {
					savedSearch {
						id
						loans {
							totalCount
						}
					}
				}
			}
		}
	}
`;

const spotlightLoanQuery = gql`
	query spotlightLoanQuery (
		$ids: [String!]!,
		$limit: Int = 5,
		$pageNumber: Int = 0,
		$imgDefaultSize: String = "w520h390",
		$imgRetinaSize: String = "w1040h780",
	) {
		categoriesByIds (ids: $ids) {
			id
			... on LoanCategorySearchOutput {
				savedSearch (
					limit: $limit
					pageNumber: $pageNumber
				) {
					id
					loans {
						values {
							id
							description
							lenderRepaymentTerm
							anonymizationLevel
							geocode {
								city
								country {
									id
									name
								}
							}
							image {
								id
								default: url(customSize: $imgDefaultSize)
								retina: url(customSize: $imgRetinaSize)
							}
						}
					}
				}
			}
		}
	}
`;

function filterCategoriesForRoute(routePath, categories) {
	const filteredCategories = categories.filter(
		category => category.url.split('/').pop() === routePath
	);
	return filteredCategories;
}

function getTargetedCategory(targetedRoutePath, fallbackRoutePath, allCategories) {
	const targetedCategory = filterCategoriesForRoute(targetedRoutePath, allCategories);
	const fallbackCategory = filterCategoriesForRoute(fallbackRoutePath, allCategories);

	// no category that matches the targeted name
	if (targetedCategory.length === 0) {
		// return id for fallback category
		return fallbackCategory[0]?.id || null;
	}
	// targeted category exists but no loans exist within it
	if (targetedCategory.length !== 0 && targetedCategory[0].savedSearch?.loans?.totalCount === 0) {
		return fallbackCategory[0]?.id || null;
	}
	// isolate targeted category id
	return targetedCategory[0]?.id || null;
}

function filterByAnonymizationLevelAndImages(spotlightData) {
	const firstFiveRecommendedLoans = spotlightData.categoriesByIds?.[0]?.savedSearch?.loans?.values ?? [];
	const nonAnonymousLoansWithImages = firstFiveRecommendedLoans.filter(
		loan => loan.anonymizationLevel !== 'full' && loan.image?.default !== ''
	);
	return nonAnonymousLoansWithImages[0] || {};
}

export default {
	name: 'LoanSpotlight',
	props: {
		categorySlug: {
			type: String,
			default: ''
		},
		fallbackCategorySlug: {
			type: String,
			default: ''
		}
	},
	components: {
		KvButton,
		KvResponsiveImage,
		KvLoadingPlaceholder,
		KvLoadingParagraph
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			spotlightPlaceholderImageCTF: '',
			spotlightLoan: {},
			allCategoriesData: [],
			isLoading: true,
			targetedCategoryId: null
		};
	},
	computed: {
		altText() {
			return this.spotlightLoan?.description?.slice(0, 100) ?? '';
		},
		getSpotlightLoanID() {
			return this.spotlightLoan.id ?? '';
		},
		getSpotlightText() {
			/**
			 * process and escape html characters in toParagraphs function
			 * then join into single string so that we do not have multiple <p>
			 * tags and can use line-clamp class to clamp the entire text
			 */
			return toParagraphs(this.spotlightLoan.description).join(' ') ?? '';
		},
		getSpotlightLoanLocation() {
			if (this.spotlightLoan.geocode) {
				if (this.spotlightLoan.geocode?.city && this.spotlightLoan.geocode?.country?.name) {
					return `${this.spotlightLoan.geocode.city}, ${this.spotlightLoan.geocode.country.name}`;
				}
				return `${this.spotlightLoan.geocode?.country?.name ?? ''}`;
			}
			return '';
		},
		getSpotlightImage() {
			if (this.spotlightLoan.image?.retina) {
				return [['small', this.spotlightLoan.image.retina], ['small retina', this.spotlightLoan.image.retina]];
			}
			return [['small', this.spotlightLoan.image?.default ?? '']];
		}
	},
	apollo: {
		query: allCategoriesQuery,
		preFetch: true,
		result(result) {
			this.allCategoriesData = result.data?.browsingCategories?.values ?? [];
		},
	},
	created() {
		// eslint-disable-next-line max-len
		this.targetedCategoryId = getTargetedCategory(this.categorySlug, this.fallbackCategorySlug, this.allCategoriesData);

		// ids is a non-null list, so an unresolved category has to skip the query rather than send [null]
		if (!this.targetedCategoryId) {
			this.isLoading = false;
			return;
		}

		this.apollo.query({
			query: spotlightLoanQuery,
			variables: {
				ids: [this.targetedCategoryId],
			},
		}).then(result => {
			// filter out loans with anonymizationLevel of full, then take first in list
			this.isLoading = false;
			this.spotlightLoan = filterByAnonymizationLevelAndImages(result.data);
		});
	},
};

</script>

<style lang="postcss" scoped>

.spotlight-loan-image :deep(img) {
	@apply tw-rounded tw-object-contain tw-bg-black md:tw-object-cover md:tw-object-top;
	@apply tw-w-full tw-max-h-[280px] md:tw-max-h-[450px];
	@apply md:tw-min-h-[320px];
}

</style>
