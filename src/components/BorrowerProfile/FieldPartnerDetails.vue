<template>
    <section v-if="isPartnerLoan">
        <!-- eslint-disable-next-line max-len -->
        <p>
            Field partners are local organizations working in communities to vet borrowers, provide services, and administer loans on the ground.
        </p>
        <h2>
            {{ partnerName }}
        </h2>
        <dl>
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
            <div class="tw-flex tw-mb-2">
                <dt class="tw-flex-1">
                    <button class="tw-underline">
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
            class="tw-uppercase"
        >
            More about {{ partnerName }} &rarr;
        </router-link>
    </section>
</template>

<script>
import numeral from 'numeral';
import DescriptionListItem from '@/components/BorrowerProfile/DescriptionListItem';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import { mdiStar, mdiStarOutline, mdiStarHalfFull } from '@mdi/js';
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
        distributionModel: { // LoanBasic.distributionModel
            type: String,
            default: '',
        },
    },
    computed: {
        isPartnerLoan() {
            return this.distributionModel === 'field_partner';
        },
        avgBorrowerCostFormatted() {
            return this.avgBorrowerCost !== 0
                ? numeral(this.avgBorrowerCost).format('0%') + ' PY'
                : 'N/A';
        },
        avgProfitabilityFormatted() {
            return numeral(this.avgProfitability).format('0%');
        },
        delinquencyRateFormatted() {
            return numeral(this.arrearsRate).format('0%');
        },
        loansAtRiskRateFormatted() {
            return numeral(this.loansAtRiskRate).format('0%');
        },
        defaultRateFormatted() {
            return numeral(this.defaultRate).format('0%');
        },
        currencyExchangeLossRateFormatted() {
            return numeral(this.currencyExchangeLossRate).format('0%');
        },
        riskRatingFormatted() {
            return numeral(this.riskRating).format('0%');
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
