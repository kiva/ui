<template>
	<div class="row row-container">
		<h1 class="text-center kiva-green show-for-large large-12 column why-kiva-text">
			Why Kiva?
		</h1>
		<img class="map-background" src="@/assets/images/world-map-simple.svg">
		<div class="small-12 large-6 column text-center info-block">
			<h2 class="kiva-green">
				<span class="large-number">{{ repaymentRateFormatted }}% </span>
				repayment rate
			</h2>
			<p class="kiva-text-grey">
				It's a loan not a donation;<br>
				so when you're repaid you<br>
				can use the money again.
			</p>
		</div>
		<div class="small-12 large-6 column text-center info-block">
			<h2 class="kiva-green">
				<span class="large-number">100%</span>
				goes to the field
			</h2>
			<p class="kiva-text-grey">
				Your voluntary donations and<br>
				our incredible partners<br>
				make this possible.
			</p>
		</div>
		<div class="small-12 column text-center info-block">
			<!-- <span>
				<kv-icon name="star" class="kiva-green star" />
				<kv-icon name="star" class="kiva-green star" />
				<kv-icon name="star" class="kiva-green star" />
				<kv-icon name="star" class="kiva-green star" />
			</span>
			<p class="kiva-text-grey">
				Charity Navigator's<br>
				highest award rating
			</p> -->
			<h2 class="kiva-green">
				<span class="large-number">{{ numLendersFormated }}</span>
				million lenders
			</h2>
		</div>
		<div class="small-12 large-6 column text-center stats-block">
			<h2 class="kiva-green">
				<span class="large-number">{{ totalLoansInDollarsFormatted }}</span>
				billion in loans
			</h2>
		</div>
		<div class="small-12 large-6 column text-center stats-block">
			<h2 class="kiva-green">
				<span class="hide-for-large">in</span>
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
// import KvIcon from '@/components/Kv/KvIcon';
import whyKivaQuery from '@/graphql/query/whyKivaData.graphql';
import getCacheKey from '@/util/getCacheKey';

export default {
	name: 'WhyKiva',
	serverCacheKey: () => getCacheKey('WhyKiva'),
	components: {
		// KvIcon
	},
	inject: ['apollo'],
	data() {
		return {
			repaymentRate: '',
			totalLoansInDollars: '',
			numCountries: '',
			numLenders: '',
		};
	},
	apollo: {
		query: whyKivaQuery,
		preFetch: true,
		result({ data }) {
			this.repaymentRate = _get(data, 'general.kivaStats.repaymentRate');
			this.totalLoansInDollars = _get(data, 'general.kivaStats.amountFunded');
			this.numCountries = _get(data, 'general.kivaStats.numCountries');
			this.numLenders = _get(data, 'general.kivaStats.numLenders');
		}
	},
	computed: {
		numLendersFormated() {
			// numeral's .format almost gives us what we want, but we need to strip
			// the "m" at the end of the formatted numeral return.
			return numeral(this.numLenders).format('0.0a').slice(0, -1);
		},
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

.row-container {
	position: relative;
	overflow: hidden;
	margin-bottom: 2rem;

	img.map-background {
		position: absolute;
		background-image: url('~@/assets/images/world-map-simple.svg');
		background-repeat: no-repeat;
		opacity: 0.1;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		min-width: rem-calc(643);
	}

	.why-kiva-text {
		margin-bottom: 2.4rem;
	}

	.info-block {
		padding-bottom: 1.875rem;
	}

	.stats-block {
		@include breakpoint(large) {
			padding: 4.5% 0 9%;
		}
	}

	h2 {
		font-size: 1.3125rem;
		line-height: 1.6875rem;
		font-weight: 400;

		@include breakpoint(large) {
			font-size: 1.625rem;
			line-height: 2.25rem;
		}
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
		font-size: rem-calc(21);

		@include breakpoint(large) {
			font-size: rem-calc(39);
		}
	}

	.kiva-text-grey {
		color: $kiva-text-light;
	}
}

</style>
