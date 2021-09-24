<template>
	<div
		class="kv-tailwind tw-w-[336px]"
		:id="`${loanId}-loan-card`"
	>
		<!-- Borrower image w/ location <summary-tag> -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-1 tw-rounded" :style="{width: '100%', height: '15.75rem'}"
		/>
		<div
			v-if="!isLoading"
			class="tw-relative"
		>
			<!-- If allSharesReserved, disable link by making it a span -->
			<router-link
				:is="allSharesReserved ? 'span' : 'router-link'"
				:to="`/lend/${loanId}`"
				v-kv-track-event="['Lending', 'click-Read more', 'Photo', loanId]"
			>
				<borrower-image
					class="
					tw-relative
					tw-w-full
					tw-bg-black
					tw-rounded
				"
					:alt="'photo of ' + borrowerName"
					:aspect-ratio="3 / 4"
					:default-image="{ width: 336 }"
					:hash="imageHash"
					:images="[
						{ width: 336, viewSize: 1024 },
						{ width: 336, viewSize: 768 },
						{ width: 416, viewSize: 480 },
						{ width: 374, viewSize: 414 },
						{ width: 335, viewSize: 375 },
						{ width: 280 },
					]"
				/>
				<div v-if="countryName">
					<summary-tag
						class="tw-absolute tw-bottom-2 tw-left-1 tw-text-primary"
						:city="city"
						:state="state"
						:country-name="countryName"
					>
						<kv-material-icon
							class="tw-h-2.5 tw-w-2.5 tw-mr-0.5"
							:icon="mdiMapMarker"
						/>
						{{ formattedLocation }}
					</summary-tag>
				</div>
			</router-link>
		</div>

		<!-- Borrower name-->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-0.5" :style="{width: 75 + (Math.random() * 15) + '%', height: '1.875rem'}"
		/>

		<borrower-name
			v-if="!isLoading"
			class="tw-mb-1 tw-text-h3"
			:name="borrowerName"
		/>

		<!-- Amount to go line-->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-0.5" :style="{width: 40 + (Math.random() * 15) + '%', height: '1.3rem'}"
		/>

		<!-- Fundraising bar -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-1.5 tw-rounded" :style="{width: '100%', height: '0.5rem'}"
		/>

		<!-- Contains amount to go and fundraising bar -->
		<loan-progress-group
			v-if="!ifLoading"
			class="tw-mb-2.5"
			:money-left="unreservedAmount"
			:progress-percent="fundraisingPercent"
			:time-left="timeLeftMessage"
			:all-shares-reserved="allSharesReserved"
		/>

		<!-- LoanUse  -->
		<kv-loading-paragraph
			v-if="isLoading"
			class="tw-mb-1.5" :style="{width: '100%', height: '5.5rem'}"
		/>

		<loan-use
			v-if="!isLoading"
			class="tw-mb-2.5"
			loan-use-max-length="52"
			:use="loan.use"
			:name="borrowerName"
			:status="loan.status"
			:loan-amount="loan.loanAmount"
			:borrower-count="loan.borrowerCount"
		/>

		<!-- Matching text  -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-1" :style="{width: 75 + (Math.random() * 15) + '%', height: '1.3rem'}"
		/>

		<loan-matching-text
			v-if="!isLoading"
			class="tw-mb-1.5"
			:matcher-name="loan.matchingText"
			:match-ratio="loan.matchRatio"
			:status="loan.status"
			:funded-amount="loan.loanFundraisingInfo.fundedAmount"
			:reserved-amount="loan.loanFundraisingInfo.reservedAmount"
			:loan-amount="loan.loanAmount"
		/>

		<!-- CTA Button -->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-rounded" :style="{width: '9rem', height: '3rem'}"
		/>

		<kv-button
			v-if="!isLoading"
			class="tw-mb-2"
			:state="`${allSharesReserved ? 'disabled' : ''}`"
			:to="`/lend/${loanId}`"
			v-kv-track-event="['Lending', 'click-Read-more', 'Read more', loanId]"
		>
			View loan
			<kv-material-icon
				class="tw-align-middle"
				:icon="mdiChevronRight"
			/>
		</kv-button>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import * as Sentry from '@sentry/browser';
import LoanUse from '@/components/BorrowerProfile/LoanUse';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import BorrowerName from '@/components/BorrowerProfile/BorrowerName';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import LoanProgressGroup from '@/components/LoanCards/LoanProgressGroup';
import LoanMatchingText from '@/components/LoanCards/LoanMatchingText';
import { mdiChevronRight, mdiMapMarker } from '@mdi/js';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const loanQuery = gql`query kcBasicLoanCard($basketId: String, $loanId: Int!) {
	shop (basketId: $basketId) {
		id
		basket {
			id
			# for isInBasket
			items {
				values {
					id
				}
			}
		}
	}
	lend {
		loan(id: $loanId) {
			id
			distributionModel
			geocode {
				city
				state
				country {
					name
					isoCode
				}
			}
			image {
				id
				hash
			}
			name
			sector {
				id
				name
			}
			whySpecial

			# for isLentTo
			userProperties {
				lentTo
			}

			# for loan-use-mixin
			use
			status
			loanAmount
			borrowerCount

			# for percent-raised-mixin
			loanFundraisingInfo {
				fundedAmount
				reservedAmount
			}

			# for time-left-mixin
			plannedExpirationDate

			# for loan-progress component
			unreservedAmount @client
			fundraisingPercent @client
			fundraisingTimeLeft @client

			# for matching-text component
			matchingText
			matchRatio
		}
	}
}`;

