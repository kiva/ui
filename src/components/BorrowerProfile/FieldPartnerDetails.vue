<template>
	<section>
		<h2>
			{{ partnerName }}
		</h2>
		<dl class="tw-mb-4">
			<description-list-item
				:term="'Average cost to borrower'"
				:details="avgBorrowerCostFormatted"
				@show-definition="$emit('show-definition',
					{cid: 'bp-def-average-cost-to-borrower', sfid: '50150000000T2J1'})"
			/>
			<description-list-item
				:term="'Profitability (return on assets)'"
				:details="avgProfitabilityFormatted"
				@show-definition="$emit('show-definition',
					{cid: 'bp-def-probablility-roa', sfid: '50150000000S17h'})"
			/>
			<description-list-item
				:term="'Delinquency rate'"
				:details="delinquencyRateFormatted"
				@show-definition="$emit('show-definition',
					{cid: 'bp-def-delinquency-rate', sfid: '50150000000SQF1'})"
			/>
			<description-list-item
				:term="'Loans at risk rate'"
				:details="loansAtRiskRateFormatted"
				@show-definition="$emit('show-definition',
					{cid: 'bp-def-loans-at-risk-rate', sfid: '50150000000SQI0'})"
			/>
			<description-list-item
				:term="'Default rate'"
				:details="defaultRateFormatted"
				@show-definition="$emit('show-definition',
					{cid: 'bp-def-default-rate', sfid: '50150000000S8gT'})"
			/>
			<description-list-item
				:term="'Currency exchange loss rate'"
				:details="currencyExchangeLossRateFormatted"
				@show-definition="$emit('show-definition',
					{cid: 'bp-def-currency-exchange-loss-rate', sfid: '50150000000S186'})"
			/>
			<div class="tw-flex tw-mb-1.5">
				<dt class="tw-flex-1 tw-mb-0">
					<button
						class="tw-underline tw-font-book"
						@click="$emit('show-definition',
							{cid: 'bp-def-risk-rating', sfid: '50150000000s2YH'})"
					>
						Field Partner risk rating
					</button>
				</dt>
				<dd>
					<div class="tw-flex">
						<kv-material-icon
							v-for="i in 5"
							:key="i"
							class="tw-text-black"
							:icon="getStarIcon(i)"
						/>
					</div>
				</dd>
			</div>
		</dl>

		<kv-text-link
			icon="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
			:to="`/partners/${partnerId}`"
		>
			More about {{ partnerName }}
		</kv-text-link>
	</section>
</template>

<script>
import numeral from 'numeral';
import DescriptionListItem from '@/components/BorrowerProfile/DescriptionListItem';
import { mdiStar, mdiStarOutline, mdiStarHalfFull } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvTextLink from '~/@kiva/kv-components/vue/KvTextLink';

export default {
	components: {
		DescriptionListItem,
		KvMaterialIcon,
		KvTextLink,
	},
	data() {
		return {
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
