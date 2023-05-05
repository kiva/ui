<template>
	<section
		class="
		tw-pb-0
		md:tw-bg-primary
		md:tw-pb-2.5
		tw-py-2.5 md:tw-p-3 lg:tw-p-4
		md:tw-rounded-t lg:tw-rounded"
	>
		<div class="tw-flex">
			<div
				class="
				tw-flex-none tw-w-8 tw-h-8 tw-mr-1.5 tw-mb-1.5
				md:tw-w-9 md:tw-h-9 md:tw-mr-3 md:tw-mb-3
				lg:tw-w-10 lg:tw-h-10 lg:tw-mr-4 lg:tw-mb-4"
			>
				<borrower-image
					data-testid="bp-summary-image"
					class="tw-w-full tw-rounded-full tw-bg-brand"
					:alt="name"
					:aspect-ratio="1"
					:default-image="{ width: 80, faceZoom: 50 }"
					:hash="hash"
					:images="[
						{ width: 80, faceZoom: 50, viewSize: 1024 },
						{ width: 72, faceZoom: 50, viewSize: 734 },
						{ width: 64, faceZoom: 50 },
					]"
				/>
			</div>
			<div class="tw-flex-auto">
				<borrower-name
					data-testid="bp-summary-borrower-name"
					class="tw-mb-0.5 md:tw-mb-1.5 lg:tw-mb-2"
					:name="name"
				/>
				<template v-if="isLoading">
					<div class="tw-flex tw-flex-wrap tw-mb-3">
						<kv-loading-placeholder class="tw-mb-1" style="height: 0.5rem;" />
						<kv-loading-placeholder style="height: 2.8rem; width: 30%;" />
						<kv-loading-placeholder style="height: 2.8rem; width: 30%; margin-left: auto;" />
					</div>
				</template>
				<template v-else>
					<loan-progress
						data-testid="bp-summary-progress"
						class="tw-mb-2"
						:money-left="unreservedAmount"
						:progress-percent="fundraisingPercent"
						:time-left="timeLeft"
						:urgency="showUrgencyExp && timeLeftMs > 0"
						:ms-left="timeLeftMs"
						:loan-status="inPfp ? 'pfp' : 'fundraising'"
						:number-of-lenders="numLenders"
						:pfp-min-lenders="pfpMinLenders"
					/>
				</template>
			</div>
		</div>
		<p class="tw-flex-none tw-w-full tw-mb-2 tw-text-h2" data-testid="bp-summary-loan-use">
			{{ use }}
		</p>
		<div class="tw-flex-auto tw-inline-flex tw-w-full">
			<template v-if="isLoading">
				<kv-loading-placeholder style="height: 1.9rem; width: 50%;" />
			</template>
			<template v-else>
				<summary-tag v-if="countryName">
					<kv-material-icon
						class="tw-h-2.5 tw-w-2.5 tw-mr-0.5 tw-shrink-0"
						:icon="mdiMapMarker"
					/>
					<span class="tw-flex-1" data-testid="bp-summary-country-tag">
						{{ formattedLocation }}
					</span>
				</summary-tag>

				<summary-tag data-testid="bp-summary-activity-tag" v-if="activityName">
					{{ activityName }}
				</summary-tag>
			</template>

			<loan-bookmark
				v-if="bookmarkVersion === 'bookmark'"
				:loan-id="loanId"
				class="tw-hidden lg:tw-inline-flex tw-ml-auto tw-items-center"
				data-testid="bp-summary-bookmark"
			/>
			<loan-follow
				v-if="bookmarkVersion === 'follow'"
				class="tw-hidden lg:tw-inline-flex tw-ml-auto tw-items-center"
				data-testid="bp-summary-follow"
			/>
		</div>
		<slot name="sharebutton"></slot>
		<hr class="md:tw-hidden tw-border-tertiary tw-w-full tw-mt-2">
		<div
			class="tw-flex tw-items-center tw-w-full"
			:class="isLoggedIn ? 'tw-justify-between' : 'tw-justify-end'"
		>
			<!-- only show option to bookmark loan if user is logged in -->
			<loan-bookmark
				v-if="bookmarkVersion === 'bookmark'"
				:loan-id="loanId"
				class="md:tw-hidden tw-mt-1"
				data-testid="bp-mobile-summary-bookmark"
			/>
			<loan-follow
				v-if="bookmarkVersion === 'follow'"
				class="md:tw-hidden tw-mt-0.5 tw-mr-2"
				data-testid="bp-mobile-summary-follow"
			/>

			<jump-links class="md:tw-hidden tw-my-2" data-testid="bp-summary-card-jump-links" />
		</div>
	</section>
</template>

