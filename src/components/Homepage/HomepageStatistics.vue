<template>
	<section class="statistics section">
		<div class="row">
			<h1
				v-html="statsHeadline"
				class="small-12 large-6 columns statistics__header huge green-emphasis"
			>
			</h1>
			<img class="statistics_video small-12 large-6 columns">
		</div>
		<div class="row statistics__block">
			<div
				v-for="(statBlock, index) in statsBlockText"
				:key="statBlock.key"
				class="small-4 columns"
			>
				<img
					v-if="statBlock.image.url"
					:class="'statistics__block--icon statistics__block--icon-' + index"
					:src="statBlock.image.url"
					:alt="statBlock.image.description"
				>
				<p
					class="statistics__block--stat green-emphasis"
					v-html="statBlock.headline"
				>
				</p>
			</div>
		</div>
	</section>
</template>

<script>
export default {
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
				headline: block.headline ?? '',
				image: this.statsIcons[index],
			}));
		},
		statsIcons() {
			const icon = this.content?.media ?? [];
			return icon.map(image => ({
				description: image?.description ?? '',
				title: image?.title ?? '',
				url: image?.file?.url ?? ''
			}));
		},

	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
.statistics {
	&__header {
		max-width: 95%;
	}

	&__block {
		margin-top: 40px;

		&--icon {
			margin-bottom:40px;
		}

		&--icon-0 {
			width: 44px;
		}

		&--icon-1 {
			width: 48px
		}

		&--icon-2 {
			width: 42px;
		}

		&--stat {
			font-size: 21px;
		}
	}
}
</style>
