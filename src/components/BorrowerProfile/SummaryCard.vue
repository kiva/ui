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
			</div>
		</div>
		<loan-use
			class="tw-flex-none tw-w-full tw-mb-2 tw-text-h2"
			data-testid="bp-summary-loan-use"
			:borrower-count="borrowerCount"
			:loan-amount="loanAmount"
			:name="name"
			:status="status"
			:use="use"
			:anonymization-level="anonymizationLevel"
		/>
		<div class="tw-flex-auto tw-inline-flex tw-w-full">
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

			<!-- only show option to bookmark loan if user is logged in -->
			<loan-bookmark
				v-if="isLoggedIn"
				:loan-id="loanId"
				class="tw-hidden lg:tw-inline-flex tw-ml-auto tw-items-center"
				data-testid="bp-summary-bookmark"
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
				v-if="isLoggedIn"
				:loan-id="loanId"
				class="md:tw-hidden tw-mt-1"
				data-testid="bp-mobile-summary-bookmark"
			/>

			<jump-links class="md:tw-hidden tw-my-2" data-testid="bp-summary-card-jump-links" />
		</div>
	</section>
</template>

<script>
import gql from 'graphql-tag';
import { mdiMapMarker } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import BorrowerImage from './BorrowerImage';
import BorrowerName from './BorrowerName';
import LoanProgress from './LoanProgress';
import LoanUse from './LoanUse';
import SummaryTag from './SummaryTag';
import LoanBookmark from './LoanBookmark';
import JumpLinks from './JumpLinks';

export default {
	name: 'SummaryCard',
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerImage,
		BorrowerName,
		KvMaterialIcon,
		LoanProgress,
		LoanUse,
		SummaryTag,
		LoanBookmark,
		JumpLinks,
	},
	props: {
		showUrgencyExp: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			isLoggedIn: false,
			loanId: 0,
			activityName: '',
			borrowerCount: 0,
			countryName: '',
			fundraisingPercent: 0,
			hash: '',
			loanAmount: '0',
			mdiMapMarker,
			name: '',
			status: '',
			timeLeft: '',
			unreservedAmount: '0',
			use: '',
			distributionModel: '',
			city: '',
			state: '',
			anonymizationLevel: 'none',
			timeLeftMs: 0,
			inPfp: false,
			pfpMinLenders: 0,
			numLenders: 0,
		};
	},
	computed: {
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
	mounted() {
		this.$kvTrackEvent(
			'Borrower profile',
			'borrower profile status',
			this.status
		);
	},
	apollo: {
		query: gql`
			query summaryCard($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						activity {
							id
							name
						}
						borrowerCount
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
						image {
							id
							hash
						}
						loanAmount
						loanFundraisingInfo {
							fundedAmount
							reservedAmount
						}
						name
						plannedExpirationDate
						status
						unreservedAmount @client
						use
						anonymizationLevel
						inPfp
						pfpMinLenders
						lenders {
							totalCount
						}
					}
				}
				my {
					userAccount {
						id
					}
				}
			}
		`,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				loanId: Number(route?.params?.id ?? 0),
			};
		},
		variables() {
			return {
				loanId: Number(this.$route?.params?.id ?? 0),
			};
		},
		result(result) {
			const loan = result?.data?.lend?.loan;
			this.inPfp = loan?.inPfp ?? false;
			this.pfpMinLenders = loan?.pfpMinLenders ?? 0;
			this.numLenders = loan?.lenders?.totalCount ?? 0;
			this.isLoggedIn = result?.data?.my?.userAccount?.id !== undefined || false;
			this.loanId = loan?.id ?? 0;
			this.activityName = loan?.activity?.name ?? '';
			this.borrowerCount = loan?.borrowerCount ?? 0;
			this.countryName = loan?.geocode?.country?.name ?? '';
			this.fundraisingPercent = loan?.fundraisingPercent ?? 0;
			this.hash = loan?.image?.hash ?? '';
			this.loanAmount = loan?.loanAmount ?? '0';
			this.name = loan?.name ?? '';
			this.status = loan?.status ?? '';
			this.timeLeft = loan?.fundraisingTimeLeft ?? '';
			this.unreservedAmount = loan?.unreservedAmount ?? '0';
			this.use = loan?.use ?? '';
			this.distributionModel = loan?.distributionModel ?? '';
			this.city = loan?.geocode?.city ?? '';
			this.state = loan?.geocode?.state ?? '';
			this.anonymizationLevel = loan?.anonymizationLevel ?? 'none';
			this.timeLeftMs = loan?.fundraisingTimeLeftMilliseconds > 0 ? loan?.fundraisingTimeLeftMilliseconds : 0;
			// If all shares are reserved in baskets, set the fundraising meter to 100%
			if (this.unreservedAmount === '0') {
				this.fundraisingPercent = 1;
			}
		},
	},
};
</script>
