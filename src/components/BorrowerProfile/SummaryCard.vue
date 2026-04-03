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
					class="tw-mb-0.5"
					:name="name"
				/>
				<template v-if="isLoading">
					<div class="tw-flex tw-flex-wrap tw-mb-3">
						<kv-loading-placeholder class="tw-mb-1 tw-h-2" />
						<kv-loading-placeholder class="tw-h-[2.8rem]" :style="{width: '30%'}" />
						<kv-loading-placeholder class="tw-h-[2.8rem] tw-ml-auto" :style="{width: '30%'}" />
					</div>
				</template>
				<template v-else>
					<a
						v-if="totalComments > 0"
						href="#bp-comments-jump-link"
						class="tw-inline-block tw-text-black hover:tw-text-black"
						v-kv-track-event="[
							'borrower-profile',
							'click',
							'jump-link',
							'comments-pill'
						]"
					>
						<summary-tag class="hover:tw-bg-brand-200 tw-mr-0" background-color="tw-bg-brand-100">
							<heart-comment class="tw-h-3 tw-w-3 tw-mr-0.5 heart-svg" />
							<span class="tw-flex-1">
								{{ totalComments }} Comment{{ totalComments > 1 ? 's' : '' }}
							</span>
						</summary-tag>
					</a>
					<loan-progress
						data-testid="bp-summary-progress"
						class="tw-mb-2 tw-mt-1.5"
						:money-left="unreservedAmount"
						:progress-percent="effectiveProgressPercent"
						:time-left="timeLeft"
						:loan-status="inPfp ? 'pfp' : status"
						:number-of-lenders="numLenders"
						:pfp-min-lenders="pfpMinLenders"
						:loading="isLoading"
					/>
				</template>
			</div>
		</div>
		<p class="tw-flex-none tw-w-full tw-mb-2 tw-text-headline" data-testid="bp-summary-loan-use">
			{{ use }}
		</p>
		<div class="tw-flex-auto tw-inline-flex tw-w-full">
			<template v-if="isLoading">
				<kv-loading-placeholder class="tw-h-[1.9rem]" :style="{width: '50%'}" />
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

			<!-- only show option to bookmark loan if user is logged in -->
			<loan-bookmark
				v-if="isLoggedIn"
				:loan-id="loanId"
				class="tw-hidden lg:tw-inline-flex tw-ml-auto tw-items-center"
				data-testid="bp-summary-bookmark"
			/>
		</div>
		<slot name="sharebutton"></slot>
	</section>
</template>

<script>
import { gql } from 'graphql-tag';
import { mdiMapMarker } from '@mdi/js';
import HeartComment from '#src/assets/icons/inline/heart-comment.svg';
import { KvMaterialIcon, KvLoadingPlaceholder } from '@kiva/kv-components';
import BorrowerImage from './BorrowerImage';
import BorrowerName from './BorrowerName';
import LoanProgress from './LoanProgress';
import SummaryTag from './SummaryTag';
import LoanBookmark from './LoanBookmark';

export const summaryCardFragment = gql`fragment summaryCardFields on LoanBasic {
	id
	image {
		id
		hash
	}
	name
	status
	use
	anonymizationLevel
	borrowerCount
	loanAmount
	fullLoanUse @client
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
			id
			name
		}
	}
	paidAmount
	loanFundraisingInfo {
		id
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
	comments {
		totalCount
	}
}`;

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
						id
						name
					}
				}
				loanAmount
				paidAmount
				loanFundraisingInfo {
					id
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
				comments {
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
		KvLoadingPlaceholder,
		HeartComment,
	},
	props: {
		loan: {
			type: Object,
			default: () => ({}),
		},
		isLoggedIn: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		// Initialize from loan prop when available (e.g. SSR with cache-warmed data)
		// so the component renders real content instead of loading skeletons.
		// The mount query will refresh these values client-side.
		const loan = this.loan;
		const hasLoanData = !!loan?.id;
		return {
			isLoading: !hasLoanData,
			activityName: loan?.activity?.name ?? '',
			countryName: loan?.geocode?.country?.name ?? '',
			fundraisingPercent: hasLoanData ? (loan?.fundraisingPercent ?? 0) : 0,
			mdiMapMarker,
			timeLeft: loan?.fundraisingTimeLeft ?? '',
			unreservedAmount: loan?.unreservedAmount ?? '0',
			distributionModel: loan?.distributionModel ?? '',
			city: loan?.geocode?.city ?? '',
			state: loan?.geocode?.state ?? '',
			inPfp: loan?.inPfp ?? false,
			pfpMinLenders: loan?.pfpMinLenders ?? 0,
			numLenders: loan?.lenders?.totalCount ?? 0,
			totalComments: loan?.comments?.totalCount ?? 0,
			paidAmount: loan?.paidAmount ?? '0.00',
		};
	},
	computed: {
		loanId() {
			return this.loan?.id ?? 0;
		},
		hash() {
			return this.loan?.image?.hash ?? '';
		},
		name() {
			return this.loan?.name ?? '';
		},
		status() {
			return this.loan?.status ?? '';
		},
		use() {
			return this.loan?.fullLoanUse ?? '';
		},
		effectiveProgressPercent() {
			if (this.status === 'payingBack') {
				const loanAmount = parseFloat(this.loan?.loanAmount ?? '0');
				return loanAmount > 0 ? parseFloat(this.paidAmount) / loanAmount : 0;
			}
			return this.fundraisingPercent;
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
		}
	},
	apollo: {
		query: mountQuery,
		preFetch: false,
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			const loan = data?.lend?.loan;
			this.$kvTrackEvent('Borrower profile', 'borrower profile status', loan?.status);
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
			// If all shares are reserved in baskets, set the fundraising meter to 100%
			if (this.unreservedAmount === '0') {
				this.fundraisingPercent = 1;
			}
			this.totalComments = loan?.comments?.totalCount ?? 0;
			this.paidAmount = loan?.paidAmount ?? '0.00';
			this.isLoading = false;
		},
	},
};
</script>
<style lang="postcss" scoped>
.heart-svg path {

	@apply tw-fill-brand;
}

</style>
