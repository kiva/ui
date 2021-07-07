<template>
	<section>
		<p>
			<!-- eslint-disable-next-line max-len -->
			Field partners are local organizations working in communities to vet borrowers, provide services, and administer loans on the ground.
		</p>
		<h2>
			{{ partnerName }}
		</h2>
		<dl class="tw-mb-4">
			<description-list-item
				:term="'Average cost to borrower'"
				:details="avgBorrowerCostFormatted"
			/>
			<description-list-item
				:term="'Profitability (return on assets)'"
				:details="avgProfitabilityFormatted"
			/>
			<description-list-item
				:term="'Delinquency rate'"
				:details="delinquencyRateFormatted"
			/>
			<description-list-item
				:term="'Loans at risk rate'"
				:details="loansAtRiskRateFormatted"
			/>
			<description-list-item
				:term="'Default rate'"
				:details="defaultRateFormatted"
			/>
			<description-list-item
				:term="'Currency exchange loss rate'"
				:details="currencyExchangeLossRateFormatted"
			/>
			<div class="tw-flex tw-mb-1.5">
				<dt class="tw-flex-1 tw-mb-0">
					<button class="tw-underline tw-font-book">
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
		<router-link
			:to="`/partners/${partnerId}`"
			class="tw-text-h4"
		>
			More about {{ partnerName }} &rarr;
		</router-link>
	</section>
</template>

<script>
import numeral from 'numeral';
import DescriptionListItem from '@/components/BorrowerProfile/DescriptionListItem';
import { mdiStar, mdiStarOutline, mdiStarHalfFull } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	components: {
		DescriptionListItem,
		KvMaterialIcon,
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
