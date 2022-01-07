<template>
	<section class="
		tw-pb-0
		md:tw-bg-primary
		md:tw-pb-2.5
		tw-py-2.5 md:tw-p-3 lg:tw-p-4
		md:tw-rounded-t lg:tw-rounded"
	>
		<div class="tw-flex">
			<div class="
				tw-flex-none tw-w-8 tw-h-8 tw-mr-1.5 tw-mb-1.5
				md:tw-w-9 md:tw-h-9 md:tw-mr-3 md:tw-mb-3
				lg:tw-w-10 lg:tw-h-10 lg:tw-mr-4 lg:tw-mb-4"
			>
				<borrower-image
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
					class="md:tw-mb-1.5 lg:tw-mb-2"
					:name="name"
				/>
				<loan-progress
					class="tw-mb-2"
					:money-left="unreservedAmount"
					:progress-percent="fundraisingPercent"
					:time-left="timeLeft"
				/>
			</div>
		</div>
		<loan-use
			class="tw-flex-none tw-w-full tw-mb-2 tw-text-h2"
			:borrower-count="borrowerCount"
			:loan-amount="loanAmount"
			:name="name"
			:status="status"
			:use="use"
		/>
		<div class="tw-flex-auto tw-inline-flex">
			<summary-tag v-if="countryName">
				<kv-material-icon
					class="tw-h-2.5 tw-w-2.5 tw-mr-0.5"
					:icon="mdiMapMarker"
				/>
				{{ formattedLocation }}
			</summary-tag>

			<summary-tag v-if="activityName">
				{{ activityName }}
			</summary-tag>

			<!-- only show option to bookmark loan if user is logged in -->
			<loan-bookmark
				v-if="isLoggedIn"
				:loan-id="loanId"
				class="tw-hidden lg:tw-inline-flex tw-right-2.5 tw-absolute"
			/>
		</div>
		<!-- only show option to bookmark loan if user is logged in -->
		<loan-bookmark
			v-if="isLoggedIn"
			:loan-id="loanId"
			class="md:tw-hidden"
		/>
	</section>
</template>

<script>
import gql from 'graphql-tag';
import { mdiMapMarker } from '@mdi/js';
import { getKivaImageUrl } from '@/util/imageUtils';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import BorrowerImage from './BorrowerImage';
import BorrowerName from './BorrowerName';
import LoanProgress from './LoanProgress';
import LoanUse from './LoanUse';
import SummaryTag from './SummaryTag';
import LoanBookmark from './LoanBookmark';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerImage,
		BorrowerName,
		KvMaterialIcon,
		LoanProgress,
		LoanUse,
		SummaryTag,
		LoanBookmark,
	},
	metaInfo() {
		return {
			title: this.pageTitle,
			meta: [
				{ property: 'og:title', vmid: 'og:title', content: `A loan to ${this.name}` },
				{ property: 'og:type', vmid: 'og:type', content: 'kivadotorg:loan' },
				{
					property: 'og:image',
					vmid: 'og:image',
					content: this.imageShareUrl
				},
			].concat(this.$appConfig.enableFB ? [
				{
					vmid: 'facebook_label',
					name: 'facebook_label',
					content: this.pageLabel
				},
			] : [])
		};
	},
	data() {
		return {
			isLoggedIn: false,
			loanId: 0,
			activityName: '',
			borrowerCount: 0,
			countryName: '',
			fallbackImage: '',
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
		};
	},
	computed: {
		imageShareUrl() {
			if (!this.hash) return '';
			return getKivaImageUrl({
				height: 630,
				width: 1200,
				base: this.$appConfig.photoPath,
				hash: this.hash,
			});
		},
		pageLabel() {
			return `Kiva - ${this.pageTitle}`;
		},
		pageTitle() {
			// eslint-disable-next-line prefer-destructuring
			let name = this.name;
			if (this.businessName) {
				name = `${name}, ${this.businessName}`;
			}
			return `${name} - ${this.countryName}`;
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
			this.isLoggedIn = result?.data?.my?.userAccount?.id !== undefined || false;
			this.loanId = loan?.id ?? 0;
			this.activityName = loan?.activity?.name ?? '';
			this.borrowerCount = loan?.borrowerCount ?? 0;
			this.businessName = loan?.businessName ?? '';
			this.countryName = loan?.geocode?.country?.name ?? '';
			this.fallbackImage = loan?.image?.urlSm1x ?? '';
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

			// If all shares are reserved in baskets, set the fundraising meter to 100%
			if (this.unreservedAmount === '0') {
				this.fundraisingPercent = 1;
			}
		},
	},
};
</script>
