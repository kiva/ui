<template>
	<div :class="`kv-flag kv-flag--${aspectRatio}`">
		<div class="kv-flag__wrapper">
			<template v-if="inlineSvg">
				<component
					:is="flagSVG"
				/>
			</template>
			<template v-else>
				<div
					class="kv-flag__img-sprite"
					:style="{ backgroundPositionY: spriteYPosition + '%' }"
				></div>
			</template>
			<span class="tw-sr-only">{{ countryName }}</span>
		</div>
	</div>
</template>

<script>
import { getCodes, getNameByCode } from 'flag-icon-css';
import getCacheKey from '@/util/getCacheKey';

const COUNTRY_LIST = getCodes();
const SPRITE_FLAG_WIDTH = 32; // Number of px wide that the sprite PNG is.

export default {
	name: 'KvFlag',
	serverCacheKey: props => getCacheKey(`KvFlag-${props.country}-${props.aspectRatio}-${props.inlineSvg}`),
	props: {
		/**
		 * 2 letter ISO country code of the flag to show
		* */
		country: {
			type: String,
			required: true,
		},
		/**
		 * Aspect Ratio of the flag image
		 * `4x3, 1x1`
		* */
		aspectRatio: {
			type: String,
			default: '4x3',
		},
		/**
		 * Inline the flag SVG into the markup instead of using a background image sprite
		 * Use when showing a small amount of flags per page or if you need a larger flag than 32px wide.
		* */
		inlineSvg: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		countryName() {
			return `Flag of ${getNameByCode(this.country)}`;
		},
		flagSVG() {
			// Pulling these out here so that Vue registers them as reactive.
			// Because the import() call happens in an arrow function, the usage of 'this' is not
			// registerd by Vue, and so any changes to the country are not picked up, which leads to
			// the flag not being rendered when the country isn't provided until after the first render.
			const { aspectRatio, country } = this;
			return () => import(`~/flag-icon-css/flags/${aspectRatio}/${country.toLowerCase()}.svg`);
		},
		spriteYPosition() {
			if (!this.inlineSvg) {
				// Determine what percentage down the flag is in the sprite
				// depending on its position in the country list.
				const countryIndex = COUNTRY_LIST.indexOf(this.country.toUpperCase());
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

.kv-flag {
	border: 1px solid $kiva-bg-darkgray;

	&__wrapper {
		position: relative;
		overflow: hidden;
		height: 0;
		width: 100%;
		background-color: $kiva-bg-lightgray;
		line-height: 0;
	}

	&__img-sprite {
		background-repeat: no-repeat;
		background-size: 100%;
		background-position-x: 0;
		position: absolute;
		width: 100%;
		height: 100%;
	}

	&--4x3 {
		.kv-flag__wrapper {
			padding-bottom: 75%;
		}

		.kv-flag__img-sprite {
			background-image: url('~flag-icon-css/flags/sprite/4x3/flag-sprite-32.png');

			@include breakpoint(retina) {
				background-image: url('~flag-icon-css/flags/sprite/4x3/flag-sprite-32_2x.png');
			}
		}
	}

	&--1x1 {
		.kv-flag__wrapper {
			padding-bottom: 100%;
		}

		.kv-flag__img-sprite {
			background-image: url('~flag-icon-css/flags/sprite/1x1/flag-sprite-32.png');

			@include breakpoint(retina) {
				background-image: url('~flag-icon-css/flags/sprite/1x1/flag-sprite-32_2x.png');
			}
		}
	}
}
</style>
