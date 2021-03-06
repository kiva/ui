<template>
	<section class="statistics section">
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
		<div class="row stat-block">
			<div
				v-for="(statBlock, index) in statsBlockText"
				:key="statBlock.key"
				class="small-12 medium-4 columns"
			>
				<kv-contentful-img
					v-if="statBlock.image.url"
					:class="'stat-block__icon stat-block__icon-' + index"
					:contentful-src="statBlock.image.url"
					:alt="statBlock.image.description"
					fallback-format="png"
					:width="48"
					:height="48"
				/>
				<p
					class="stat-block__stat green-emphasis"
					v-html="formattedTextStrings[index]"
				>
				</p>
			</div>
		</div>
	</section>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import KvContentfulImg from '@/components/Kv/KvContentfulImg';
import whyKivaQuery from '@/graphql/query/whyKivaData.graphql';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
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
		preFetch: false,
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
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-statistics-headline-text') > -1);
		},
		statsHeadline() {
			return this.statsText.headline;
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
			// Attempted to be more specific by using the title to pull in the content,
			// but wasn't able to get this working
			// const icons = this.content?.media?.filter(({ key }) => key.indexOf('homepage-stats-icon') > -1);

			const icons = this.content?.media ?? [];
			return icons.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			}));
		},
		statsVideo() {
			// Attempted to be more specific by using the title to pull in the content,
			// but wasn't able to get this working
			// eslint-disable-next-line max-len
			// const video = this.content?.media?.find(({ key }) => key.indexOf('homepage-statistics-video-1x') > -1);

			// eslint-disable-next-line max-len
			// Grabbing the 1x video from contentful. 2x video = 'homepage-statistics-video-2x' || this.content?.media[3]
			const video = this.content?.media[3] ?? [];
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

			return this.buildDynamicString(startingString, '{value}', [loansInDollarsFormatted]);
		},
		repaymentRateFormatted() {
			const startingString = this.statsBlockText[1]?.copy || '';
			const repaymentRateValueFormatted = `${numeral(this.repaymentRate).format('0')}%`;

			if (startingString === '' || repaymentRateValueFormatted === '0%') {
				return '';
			}

			return this.buildDynamicString(startingString, '{value}', [repaymentRateValueFormatted]);
		},
		numCountriesAndLendersFormatted() {
			const startingString = this.statsBlockText[2]?.copy || '';
			const numberOfLendersFormatted = numeral(this.numLenders).format('0.0b').slice(0, -1);

			if (startingString === '' || numberOfLendersFormatted === '0.0' || !this.numCountries) {
				return '';
			}

			return this.buildDynamicString(startingString, '{value}', [this.numCountries, numberOfLendersFormatted]);
		},
		formattedTextStrings() {
			return [
				this.totalLoansInDollarsFormatted,
				this.repaymentRateFormatted,
				this.numCountriesAndLendersFormatted
			];
		},
	},
	methods: {
		buildDynamicString(sourceString = '', splitKey = '', dynamicValues = []) {
			if (typeof sourceString !== 'string') {
				return '';
			}
			let finalString = '';
			// split the source string where it finds the splitKey
			const stringSplit = sourceString.split(splitKey);
			// forEach with index of the sourceString
			stringSplit.forEach((item, index) => {
				finalString = finalString.concat(item);
				// if there's a dyanmic value at the current index, proceed adding it
				// to the finalString
				if (dynamicValues[index]) {
					finalString = finalString.concat(dynamicValues[index]);
				}
			});
			return finalString;
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.statistics {
	&::v-deep em {
		font-style: normal;
		color: $kiva-green;
	}

	&__header {
		font-size: 4rem;
		font-weight: 600;
		line-height: rem-calc(73.6);
	}

	&__video-wrapper {
		&--video {
			width: 100%;
			border-radius: rem-calc(10);
		}
	}

	.stat-block {
		margin-top: rem-calc(40);

		&__icon {
			margin-bottom: rem-calc(20);
		}

		&__stat {
			font-size: rem-calc(21);

			&::v-deep i {
				color: $kiva-green;
				font-weight: bold;
			}
		}
	}
}
</style>
