<template>
	<div :class="`kv-flag kv-flag--${aspectRatio}`">
		<div class="kv-flag__wrapper">
			<template v-if="fromSprite">
				<div
					class="kv-flag__img-sprite"
					:style="{ backgroundPositionY: spriteYPosition + '%' }"
				></div>
			</template>
			<template v-else>
				<component
					:is="flagSVG"
				/>
			</template>
			<span class="show-for-sr">{{ countryName }}</span>
		</div>
	</div>
</template>

<script>
import { getCodes, getNameByCode } from 'flag-icon-css';

const COUNTRY_LIST = getCodes();
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
		countryName() {
			return `Flag of ${getNameByCode(this.country)}`;
		},
		flagSVG() {
			return () => import(`~/flag-icon-css/flags/${this.aspectRatio}/${this.country.toLowerCase()}.svg`);
		},
		spriteYPosition() {
			if (this.fromSprite) {
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
	width: 100%;

	&__wrapper {
		position: relative;
		overflow: hidden;
		height: 0;
		width: 100%;
		background-color: $kiva-bg-lightgray;
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
