<template>
	<section class="statistics section">
		<div class="row">
			<h1
				v-html="statsHeadline"
				class="small-12 large-6 columns statistics__header huge green-emphasis"
			>
			</h1>
			<video
				:src="statsVideo.file.url"
				class="statistics__video-wrapper--video small-12 large-6 columns"
				autoplay
				loop
				muted
				playsinline
			></video>
		</div>
		<div class="row statistics__stat-block">
			<div
				v-for="(statBlock, index) in statsBlockText"
				:key="statBlock.key"
				class="small-12 medium-4 columns"
			>
				<img
					v-if="statBlock.image.url"
					:class="'statistics__stat-block--icon statistics__stat-block--icon-' + index"
					:src="statBlock.image.url"
					:alt="statBlock.image.description"
				>
				<p
					class="statistics__stat-block--stat green-emphasis"
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
			const icons = this.content?.media ?? [];
			return icons.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			}));
		},
		statsVideo() {
			// Grabbing the 2x video from contentful.
			// this.content?.media[3] is the 1x video
			const video = this.content?.media[4] ?? [];
			return video;
		},
		totalLoansInDollarsFormatted() {
			const part1 = [];
			const part2 = [];
			const contentfulTextString = this.statsBlockText[0].copy;
			const loansInDollarsFormatted = numeral(this.totalLoansInDollars).format('$0.0a').slice(0, -1);
			const stringSplit = contentfulTextString.split('{value}');
			part1.push(stringSplit[0]);
			part2.push(stringSplit[1]);
			const finalString = part1 + loansInDollarsFormatted + part2;

			return finalString;
		},
		repaymentRateFormatted() {
			const part1 = [];
			const part2 = [];
			const contentfulTextString = this.statsBlockText[1].copy;
			const repaymentRateFormatted = `${numeral(this.repaymentRate).format('0')}%`;
			const stringSplit = contentfulTextString.split('{value}');
			part1.push(stringSplit[0]);
			part2.push(stringSplit[1]);
			const finalString = part1 + repaymentRateFormatted + part2;

			return finalString;
		},
		numCountriesAndLendersFormatted() {
			const part1 = [];
			const part2 = [];
			const part3 = [];
			const contentfulTextString = this.statsBlockText[2].copy;
			const numberOfLendersFormatted = numeral(this.numLenders).format('0.0b').slice(0, -1);
			const stringSplit = contentfulTextString.split('{value}');
			part1.push(stringSplit[0]);
			part2.push(stringSplit[1]);
			part3.push(stringSplit[2]);
			const finalString = part1 + this.numCountries + part2 + numberOfLendersFormatted + part3;

			return finalString;
		},
		formattedTextStrings() {
			return [
				this.totalLoansInDollarsFormatted,
				this.repaymentRateFormatted,
				this.numCountriesAndLendersFormatted
			];
		}
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

	&__stat-block {
		margin-top: rem-calc(40);

		&--icon {
			margin-bottom: rem-calc(20);
		}

		&--icon-0 {
			width: rem-calc(44);
		}

		&--icon-1 {
			width: rem-calc(48);
		}

		&--icon-2 {
			width: rem-calc(42);
		}

		&--stat {
			font-size: rem-calc(21);

			&::v-deep i {
				color: $kiva-green;
				font-weight: bold;
			}
		}
	}
}
</style>
