<template>
	<div class="tw-bg-primary md:tw-bg-secondary">
		<kv-page-container>
			<kv-grid>
				<h2 class="md:tw-hidden">
					Today's loan spotlight
				</h2>
				<div class="md:tw-flex md:tw-pt-8 md:tw-pb-8">
					<div class="md:tw-mr-3 lg:tw-mr-4 md:tw-flex-none">
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
						<span class="tw-line-clamp-5">
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
								:to="`/lend-beta/${this.spotlightLoan.id}`"
								variant="primary"
								state=""
								v-kv-track-event="['Lending', 'click-loan-spotlight', 'View Loan']"
							>
								View loan
							</kv-button>
						</div>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script>

import { toParagraphs } from '@/util/loanUtils';
import gql from 'graphql-tag';
import logReadQueryError from '@/util/logReadQueryError';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const routePath = 'recommended-by-lenders';

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

function getTargetedChannel(targetedRoute, allChannels) {
	const loanChannels = allChannels.lend?.loanChannels?.values;
	const targetedLoanChannel = loanChannels.filter(
		loanChannel => loanChannel.url.split('/').pop() === targetedRoute
	);
	// no channel that matches the name recommended-by-lenders
	if (targetedLoanChannel.length === 0) {
		// return id for channel women
		return 5;
	}
	// recommended-by-lenders channel exists but no loans exist within it
	if (targetedLoanChannel.length !== 0 && targetedLoanChannel[0].loans.totalCount === 0) {
		return 5;
	}
	// isolate recommended-by-lenders channel id
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
	components: {
		KvGrid,
		KvButton,
		KvPageContainer,
		KvResponsiveImage
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			spotlightPlaceholderImageCTF: '',
			spotlightLoan: {},
			targetedLoanChannelID: null
		};
	},
	computed: {
		altText() {
			return "Today's loan spotlight";
		},
		getSpotlightText() {
			return toParagraphs(this.spotlightLoan.description);
		},
		getSpotlightLoanLocation() {
			if (this.spotlightLoan.geocode.city && this.spotlightLoan.geocode.country.name) {
				return `${this.spotlightLoan.geocode.city}, ${this.spotlightLoan.geocode.country.name}`;
			}
			return `${this.spotlightLoan.geocode?.country?.name ?? ''}`;
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
		preFetch(config, client) {
			return client.query({
				query: allChannelsQuery
			}).then(({ data }) => {
				const targetedLoanChannelURL = routePath;
				const targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, data);
				return client.query({
					query: spotlightLoanQuery,
					variables: {
						ids: [targetedLoanChannelID],
					},
				});
			});
		},
	},
	created() {
		let allChannelsData = {};
		try {
			allChannelsData = this.apollo.readQuery({
				query: allChannelsQuery,
			});
		} catch (e) {
			logReadQueryError(e);
		}

		const targetedLoanChannelURL = routePath;
		// isolate recommended-by-lenders channel id
		this.targetedLoanChannelID = getTargetedChannel(targetedLoanChannelURL, allChannelsData);

		// Read the spotlight data from the cache
		let spotlightData = {};
		try {
			spotlightData = this.apollo.readQuery({
				query: spotlightLoanQuery,
				variables: {
					ids: [this.targetedLoanChannelID],
				},
			});
		} catch (e) {
			logReadQueryError(e);
		}
		// filter out loans with anonymizationLevel of full, then take first in list
		this.spotlightLoan = filterByAnonymizationLevel(spotlightData);
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

.spotlight-loan-image >>> img {
	@apply tw-object-cover tw-object-top tw-rounded;
	@apply tw-w-full tw-h-full md:tw-w-[390px] md:tw-h-[320px] lg:tw-w-[520px] lg:tw-h-[390px];
}

</style>