export default {
	props: {
		loanId: {
			type: Number,
			required: true,
		}
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [percentRaisedMixin, timeLeftMixin],
	components: {
		BorrowerImage,
		BorrowerName,
		KvLoadingPlaceholder,
		KvLoadingParagraph,
		LoanUse,
		LoanProgressGroup,
		LoanMatchingText,
		KvButton,
		KvMaterialIcon,
		SummaryTag,
	},
	data() {
		return {
			loan: null,
			basketItems: null,
			isLoading: false,
			queryObserver: null,
			mdiChevronRight,
			mdiMapMarker,
		};
	},
	computed: {
		borrowerName() {
			return this.loan?.name || '';
		},
		countryISO() {
			return this.loan?.geocode?.country?.isoCode || '';
		},
		countryName() {
			return this.loan?.geocode?.country?.name || '';
		},
		city() {
			return this.loan?.geocode?.city || '';
		},
		state() {
			return this.loan?.geocode?.state || '';
		},
		distributionModel() {
			return this.loan?.distributionModel || '';
		},
		imageHash() {
			return this.loan?.image?.hash ?? '';
		},
		isInBasket() {
			if (!Array.isArray(this.basketItems)) {
				return false;
			}
			// eslint-disable-next-line no-underscore-dangle
			const loanItems = this.basketItems.filter(item => item.__typename === 'LoanReservation');
			const loanIds = loanItems.map(loan => loan.id);
			return loanIds.indexOf(this.loanId) > -1;
		},
		isLentTo() {
			return this.loan?.userProperties?.lentTo;
		},
		sectorName() {
			return (this.loan?.sector?.name || '').toLowerCase();
		},
		whySpecial() {
			const text = this.loan?.whySpecial || '';
			return text.toString().charAt(0).toLowerCase() + text.toString().slice(1);
		},
		fundraisingPercent() {
			return this.loan?.fundraisingPercent ?? 0;
		},
		unreservedAmount() {
			return this.loan?.unreservedAmount ?? '0';
		},
		timeLeft() {
			return this.loan?.fundraisingTimeLeft ?? '';
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
		allSharesReserved() {
			if (parseFloat(this.loan?.unreservedAmount) === 0) {
				return true;
			}
			return false;
		},
	},
	methods: {
		prefetchLoanData() {
			if (!this.loan) {
				this.isLoading = true;
			}
			// TODO: Create method in loanUtils for the QUERY (pass in apollo, loanid, cookieStore)
			return this.apollo.query({
				variables: {
					loanId: this.loanId,
				},
				query: loanQuery,
			}).then(result => {
				this.processQueryResult(result);
			});
		},
		readLoanData() {
			// Read loan data from the cache (synchronus)
			try {
				// TODO: Create method in loanUtils for the READ query (pass in apollo, loanid, cookieStore)
				const data = this.apollo.readQuery({
					query: loanQuery,
					variables: {
						basketId: this.cookieStore.get('kvbskt'),
						loanId: this.loanId,
					},
				});
				if (data.lend) {
					this.processQueryResult({ data });
				} else {
					// Show loading state while watchQuery completes
					this.isLoading = true;
				}
			} catch (e) {
				// if there's an error it means there's no loan data in the cache yet, which means the page
				// was not server rendered, so just show a loading state and wait for the watchQuery to complete
				this.isLoading = true;
			}
		},
		watchQueryLoanData() {
			// Setup query observer to watch for changes to the loan data (async)
			// TODO: Create method in loanUtils for the WATCH query (pass in apollo, loanid, cookieStore)
			this.queryObserver = this.apollo.watchQuery({
				query: loanQuery,
				variables: {
					basketId: this.cookieStore.get('kvbskt'),
					loanId: this.loanId,
				},
			});

			// Subscribe to the observer to see each result
			this.queryObserver.subscribe({
				next: result => this.processQueryResult(result),
				error: error => this.processQueryResult({ error }),
			});
		},
		processQueryResult(result) {
			if (result.error) {
				console.error(result.error);
				this.$showTipMsg('There was a problem loading your loan recommendations', 'error');
				try {
					Sentry.withScope(scope => {
						scope.setTag('wizard_stage', 'results');
						scope.setTag('loan_id', this.loanId);
						Sentry.captureException(result.error);
					});
				} catch (e) {
					// no-op
				}
			}

			this.isLoading = false;
			this.loan = result.data?.lend?.loan || null;
			this.basketItems = result.data?.shop?.basket?.items?.values || null;
		}
	},
	serverPrefetch() {
		return this.prefetchLoanData();
	},
	created() {
		if (!this.$isServer) {
			this.readLoanData();
			this.watchQueryLoanData();
		}
	},
	watch: {
		// When loan id changes, update watch query variables
		loanId(loanId) {
			if (this.queryObserver) {
				this.queryObserver.setVariables({
					basketId: this.cookieStore.get('kvbskt'),
					loanId,
				});
			}
		},
	},
};
</script>
