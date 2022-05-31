<template>
	<section class="statistics">
		<div class="row">
			<h2
				v-html="statsHeadline"
				class="small-12 large-6 columns statistics__header green-emphasis"
			>
			</h2>
			<span class="statistics__video-wrapper small-12 large-6 columns">
				<video
					:src="statsVideo.file.url"
					class="statistics__video-wrapper--video"
					autoplay
					loop
					muted
					playsinline
				></video>
			</span>
		</div>
		<div class="row stats-wrap">
			<div
				v-for="(statBlock, index) in statsBlockText"
				:key="statBlock.key"
				class="small-12 medium-4 columns stats-wrap__block"
			>
				<kv-contentful-img
					v-if="statBlock.image.url"
					:class="'stats-wrap__block--icon stats-wrap__block--icon-' + index"
					:contentful-src="statBlock.image.url"
					:alt="statBlock.image.description"
					fallback-format="png"
					:width="65"
					:height="64"
				/>
				<div
					class="stats-wrap__block--stat green-emphasis"
					v-html="formattedTextStrings[index]"
				>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import whyKivaQuery from '@/graphql/query/whyKivaData.graphql';
import { buildDynamicString } from '@/util/contentfulUtils';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	name: 'HomepageStatistics',
	inject: ['apollo', 'cookieStore'],
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
	components: {
		KvContentfulImg,
	},
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		statsText() {
			// eslint-disable-next-line max-len
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-statistics-headline-text') > -1);
		},
		statsHeadline() {
			return this.statsText?.headline ?? '';
		},
		statsBlockText() {
			// eslint-disable-next-line max-len
			const allStatsText = this.content?.contents?.filter(({ key }) => key.indexOf('homepage-statistics-text') > -1);
			return allStatsText?.map((block, index) => ({
				key: block.key || index,
				copy: documentToHtmlString(block.bodyCopy ?? ''),
				image: this.statsIcons[index],
			}));
		},
		statsIcons() {
			const icons = this.content?.media?.filter(({ title }) => title.indexOf('homepage-stats-icon') > -1);

			return icons.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			}));
		},
		statsVideo() {
			// Grabbing the 1x video from contentful. 2x video = 'homepage-statistics-video-2x'
			// eslint-disable-next-line max-len
			const video = this.content?.media?.find(({ title }) => title.indexOf('homepage-statistics-video-1x') > -1);
			if (video === '') {
				return '';
			}

			return video;
		},
		totalLoansInDollarsFormatted() {
			const startingString = this.statsBlockText[0]?.copy || '';
			const loansInDollarsFormatted = numeral(this.totalLoansInDollars).format('$0.0a').slice(0, -1);

			if (startingString === '' || loansInDollarsFormatted === '$0.') {
				return '';
			}

			return buildDynamicString(startingString, '{value}', [loansInDollarsFormatted]);
		},
		repaymentRateFormatted() {
			const startingString = this.statsBlockText[1]?.copy || '';
			const repaymentRateValueFormatted = `${numeral(this.repaymentRate).format('0')}%`;

			if (startingString === '' || repaymentRateValueFormatted === '0%') {
				return '';
			}

			return buildDynamicString(startingString, '{value}', [repaymentRateValueFormatted]);
		},
		numCountriesAndLendersFormatted() {
			const startingString = this.statsBlockText[2]?.copy || '';
			const numberOfLendersFormatted = numeral(this.numLenders).format('0.0b').slice(0, -1);

			if (startingString === '' || numberOfLendersFormatted === '0.0' || !this.numCountries) {
				return '';
			}

			return buildDynamicString(startingString, '{value}', [this.numCountries, numberOfLendersFormatted]);
		},
		formattedTextStrings() {
			return [
				this.totalLoansInDollarsFormatted,
				this.repaymentRateFormatted,
				this.numCountriesAndLendersFormatted
			];
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.statistics {
	padding: 2rem 0;

	&::v-deep em {
		font-style: normal;
		color: $kiva-green;
	}

	&__header {
		font-size: 3rem;
		font-weight: 500;
		line-height: rem-calc(73.6);
		text-align: center;

		@include breakpoint(large) {
			font-size: 4rem;
			text-align: left;
		}
	}

	&__video-wrapper {
		margin-top: 2.5rem;

		@include breakpoint(large) {
			margin-top: 0;
		}

		&--video {
			width: 100%;
			border-radius: rem-calc(10);
		}
	}

	.stats-wrap {
		margin-top: rem-calc(40);

		&__block {
			margin-bottom: 1rem;
			text-align: center;

			&--icon {
				margin-bottom: rem-calc(20);
			}

			&--stat {
				font-size: rem-calc(21);

				&::v-deep i {
					font-weight: bold;
					font-style: normal;
				}
			}
		}
	}
}
</style>
