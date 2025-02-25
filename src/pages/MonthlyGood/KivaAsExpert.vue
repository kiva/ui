<template>
	<div
		class="kiva-as-expert-section-wrapper tw-bg-secondary
			tw-py-4 md:tw-py-6 lg:tw-py-8"
		id="kiva-as-expert"
	>
		<div class="row">
			<div class="small-12 columns">
				<h2 class="tw-text-h1 tw-mb-4">
					{{ title }}
				</h2>
			</div>
			<div class="small-12 large-7 columns">
				<p class="tw-mb-4" v-html="description"></p>
				<kv-responsive-image
					:images="billionImpactImages"
					class="hide-for-large community-image tw-mb-4"
					:alt="title"
				/>
				<slot name="form"></slot>
			</div>
			<div class="large-5 columns">
				<kv-responsive-image
					:images="billionImpactImages"
					class="show-for-large community-image"
					:alt="title"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { differenceInYears } from 'date-fns';
import numeral from 'numeral';
import KvResponsiveImage from '#src/components/Kv/KvResponsiveImage';
import homepageStatistics from '#src/graphql/query/whyKivaData.graphql';
import { metaGlobReader } from '#src/util/importHelpers';
import logFormatter from '#src/util/logFormatter';

const billionImpactImagesGlob = import.meta.glob('/src/assets/images/10-years-billion-impact/*.*', { eager: true });
const billionImpactImagesRequire = metaGlobReader(
	billionImpactImagesGlob,
	'/src/assets/images/10-years-billion-impact/'
);
const million = 1000000;
const billion = 1000000000;

export default {
	name: 'KivaAsExpert',
	components: {
		KvResponsiveImage
	},
	data() {
		return {
			billionImpactImages: [
				['small', billionImpactImagesRequire('10-years-billion-impact_ghost.jpg')],
				['small retina', billionImpactImagesRequire('10-years-billion-impact_2x_ghost.jpg')],
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
				try {
					this.amountFunded = numeral(rawAmountFunded).divide(billion).format('0.0');
				} catch (error) {
					this.amountFunded = '';

					logFormatter('KivaAsExpert error in amountFunded', error);
				}
			}
			if (!Number.isNaN(Number(rawNumLenders))) {
				try {
					this.numLenders = numeral(rawNumLenders).divide(million).format('0.0');
				} catch (error) {
					this.numLenders = '';

					logFormatter('KivaAsExpert error in numLenders', error);
				}
			}
			if (!Number.isNaN(Number(rawNumBorrowers))) {
				try {
					this.numBorrowers = numeral(rawNumBorrowers).divide(million).format('0.0');
				} catch (error) {
					this.numBorrowers = '';

					logFormatter('KivaAsExpert error in numBorrowers', error);
				}
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
		title() {
			// eslint-disable-next-line max-len
			return `${this.yearsSinceStartCalc} years, ${this.amountFunded ? `${this.amountFunded} billion in impact` : 'billions of dollars in impact'}`;
		},
		description() {
			let desc = 'With billions of dollars in loans funded';
			if (this.amountFunded) {
				desc = `With nearly ${this.amountFunded} billion`;
			}

			// eslint-disable-next-line max-len
			return `${desc}, Kiva is a leading global nonprofit creating opportunity for communities in need around the world. Your support will help us continue to push boundaries. Join the movement of <strong>${this.numLenders} million lenders</strong> who’ve supported <strong>${this.numBorrowers} million borrowers</strong>.`;
		},
	}
};

</script>

<style lang="scss" scoped>
@import '#src/assets/scss/settings';

.kiva-as-expert-section-wrapper {
	.community-image {
		padding: 1.25rem;
		width: 100%;
	}

	.hide-for-large.community-image {
		max-width: 25rem;
		display: block;
		margin: 0 auto;
	}
}
</style>
