<template>
	<section class="tw-prose">
		<h2>
			{{ partnerName }}
		</h2>
		<dl class="tw-mb-4">
			<description-list-item
				data-testid="bp-field-partner-details-avg-cost"
				:term="'Average cost to borrower'"
				:details="avgBorrowerCostFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-average-cost-to-borrower',
					sfid: '50150000000T2J1',
					panelName: 'Field-Partner',
					linkText: 'Average cost to borrower'
				})"
			/>
			<description-list-item
				data-testid="bp-field-partner-details-profitability"
				:term="'Profitability (return on assets)'"
				:details="avgProfitabilityFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-probablility-roa',
					sfid: '50150000000S17h',
					panelName: 'Field-Partner',
					linkText: 'Profitability (return on assets)'
				})"
			/>
			<description-list-item
				data-testid="bp-field-partner-details-delinquency-rate"
				:term="'Delinquency rate'"
				:details="delinquencyRateFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-delinquency-rate',
					sfid: '50150000000SQF1',
					panelName: 'Field-Partner',
					linkText: 'Delinquency rate'
				})"
			/>
			<description-list-item
				data-testid="bp-field-partner-details-loans-risk-rate"
				:term="'Loans at risk rate'"
				:details="loansAtRiskRateFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-loans-at-risk-rate',
					sfid: '50150000000SQI0',
					panelName: 'Field-Partner',
					linkText: 'Loans at risk rate'
				})"
			/>
			<description-list-item
				data-test-id="bp-field-partner-details-default-rate"
				:term="'Default rate'"
				:details="defaultRateFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-default-rate',
					sfid: '50150000000S8gT',
					panelName: 'Field-Partner',
					linkText: 'Default rate'
				})"
			/>
			<description-list-item
				data-test-id="bp-field-partner-details-currency-loss"
				:term="'Currency exchange loss rate'"
				:details="currencyExchangeLossRateFormatted"
				@show-definition="$emit('show-definition', {
					cid: 'bp-def-currency-exchange-loss-rate',
					sfid: '50150000000S186',
					panelName: 'Field-Partner',
					linkText: 'Currency exchange loss rate'
				})"
			/>
			<div class="tw-flex tw-mb-1.5" data-testid="bp-field-partner-details-partner-risk-rate">
				<dt class="tw-flex-1 tw-mb-0">
					<button
						class="tw-underline tw-font-book"
						data-testid="bp-details-lightbox-btn"
						@click="$emit('show-definition', {
							cid: 'bp-def-risk-rating',
							sfid: '50150000000s2YH',
							panelName: 'Field-Partner',
							linkText: 'Field Partner risk rating'
						})"
					>
						Lending Partner risk rating
					</button>
				</dt>
				<dd>
					<div class="tw-flex" data-testid="bp-details-value">
						<kv-material-icon
							v-for="i in 5"
							:key="i"
							class="tw-text-primary tw-w-3 tw-h-3"
							:icon="getStarIcon(i)"
						/>
					</div>
				</dd>
			</div>
		</dl>

		<kv-text-link
			data-testid="bp-field-partner-details-more-about"
			:icon="mdiArrowRight"
			:href="`/partners/${partnerId}`"
			target="_blank"
			v-kv-track-event="[
				'Borrower profile',
				'click-Field-Partner-tab',
				`More about ${partnerName }`
			]"
		>
			More about {{ partnerName }}
		</kv-text-link>
	</section>
</template>

<script>
import {
	mdiArrowRight,
	mdiStar,
	mdiStarOutline,
	mdiStarHalfFull
} from '@mdi/js';
import numeral from 'numeral';
import DescriptionListItem from '@/components/BorrowerProfile/DescriptionListItem';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

export default {
	name: 'FieldPartnerDetails',
	components: {
		DescriptionListItem,
		KvMaterialIcon,
		KvTextLink,
	},
	data() {
		return {
			mdiArrowRight,
			mdiStar,
			mdiStarOutline,
			mdiStarHalfFull,
		};
	},
	props: {
		partnerId: { // Partner.id
			type: Number,
			default: 0,
		},
		partnerName: { // Partner.name
			type: String,
			default: '',
		},
		avgBorrowerCost: { // Partner.avgBorrowerCost
			type: Number,
			default: 0,
		},
		avgBorrowerCostType: { // Partner.avgBorrowerCostType
			type: String,
			default: '',
		},
		avgProfitability: { // Partner.avgProfitability
			type: Number,
			default: 0,
		},
		arrearsRate: { // Partner.arrearsRate
			type: Number,
			default: 0,
		},
		loansAtRiskRate: { // Partner.loansAtRiskRate
			type: Number,
			default: 0,
		},
		defaultRate: { // Partner.defaultRate
			type: Number,
			default: 0,
		},
		riskRating: { // Partner.riskRating
			type: Number,
			default: 0,
		},
		currencyExchangeLossRate: { // Partner.currencyExchangeLossRate
			type: Number,
			default: 0,
		}
	},
	computed: {
		avgBorrowerCostFormatted() {
			return this.avgBorrowerCost !== 0
				? `${numeral(this.avgBorrowerCost / 100).format('0%')} ${this.avgBorrowerCostType}`
				: 'N/A';
		},
		avgProfitabilityFormatted() {
			return numeral(this.avgProfitability / 100).format('0[.]0%');
		},
		delinquencyRateFormatted() {
			return numeral(this.arrearsRate / 100).format('0[.]00%');
		},
		loansAtRiskRateFormatted() {
			return numeral(this.loansAtRiskRate / 100).format('0[.]00%');
		},
		defaultRateFormatted() {
			return numeral(this.defaultRate / 100).format('0[.]00%');
		},
		currencyExchangeLossRateFormatted() {
			return numeral(this.currencyExchangeLossRate / 100).format('0[.]00%');
		},
	},
	methods: {
		getStarIcon(index) {
			if (this.riskRating >= index) {
				return this.mdiStar;
			}
			if (this.riskRating === index - 0.5) {
				return this.mdiStarHalfFull;
			}
			return this.mdiStarOutline;
		},
	},
};

</script>