<script>
import { gql } from '@apollo/client';
import { mdiMapMarker } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import BorrowerImage from './BorrowerImage';
import BorrowerName from './BorrowerName';
import LoanProgress from './LoanProgress';
import SummaryTag from './SummaryTag';
import LoanBookmark from './LoanBookmark';
import LoanFollow from './LoanFollow';
import JumpLinks from './JumpLinks';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

const preFetchQuery = gql`
	query summaryCard($loanId: Int!) {
		lend {
			loan(id: $loanId) {
				id
				image {
					id
					hash
				}
				name
				status
				use
				# for fullLoanUse
				anonymizationLevel
				borrowerCount
				loanAmount
				fullLoanUse @client
			}
		}
		my {
			id
			userAccount {
				id
			}
		}
	}
`;

const mountQuery = gql`
	query summaryCard($loanId: Int!) {
		lend {
			loan(id: $loanId) {
				id
				activity {
					id
					name
				}
				distributionModel
				fundraisingPercent @client
				fundraisingTimeLeft @client
				fundraisingTimeLeftMilliseconds @client
				geocode {
					city
					state
					country {
						name
					}
				}
				loanAmount
				loanFundraisingInfo {
					fundedAmount
					reservedAmount
				}
				plannedExpirationDate
				unreservedAmount @client
				inPfp
				pfpMinLenders
				lenders {
					totalCount
				}
			}
		}
	}
`;

export default {
	name: 'SummaryCard',
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerImage,
		BorrowerName,
		KvMaterialIcon,
		LoanProgress,
		SummaryTag,
		LoanBookmark,
		LoanFollow,
		JumpLinks,
		KvLoadingPlaceholder,
	},
	props: {
		showUrgencyExp: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			isLoading: true,
			isLoggedIn: false,
			activityName: '',
			countryName: '',
			fundraisingPercent: 0,
			hash: '',
			mdiMapMarker,
			name: '',
			status: '',
			timeLeft: '',
			unreservedAmount: '0',
			use: '',
			distributionModel: '',
			city: '',
			state: '',
			timeLeftMs: 0,
			inPfp: false,
			pfpMinLenders: 0,
			numLenders: 0,
		};
	},
	computed: {
		loanId() {
			return Number(this.$route?.params?.id ?? 0);
		},
		formattedLocation() {
			if (this.distributionModel === 'direct') {
				const formattedString = `${this.city}, ${this.state}, ${this.countryName}`;
				return formattedString;
			}
			if (this.countryName === 'Puerto Rico') {
				const formattedString = `${this.city}, PR`;
				return formattedString;
			}
			return this.countryName;
		},
		bookmarkVersion() {
			// Display follow for all US loans no matter login state
			if (this.distributionModel === 'direct') {
				return 'follow';
			}
			// Display bookmark for logged in users, non us loans
			if (this.isLoggedIn) {
				return 'bookmark';
			}
			return 'none';
		}
	},
	async mounted() {
		this.$kvTrackEvent(
			'Borrower profile',
			'borrower profile status',
			this.status
		);

		const { data } = await this.apollo.query({ query: mountQuery, variables: { loanId: this.loanId } });
		const loan = data?.lend?.loan;
		this.inPfp = loan?.inPfp ?? false;
		this.pfpMinLenders = loan?.pfpMinLenders ?? 0;
		this.numLenders = loan?.lenders?.totalCount ?? 0;
		this.activityName = loan?.activity?.name ?? '';
		this.countryName = loan?.geocode?.country?.name ?? '';
		this.fundraisingPercent = loan?.fundraisingPercent ?? 0;
		this.timeLeft = loan?.fundraisingTimeLeft ?? '';
		this.unreservedAmount = loan?.unreservedAmount ?? '0';
		this.distributionModel = loan?.distributionModel ?? '';
		this.city = loan?.geocode?.city ?? '';
		this.state = loan?.geocode?.state ?? '';
		this.timeLeftMs = loan?.fundraisingTimeLeftMilliseconds > 0 ? loan?.fundraisingTimeLeftMilliseconds : 0;
		// If all shares are reserved in baskets, set the fundraising meter to 100%
		if (this.unreservedAmount === '0') {
			this.fundraisingPercent = 1;
		}
		this.isLoading = false;
	},
	apollo: {
		query: preFetchQuery,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				loanId: Number(route?.params?.id ?? 0),
			};
		},
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan;
			this.isLoggedIn = result?.data?.my?.userAccount?.id !== undefined || false;
			this.hash = loan?.image?.hash ?? '';
			this.name = loan?.name ?? '';
			this.status = loan?.status ?? '';
			this.use = loan?.fullLoanUse ?? '';
		},
	},
};
</script>
