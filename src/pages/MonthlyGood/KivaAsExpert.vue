<template>
	<div class="kiva-as-expert-section-wrapper" id="kiva-as-expert">
		<div class="row">
			<div class="small-12 columns">
				<h2 class="impact-text">
					{{ yearsSinceStartCalc }} years, ${{ amountFunded }} billion in impact
				</h2>
			</div>
			<div class="small-12 large-7 columns">
				<p>
					<!-- eslint-disable-next-line max-len -->
					With nearly ${{ amountFunded }} billion in loans funded, Kiva is a leading global nonprofit creating opportunity for communities in need around the world. Your support will help us continue to push boundaries. Join the movement of <strong>{{ numLenders }} million lenders</strong> who’ve supported <strong>{{ numBorrowers }} million borrowers</strong>.
				</p>
				<kv-responsive-image
					:images="billionImpactImages"
					class="hide-for-large community-image"
					:alt="`${yearsSinceStartCalc} years, ${amountFunded} billion in impact`"
				/>
				<slot name="form"></slot>
			</div>

			<div class="large-5 columns">
				<kv-responsive-image
					:images="billionImpactImages"
					class="show-for-large community-image"
					:alt="`${yearsSinceStartCalc} years, ${amountFunded} billion in impact`"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import { differenceInYears } from 'date-fns';
import homepageStatistics from '@/graphql/query/whyKivaData.graphql';

const billionImpactImagesRequire = require.context('@/assets/images/10-years-billion-impact', true);
const million = 1000000;
const billion = 1000000000;

export default {
	components: {
		KvResponsiveImage
	},
	data() {
		return {
			billionImpactImages: [
				['small', billionImpactImagesRequire('./10-years-billion-impact_ghost.jpg')],
				['small retina', billionImpactImagesRequire('./10-years-billion-impact_2x_ghost.jpg')],
			],
			// sensible defaults in the format returned by endpoint
			amountFunded: 1.5 * billion,
			numLenders: 1.9 * million,
			numBorrowers: 3.8 * million,

		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: homepageStatistics,
		preFetch: true,
		result({ data }) {
			const rawAmountFunded = data?.general?.kivaStats?.amountFunded;
			const rawNumLenders = data?.general?.kivaStats?.numLenders;
			const rawNumBorrowers = data?.general?.kivaStats?.numBorrowers;
			// Only modify component values on valid values
			if (!Number.isNaN(Number(rawAmountFunded))) {
				this.amountFunded = numeral(rawAmountFunded).divide(billion).format('0.0');
			}
			if (!Number.isNaN(Number(rawNumLenders))) {
				this.numLenders = numeral(rawNumLenders).divide(million).format('0.0');
			}
			if (!Number.isNaN(Number(rawNumBorrowers))) {
				this.numBorrowers = numeral(rawNumBorrowers).divide(million).format('0.0');
			}
		},
	},
	computed: {
		yearsSinceStartCalc() {
			// Kiva was formally registered as a
			// non-profit on October 12, 2005
			const foundedDate = new Date(2005, 10, 12);
			return differenceInYears(Date.now(), foundedDate);
		},
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.kiva-as-expert-section-wrapper {
	padding: 2rem 0 3rem;
	background-color: $ghost;

	h2 {
		color: $kiva-green;
		margin-bottom: 1.85rem;
	}

	.community-image {
		padding: 1.25rem;
		width: 100%;
	}

	.hide-for-large.community-image {
		max-width: 25rem;
		display: block;
		margin: 0 auto;
	}

	::v-deep form {
		margin-top: 2.5rem;
	}
}
</style>
