<template>
	<div :class="`kv-flag kv-flag--${aspectRatio}`">
		<div class="kv-flag__wrapper">
			<template v-if="fromSprite">
				<div
					class="kv-flag__img kv-flag__img--sprite"
					:style="{ backgroundPositionY: spriteYPosition + '%' }"
				></div>
			</template>
			<template v-else>
				<component
					:is="flagSVG"
					class="kv-flag__img"
				/>
			</template>
		</div>
	</div>
	<!-- TODO: Maybe add the country name. Either as screenreader only text or use KvTooltip. -->
</template>

<script>
const COUNTRY_LIST = ['ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bl', 'bm', 'bn', 'bo', 'bq', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cw', 'cx', 'cy', 'cz', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es-ca', 'es-ga', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb-eng', 'gb-nir', 'gb-sct', 'gb-wls', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mf', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'um', 'un', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'xk', 'ye', 'yt', 'za', 'zm', 'zw']; // eslint-disable-line max-len
const SPRITE_FLAG_WIDTH = 32; // Number of px wide that the sprite PNG is.

export default {
	props: {
		country: {
			type: String,
			required: true,
		},
		aspectRatio: {
			type: String,
			default: '4x3', // 4x3 or 1x1
		},
		fromSprite: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		flagSVG() {
			return () => import(`~/flag-icon-css/flags/${this.aspectRatio}/${this.country}.svg`);
		},
		spriteYPosition() {
			if (this.fromSprite) {
				// Determine what percentage down the flag is in the sprite
				// depending on its position in the country list.
				const countryIndex = COUNTRY_LIST.indexOf(this.country);
				const aspectMultiplier = this.aspectRatio === '4x3' ? 0.75 : 1;
				const flagHeightInSprite = SPRITE_FLAG_WIDTH * aspectMultiplier;
				const totalSpriteHeight = flagHeightInSprite * (COUNTRY_LIST.length - 1);
				return ((countryIndex * flagHeightInSprite) / totalSpriteHeight) * 100;
			}
			return 0;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

// Flag SVGs from https://github.com/lipis/flag-icon-css
// Then processed into a PNG sprite via a node script.
// An SVG sprite is not used because the massive amount of dom nodes it generates since flags are fairly complex
// and the resulting file size was over 4Mb. Png is under 200kb.

.kv-flag {
	width: 100%;
	height: 0;
	position: relative;
	overflow: hidden;

	&__wrapper {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	&__img {
		display: block;
		width: 100%;
		height: 100%;

		&--sprite {
			background-repeat: no-repeat;
			background-size: 100%;
			background-position-x: 0;
		}
	}

	&--4x3 {
		padding-bottom: 75%;

		.kv-flag__img--sprite {
			background-image: url('~@/assets/images/flags/country-flag-sprite-4x3.png');

			@include breakpoint(retina) {
				background-image: url('~@/assets/images/flags/country-flag-sprite-4x3_2x.png');
			}
		}
	}

	&--1x1 {
		padding-bottom: 100%;

		.kv-flag__img--sprite {
			background-image: url('~@/assets/images/flags/country-flag-sprite-1x1.png');

			@include breakpoint(retina) {
				background-image: url('~@/assets/images/flags/country-flag-sprite-1x1_2x.png');
			}
		}
	}
}
</style>
