<template>
	<section class="homepage-general-stats row align-center tw-text-center">
		<div class="small-12 columns">
			<img
				class="homepage-general-stats__img"
				:src="headerImage.url"
				loading="lazy"
				:alt="headerImage.description"
			>
		</div>
		<div class="small-12 columns">
			<h2 class="homepage-general-stats__header" v-html="headline"></h2>
			<p class="homepage-general-stats__body" v-html="subhead"></p>
		</div>
		<div class="small-12 xlarge-10 columns">
			<div class="homepage-general-stats-box">
				<div class="row align-center">
					<div
						v-for="(stat, index) in stats"
						:key="index"
						class="small-6 xlarge-2 columns homepage-general-stats-box__group"
					>
						<div class="homepage-general-stats-box__stat">
							{{ stat.stat }}
						</div>
						<div class="homepage-general-stats-box__stat-label">
							{{ stat.label }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import numeral from 'numeral';

export default {
	name: 'HomepageGeneralStats',
	props: {
		content: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		headerImage() {
			const image = this.content?.media?.[0] ?? {};
			return {
				description: image?.description ?? '',
				url: image?.file?.url ?? '',
			};
		},
		headerText() {
			return this.content?.contents?.find(({ key }) => key.indexOf('homepage-statistics-text') > -1);
		},
		headline() {
			return this.headerText?.headline ?? '';
		},
		subhead() {
			return this.headerText?.subHeadline ?? '';
		},
		stats() {
			const uiSetting = this.content?.contents?.find(({ key }) => key.indexOf('homepage-statistics-values') > -1);
			// transform json from contentful ({ value: Int, format: String?, label: String })
			// into object for rendering ({ stat: String, label: String })
			return uiSetting?.dataObject?.map(({ label, value, format }) => ({
				label,
				stat: format ? numeral(value).format(format) : value,
			}));
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.homepage-general-stats {
	padding: 2rem 0;

	&__img {
		width: rem-calc(220);
		margin: 0 auto;

		@include breakpoint(xlarge) {
			width: rem-calc(320);
		}
	}

	&__header {
		font-size: $featured-text-font-size;
		font-weight: $global-weight-normal;

		em {
			font-size: rem-calc(96);
			font-weight: bold;
			font-style: normal;
			margin-bottom: 0;
			display: block;
		}
	}

	&__body {
		@include featured-text();

		margin-bottom: rem-calc(30);

		@include breakpoint(xlarge) {
			margin-bottom: rem-calc(48);
		}
	}

	&-box {
		border-radius: rem-calc(25);
		background-color: $kiva-accent-blue;
		color: $white;
		padding: rem-calc(40) rem-calc(map-safe-get($grid-column-gutter, small));

		@include breakpoint(medium) {
			padding: rem-calc(40) rem-calc(map-safe-get($grid-column-gutter, medium));
		}

		@include breakpoint(xlarge) {
			padding: rem-calc(40) 0;
		}

		&__group {
			$border: rem-calc(3) solid rgba(0, 0, 0, 0.2);

			margin-bottom: rem-calc(40);

			&:nth-child(odd) {
				border-right: $border;
			}

			@include breakpoint(xlarge) {
				margin-bottom: 0;

				&:nth-child(even) {
					border-right: $border;
				}
			}

			&:last-child {
				border: none;
				margin-bottom: 0;
			}
		}

		&__stat {
			text-transform: uppercase;
			line-height: 0.8;
			font-size: rem-calc(24);
			font-weight: 600;
			margin-bottom: 0.5rem;
		}

		&__stat-label {
			line-height: 1.3;
		}
	}
}
</style>
