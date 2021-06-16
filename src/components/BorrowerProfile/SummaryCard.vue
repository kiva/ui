<template>
	<!-- eslint-disable-next-line max-len -->
	<section class="
		tw-flex tw-flex-wrap
		tw-bg-gray-50 md:tw-bg-white
		tw-p-2.5 md:tw-p-3 lg:tw-p-4
		md:tw-rounded-t lg:tw-rounded"
	>
		<borrower-avatar
			class="
				tw-flex-none tw-w-8 tw-h-8 tw-mr-1.5 tw-mb-1.5
				md:tw-w-9 md:tw-h-9 md:tw-mr-3 md:tw-mb-3
				lg:tw-w-10 lg:tw-h-10 lg:tw-mr-4 lg:tw-mb-4
			"
			:alt="`Small, circular photograph of ${name}`"
			:fallback="fallbackImage"
			:sources="images"
		/>
		<div class="tw-flex-auto">
			<borrower-name
				class="md:tw-mb-1.5 lg:tw-mb-2"
				:name="name"
			/>
			<loan-progress
				:money-left="unreservedAmount"
				:progress-percent="fundraisingPercent"
				:time-left="timeLeft"
			/>
		</div>
		<loan-use
			class="tw-flex-none tw-w-full"
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
				{{ countryName }}
			</summary-tag>
			<summary-tag v-if="activityName">
				{{ activityName }}
			</summary-tag>
		</div>
	</section>
</template>

<script>
import gql from 'graphql-tag';
import { mdiMapMarker } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import BorrowerAvatar from './BorrowerAvatar';
import BorrowerName from './BorrowerName';
import LoanProgress from './LoanProgress';
import LoanUse from './LoanUse';
import SummaryTag from './SummaryTag';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerAvatar,
		BorrowerName,
		KvMaterialIcon,
		LoanProgress,
		LoanUse,
		SummaryTag,
	},
	data() {
		return {
			activityName: '',
			borrowerCount: 0,
			countryName: '',
			fallbackImage: '',
			fundraisingPercent: 0,
			images: [],
			loanAmount: '0',
			mdiMapMarker,
			name: '',
			status: '',
			timeLeft: '',
			unreservedAmount: '0',
			use: '',
		};
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
						fundraisingPercent @client
						fundraisingTimeLeft @client
						geocode {
							country {
								name
							}
						}
						image {
							id
							urlSm1x: url(customSize: "s64fz50")
							urlSm2x: url(customSize: "s128fz50")
							urlMd1x: url(customSize: "s72fz50")
							urlMd2x: url(customSize: "s144fz50")
							urlLg1x: url(customSize: "s80fz50")
							urlLg2x: url(customSize: "s160fz50")
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
			this.activityName = loan?.activity?.name ?? '';
			this.borrowerCount = loan?.borrowerCount ?? 0;
			this.countryName = loan?.geocode?.country?.name ?? '';
			this.fallbackImage = loan?.image?.urlSm1x ?? '';
			this.fundraisingPercent = loan?.fundraisingPercent ?? 0;
			this.loanAmount = loan?.loanAmount ?? '0';
			this.name = loan?.name ?? '';
			this.status = loan?.status ?? '';
			this.timeLeft = loan?.fundraisingTimeLeft ?? '';
			this.unreservedAmount = loan?.unreservedAmount ?? '0';
			this.use = loan?.use ?? '';

			// Build images array
			this.images = [
				{
					media: 'min-width: 1024px', // large
					urls: {
						'2x': loan?.image?.urlLg2x ?? '',
						'1x': loan?.image?.urlLg1x ?? '',
					},
				},
				{
					media: 'min-width: 734px', // medium
					urls: {
						'2x': loan?.image?.urlMd2x ?? '',
						'1x': loan?.image?.urlMd1x ?? '',
					},
				},
				{
					media: 'min-width: 0',
					urls: {
						'2x': loan?.image?.urlSm2x ?? '',
						'1x': loan?.image?.urlSm1x ?? '',
					},
				},
			];
		},
	},
};
</script>
