<template>
	<div data-testid="all-categories-loan-spotlight">
		<h2 class="md:tw-hidden tw-pb-2">
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
				<h2 class="tw-hidden md:tw-block tw-pt-1">
					Today's loan spotlight
				</h2>
				<h3 class="tw-pt-2 tw-mb-1">
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

import { toParagraphs } from '@/util/loanUtils';
import { gql } from '@apollo/client';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const allChannelsQuery = gql`
	query allChannelsQuery {
		lend {
			loanChannels(offset:0, limit:1000) {
				values {
					id
					url
					name
					loans {
						totalCount
					}
				}
			}
		}
	}
`;

const spotlightLoanQuery = gql`
	query spotlightLoanQuery (
		$ids: [Int],
		$limit: Int = 5,
		$offset: Int = 0,
		$imgDefaultSize: String = "w520h390",
		$imgRetinaSize: String = "w1040h780",
	) {
		lend {
			loanChannelsById (ids: $ids) {
				id
				loans (
					limit: $limit
					offset: $offset
				) {
					values {
						id
						description
						lenderRepaymentTerm
						anonymizationLevel
						geocode {
							city
							country {
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
`;

function filterChannelsForRoute(routePath, loanChannels) {
	const filteredChannels = loanChannels.filter(
		loanChannel => loanChannel.url.split('/').pop() === routePath
	);
	return filteredChannels;
}

function getTargetedChannel(targetedRoutePath, fallbackRoutePath, allChannels) {
	const targetedLoanChannel = filterChannelsForRoute(targetedRoutePath, allChannels);
	const fallbackLoanChannel = filterChannelsForRoute(fallbackRoutePath, allChannels);

	// no channel that matches the targeted name
	if (targetedLoanChannel.length === 0) {
		// return id for fallback channel
		return fallbackLoanChannel[0]?.id || null;
	}
	// targeted channel exists but no loans exist within it
	if (targetedLoanChannel.length !== 0 && targetedLoanChannel[0].loans.totalCount === 0) {
		return fallbackLoanChannel[0]?.id || null;
	}
	// isolate targeted channel id
	return targetedLoanChannel[0]?.id || null;
}

function filterByAnonymizationLevelAndImages(spotlightData) {
	const firstFiveRecommendedLoans = spotlightData.lend?.loanChannelsById[0]?.loans?.values ?? [];
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
			allChannelsData: {},
			isLoading: true,
			targetedLoanChannelID: null
		};
	},
	computed: {
		altText() {
			return this.spotlightLoan?.description.slice(0, 100) ?? '';
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
		query: allChannelsQuery,
		preFetch: true,
		result(result) {
			this.allChannelsData = result.data?.lend?.loanChannels?.values ?? [];
		},
	},
	created() {
		// eslint-disable-next-line max-len
		this.targetedLoanChannelID = getTargetedChannel(this.categorySlug, this.fallbackCategorySlug, this.allChannelsData);

		this.apollo.query({
			query: spotlightLoanQuery,
			variables: {
				ids: [this.targetedLoanChannelID],
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

.spotlight-loan-image >>> img {
	@apply tw-rounded tw-object-contain tw-bg-black md:tw-object-cover md:tw-object-top;
	@apply tw-w-full tw-max-h-[280px] md:tw-max-h-[450px];
	@apply md:tw-min-h-[320px];
}

</style>
