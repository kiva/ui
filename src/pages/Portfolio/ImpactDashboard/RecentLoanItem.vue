<template>
	<li class="tw-text-center md:tw-px-3">
		<!-- photo (link) -->
		<div
			class="tw-overflow-hidden tw-rounded-full tw-bg-secondary tw-mx-auto tw-mb-2 tw-max-w-full"
			style="width: 140px;"
		>
			<kv-loading-placeholder v-if="loading" style="height: 0; padding-bottom: 100%;" />
			<router-link
				v-else
				:to="`/lend/${loanId}`"
				v-kv-track-event="['portfolio', 'click', 'recent-loans', 'loan-image', loanId]"
			>
				<img
					v-if="imageUrl && imageRetinaUrl"
					:srcset="`${imageRetinaUrl} 2x`"
					:src="imageUrl"
					:alt="imageAlt"
					width="140"
					height="140"
				>
			</router-link>
		</div>
		<!-- name (link) -->
		<kv-loading-placeholder
			v-if="loading"
			class="tw-mx-auto"
			style="width: 6rem; height: 1.5rem; margin-bottom: 14px;"
		/>
		<h2 v-else class="tw-text-h3 tw-mb-1 tw-truncate">
			<router-link
				:to="`/lend/${loanId}`"
				v-kv-track-event="['portfolio', 'click', 'recent-loans', borrowerNameForUrl, loanId]"
			>
				{{ borrowerName }}
			</router-link>
		</h2>
		<!-- progress bar -->
		<kv-loading-placeholder
			v-if="loadingProgress"
			class="tw-mb-1 tw-mx-auto"
			style="height: 8px; max-width: 160px;"
		/>
		<kv-progress-bar
			v-else
			class="tw-mb-0.5 tw-mx-auto"
			style="max-width: 160px;"
			:aria-label="progressDescription"
			:max="1"
			:value="progressPercent"
			:variant="progressVariant"
		/>
		<!-- status -->
		<kv-loading-placeholder
			v-if="loadingProgress"
			class="tw-mb-0.5 tw-mx-auto"
			style="height: 20px; width: 5rem;"
		/>
		<p v-else class="tw-mb-0.5 tw-text-secondary">
			{{ statusDescription }}
		</p>
	</li>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import { paramCase, sentenceCase } from 'change-case';
import delayUntilVisibleMixin from '@/plugins/delay-until-visible-mixin';
import {
	DEFAULTED,
	ENDED,
	EXPIRED,
	FUNDED,
	FUNDRAISING,
	PAYING_BACK,
	RAISED,
	REFUNDED,
} from '@/api/fixtures/LoanStatusEnum';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';

const DELINQUENT = 'payingBackDelinquent';

export default {
	name: 'RecentLoanItem',
	inject: ['apollo'],
	mixins: [delayUntilVisibleMixin],
	components: {
		KvLoadingPlaceholder,
		KvProgressBar,
	},
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			loading: true,
			loadingProgress: true,
			imageUrl: '',
			imageRetinaUrl: '',
			borrowerName: '',
			fundedPercent: 0,
			repaidPercent: 0,
			loanStatus: '',
			loanDelinquent: false,
		};
	},
	computed: {
		progressDescription() {
			if ([FUNDRAISING, FUNDED, RAISED].includes(this.loanStatus)) {
				return 'Percent the loan has funded';
			}
			return 'Percent the loan has been paid back';
		},
		progressPercent() {
			switch (this.loanStatus) {
				case FUNDRAISING:
				case FUNDED:
				case RAISED:
					return this.fundedPercent;
				case PAYING_BACK:
				case ENDED:
				case DELINQUENT:
				case DEFAULTED:
					return this.repaidPercent;
				case REFUNDED:
				case EXPIRED:
					return 1;
				default:
					return 0;
			}
		},
		progressVariant() {
			switch (this.loanStatus) {
				case FUNDRAISING:
				case FUNDED:
				case RAISED:
				case PAYING_BACK:
				case ENDED:
					return 'primary';
				case DELINQUENT:
				case REFUNDED:
				case EXPIRED:
					return 'caution';
				case DEFAULTED:
					return 'danger';
				default:
					return 'ghost';
			}
		},
		statusDescription() {
			switch (this.loanStatus) {
				case FUNDRAISING:
				case FUNDED:
				case RAISED:
					return `${numeral(this.progressPercent).format('0%')} funded`;
				case PAYING_BACK:
				case ENDED:
					return `${numeral(this.progressPercent).format('0%')} repaid`;
				case DELINQUENT:
					return 'Behind on payments';
				case REFUNDED:
				case EXPIRED:
				case DEFAULTED:
					return sentenceCase(this.loanStatus);
				default:
					return '';
			}
		},
		imageAlt() {
			return `Photo of ${this.borrowerName}`;
		},
		borrowerNameForUrl() {
			return paramCase(this.borrowerName);
		},
	},
	methods: {
		fetchBasicInfo() {
			if (this.loading) {
				this.apollo.query({
					query: gql`query recentLoanItemBasic($loanId: Int!) {
						lend {
							loan(id: $loanId) {
								id
								name
								image {
									id
									default: url(customSize:"s140")
									retina: url(customSize:"s280")
								}
							}
						}
					}`,
					variables: {
						loanId: this.loanId,
					},
				}).then(({ data }) => {
					this.loading = false;
					this.imageUrl = data?.lend?.loan?.image?.default ?? '';
					this.imageRetinaUrl = data?.lend?.loan?.image?.retina ?? '';
					this.borrowerName = data?.lend?.loan?.name ?? '';
				});
			}
		},
		fetchProgress() {
			if (this.loadingProgress) {
				this.apollo.query({
					query: gql`query recentLoanItemBasic($loanId: Int!) {
						lend {
							loan(id: $loanId) {
								id
								status
								delinquent
								loanAmount
								loanFundraisingInfo {
									fundedAmount
									reservedAmount
								}
								paidAmount
							}
						}
					}`,
					variables: {
						loanId: this.loanId,
					},
				}).then(({ data }) => {
					this.loadingProgress = false;

					this.loanDelinquent = data?.lend?.loan?.delinquent ?? false;

					this.loanStatus = data?.lend?.loan?.status ?? '';
					if (this.loanDelinquent && this.loanStatus === PAYING_BACK) {
						this.loanStatus = DELINQUENT;
					}

					const loanAmount = numeral(data?.lend?.loan?.loanAmount ?? 1);
					const funded = numeral(data?.lend?.loan?.loanFundraisingInfo?.fundedAmount ?? 0);
					const reserved = numeral(data?.lend?.loan?.loanFundraisingInfo?.reservedAmount ?? 0);
					this.fundedPercent = (funded.value() + reserved.value()) / loanAmount.value();

					const paid = numeral(data?.lend?.loan?.paidAmount ?? 0);
					this.repaidPercent = paid.value() / loanAmount.value();
				});
			}
		},
	},
	watch: {
		// Once loan id is not 0, wait for the component to be visible to start loading the loan info
		loanId: {
			handler(loanId) {
				this.$nextTick(() => {
					if (loanId > 0 && !this.delayUntilVisibleObserver) {
						this.delayUntilVisible(() => {
							this.fetchBasicInfo();
							this.fetchProgress();
						});
					}
				});
			},
			immediate: true,
		},
	},
};
</script>
