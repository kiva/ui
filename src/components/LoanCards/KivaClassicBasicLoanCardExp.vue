<template>
	<div
		class="tw-flex tw-flex-col"
		style="min-width: 230px; max-width: 374px; height: 100%;"
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
					class="tw-absolute tw-bottom-2 tw-right-1 tw-text-primary"
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
		</div>

		<!-- Borrower name-->
		<kv-loading-placeholder
			v-if="isLoading"
			class="tw-mb-0.5" :style="{width: 75 + (Math.random() * 15) + '%', height: '1.875rem'}"
		/>

		<borrower-name
			v-if="!isLoading"
			class="tw-mb-1 tw-text-h3"
			:max-length="50"
			:name="borrowerName"
			style="min-height: 3rem;"
		/>

		<!-- LoanUse  -->
		<kv-loading-paragraph
			v-if="isLoading"
			class="tw-mb-1.5 tw-flex-grow" :style="{width: '100%', height: '5.5rem'}"
		/>

		<loan-use
			v-if="!isLoading"
			class="tw-mb-2.5 tw-flex-grow"
			:loan-use-max-length="52"
			:loan-id="`${allSharesReserved ? '' : loanId}`"
			:use="loan.use"
			:name="borrowerName"
			:status="loan.status"
			:loan-amount="loan.loanAmount"
			:borrower-count="loan.borrowerCount"
		/>
	</div>
</template>

<script>
import { mdiChevronRight, mdiMapMarker } from '@mdi/js';
import gql from 'graphql-tag';
import * as Sentry from '@sentry/vue';
import { isMatchAtRisk } from '@/util/loanUtils';
import LoanUse from '@/components/BorrowerProfile/LoanUse';
import percentRaisedMixin from '@/plugins/loan/percent-raised-mixin';
import timeLeftMixin from '@/plugins/loan/time-left-mixin';
import BorrowerImage from '@/components/BorrowerProfile/BorrowerImage';
import BorrowerName from '@/components/BorrowerProfile/BorrowerName';
import KvLoadingPlaceholder from '@/components/Kv/KvLoadingPlaceholder';
import KvLoadingParagraph from '@/components/Kv/KvLoadingParagraph';
import SummaryTag from '@/components/BorrowerProfile/SummaryTag';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const loanQuery = gql`query kcBasicLoanCard($loanId: Int!) {
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

			# for loan-use-mixin
			use
			status
			loanAmount
			borrowerCount

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
		isMatchAtRisk() {
			return isMatchAtRisk(this.loan);
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
