<template>
	<div>
		<kv-hero>
			<template #images>
				<kv-responsive-image :images="twelveDaysImages" alt="Be a part of Possibility: 12 Days of Lending" />
			</template>
		</kv-hero>
		<div class="row intro">
			<div class="tw-text-center columns large-10 large-offset-1">
				<p>
					Join us in a series of daily challenges to amplify your impact! Check back every morning
					to see what surprises we have up our sleeves. Can't wait? Click below to support
					a borrower and be a part of possibility.
				</p>
				<router-link
					to="/lend-by-category"
					class="cta-link"
					v-kv-track-event="['possibiliy', 'click-intro-link', '12-days-of-lending']"
				>
					Lend now
				</router-link>
			</div>
		</div>
		<div class="row column calendar">
			<twelve-days-calendar :advent-day="adventDay" :promo-enabled="promoEnabled" />
		</div>

		<!-- Kiva Content Block -->
		<div class="row kiva-stories">
			<div class="columns small-12 large-10 large-offset-1">
				<kiva-content-block />
			</div>
		</div>
		<br><br>
	</div>
</template>

<script>
import _get from 'lodash/get';
import contentfulEntries from '@/graphql/query/contentfulEntries.graphql';
import KvHero from '@/components/Kv/KvHero';
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';
import KivaContentBlock from '@/pages/Possibility/KivaContentBlock';
import TwelveDaysCalendar from './TwelveDaysCalendar';

const possibilitiesImageRequire = require.context('@/assets/images/possibilities-banners/', true);

export default {
	name: '12DaysOfLending',
	components: {
		KvHero,
		KvResponsiveImage,
		TwelveDaysCalendar,
		KivaContentBlock,
	},
	metaInfo: {
		title: '12 Days of Lending'
	},
	data() {
		return {
			promoEnabled: true,
			twelveDaysImages: [
				['small', possibilitiesImageRequire('./Phase2-sm-std.jpg')],
				['small retina', possibilitiesImageRequire('./Phase2-sm-retina.jpg')],
				['medium', possibilitiesImageRequire('./Phase2-med-std.jpg')],
				['medium retina', possibilitiesImageRequire('./Phase2-med-retina.jpg')],
				['large', possibilitiesImageRequire('./Phase2-lg-std.jpg')],
				['large retina', possibilitiesImageRequire('./Phase2-lg-retina.jpg')],
				['xga', possibilitiesImageRequire('./Phase2-xl-std.jpg')],
				['xga retina', possibilitiesImageRequire('./Phase2-xl-retina.jpg')],
				['wxga', possibilitiesImageRequire('./Phase2-xxl-std.jpg')],
				['wxga retina', possibilitiesImageRequire('./Phase2-xxl-retina.jpg')]
			],
		};
	},
	inject: ['apollo'],
	created() {
		this.apollo.query({
			query: contentfulEntries,
			variables: {
				contentType: 'uiSetting',
				contentKey: 'ui-global-promo',
			}
		}).then(({ data }) => {
			const pdtDateString = this.getPdtDate().toDateString();
			const uiGlobalPromoSetting = _get(data, 'contentful.entries.items', []).find(item => item.fields.key === 'ui-global-promo'); // eslint-disable-line max-len

			const todaysLimitedPromo = uiGlobalPromoSetting.fields.content.find(promo => {
				return new Date(promo.fields.startDate).toDateString() === pdtDateString;
			});

			if (todaysLimitedPromo) {
				this.promoEnabled = todaysLimitedPromo.fields.active;
			}
		});
	},
	computed: {
		adventDay() {
			const pdtDate = this.getPdtDate();
			const day = pdtDate.getDate();
			const month = pdtDate.getMonth() + 1; // getMonth is 0 based
			const year = pdtDate.getFullYear();

			let adventDay = 0; // show all entries as unopened
			if (year === 2019 && month === 12 && day >= 14) {
				adventDay = day - 13; // Day 1 of the advent calendar is Dec 14
			} else if ((month === 12 && day > 25) || year === 2020) {
				adventDay = 13; // show all entries as opened
			}

			return adventDay;
		}
	},
	methods: {
		getPdtDate() {
			const pdtOffsetHours = -8; // hours offset from UTC
			const clientOffsetHours = new Date().getTimezoneOffset() / 60;
			const offsetMs = (pdtOffsetHours + clientOffsetHours) * 60 * 60 * 1000;
			return new Date(Date.now() + offsetMs);
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

$cta-color: #02582e;

.intro,
.calendar {
	margin-bottom: 4rem;
}

.cta-link {
	color: $cta-color;
	font-weight: $global-weight-bold;
}
</style>
