<template>
	<div class="row main-row">
		<h1 class="text-center kiva-green show-for-large large-12 column">
			Why Kiva?
		</h1>
		<div class="small-12 large-6 column text-center">
			<h2 class="kiva-green">
				<span class="large-number">{{ repaymentRateFormatted }}% </span>
				repayment rate
			</h2>
			<p class="kiva-text-grey">
				It's a loan not a donation; so when you're repaid you can use the money again.
			</p>
		</div>
		<div class="small-12 large-6 column text-center">
			<h2 class="kiva-green">
				<span class="large-number">100%</span>
				goes to the field
			</h2>
			<p class="kiva-text-grey">
				Your voluntary donations and our incredible partners make this possible.
			</p>
		</div>
		<div class="small-12 large-6 column text-center">
			<span>
				<kv-icon name="star" class="kiva-green star" />
				<kv-icon name="star" class="kiva-green star" />
				<kv-icon name="star" class="kiva-green star" />
				<kv-icon name="star" class="kiva-green star" />
			</span>
			<p class="kiva-text-grey">
				Charity Navigator's highest award rating
			</p>
		</div>
		<div class="small-12 large-6 column text-center">
			<h2 class="kiva-green">
				<span class="large-number">{{ totalLoansInDollarsFormatted }}</span>
				billion in loans
			</h2>
		</div>
		<div class="small-12 large-6 column text-center">
			<h2 class="kiva-green">
				<span class="large-number">{{ numCountries }}</span>
				countries
			</h2>
		</div>
		<p class="show-for-large column large-12 text-center">
			<router-link
				:to="`/about`"
				class="kiva-text-grey"
				v-kv-track-event="['homepage', 'click-Learn more', 'homepage-learn-more-link', 'true']"
			>
				Learn more
			</router-link>
		</p>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import KvIcon from '@/components/Kv/KvIcon';
import homepageQuery from '@/graphql/query/homepage.graphql';

export default {
	components: {
		KvIcon,
	},
	inject: ['apollo'],
	data() {
		return {
			repaymentRate: '',
			totalLoansInDollars: '',
			numCountries: ''
		};
	},
	apollo: {
		query: homepageQuery,
		result({ data }) {
			this.repaymentRate = _get(data, 'general.kivaStats.repaymentRate');
			this.totalLoansInDollars = _get(data, 'general.kivaStats.amountFunded');
			this.numCountries = _get(data, 'general.kivaStats.numCountries');
		}
	},
	computed: {
		repaymentRateFormatted() {
			return numeral(this.repaymentRate).format('0.0');
		},
		totalLoansInDollarsFormatted() {
			// numeral's .format almost gives us what we want, but we need to strip
			// the "b" at the end of the formatted numeral return.
			let roundedValue = numeral(this.totalLoansInDollars).format('$0.0a');
			roundedValue = roundedValue.slice(0, -1);
			return roundedValue;
		}
	}

};
</script>

<style lang="scss" scoped>
@import 'settings';

img.map-background {
	opacity: 0.1;
	position: absolute;
	width: 70%;
}

.kiva-green {
	color: $kiva-green;
}

.star {
	fill: none;
	height: rem-calc(20);
	width: rem-calc(20);
}

.large-number {
	font-size: rem-calc(39);
}

.kiva-text-grey {
	color: $kiva-text-light;
}

.main-row {
	background-image: url("@/assets/images/world-map-simple.svg");
}

</style>
