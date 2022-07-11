<template>
	<div>
		<h2 class="md:tw-hidden tw-pb-2">
			Today's loan spotlight
		</h2>
		<div class="md:tw-flex md:tw-pt-8 md:tw-pb-8">
			<kv-loading-placeholder
				v-if="isLoading"
				class="tw-mb-1 tw-rounded md:tw-mr-3 lg:tw-mr-4
				md:tw-flex-none tw-w-full md:tw-w-1/2" :style="{height: '15.75rem'}"
			/>
			<div v-if="!isLoading" class="md:tw-mr-3 lg:tw-mr-4 md:tw-flex-none">
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
				<span v-if="!isLoading" class="tw-line-clamp-5">
					<p
						v-for="(paragraph, index) in getSpotlightText"
						:key="index"
						v-html="paragraph"
					>
					</p>
				</span>
				<div class="tw-mt-2">
					<kv-button
						class="tw-w-full md:tw-w-auto"
						:to="`/lend-beta/${getSpotlightLoanID}`"
						variant="primary"
						state=""
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
import gql from 'graphql-tag';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
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

function filterByAnonymizationLevel(spotlightData) {
	const firstFiveRecommendedLoans = spotlightData.lend?.loanChannelsById[0]?.loans?.values ?? [];
	const nonAnonymousLoans = firstFiveRecommendedLoans.filter(
		loan => loan.anonymizationLevel !== 'full'
	);
	return nonAnonymousLoans[0] || {};
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
			return "Today's loan spotlight";
		},
		getSpotlightLoanID() {
			return this.spotlightLoan.id ?? '';
		},
		getSpotlightText() {
			return toParagraphs(this.spotlightLoan.description) ?? '';
		},
		locationExists() {
			return this.spotlightLoan.geocode ?? '';
		},
		getSpotlightLoanLocation() {
			if (this.locationExists !== '') {
				if (this.spotlightLoan.geocode.city && this.spotlightLoan.geocode.country.name) {
					return `${this.spotlightLoan.geocode.city}, ${this.spotlightLoan.geocode.country.name}`;
				}
				return `${this.spotlightLoan.geocode.country.name ?? ''}`;
			}
			return '';
		},
		imageExists() {
			return this.spotlightLoan.image?.default ?? '';
		},
		getSpotlightImage() {
			if (this.imageExists === '') {
				return [['small', this.spotlightPlaceholderImageCTF]];
			}
			return [['small', this.spotlightLoan.image.retina], ['small retina', this.spotlightLoan.image.retina]];
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
			this.spotlightLoan = filterByAnonymizationLevel(result.data);
		});
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
			this.spotlightPlaceholderImageCTF = placeholderMedia?.fields?.file?.url ?? '';
		});
	},
};

</script>

<style lang="postcss" scoped>

/*  ** Reasoning for current dimensions **
The max heights 280, md/lg:390 and the max width lg:520 are Nathan's original dimensions.
The max width 390 at medium prevents the wrapping of the title "Today's loan spotlight".
The min width at md/lg is for the few images that area extremely skinny.
The min height for md/lg is there so that the text and the button are within the height of the image.
The mobile image now matches the way it's done on the individual loan page. The images
are so varied in sizing, so it looks way better if they are just contained on mobile. */
.spotlight-loan-image >>> img {
	@apply tw-rounded tw-object-contain tw-bg-black md:tw-object-cover md:tw-object-top;
	@apply tw-w-full tw-max-h-[280px] md:tw-max-h-[390px];
	@apply md:tw-max-w-[390px] lg:tw-max-w-[520px];
	@apply md:tw-min-w-[320px] md:tw-min-h-[320px];
}

</style>
