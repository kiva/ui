<template>
	<div class="kv-flag">
		<span
			class="kv-flag__wrapper" :class="{
				[`fi fi-${country.toLowerCase()}`]: true,
				'fis': isSquare,
			}"
		></span>
		<span class="tw-sr-only">{{ countryName }}</span>
	</div>
</template>

<script>
import * as flagIconCss from 'flag-icon-css';
import getCacheKey from '#src/util/getCacheKey';

export default {
	name: 'KvFlag',
	serverCacheKey: props => getCacheKey(`KvFlag-${props.country}-${props.isSquare}`),
	props: {
		/**
		 * 2 letter ISO country code of the flag to show
		* */
		country: {
			type: String,
			required: true,
		},
		/**
		 * Whether to use a square flag icon
		 */
		isSquare: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		countryName() {
			return `Flag of ${flagIconCss.default.getNameByCode(this.country)}`;
		},
	},
};
</script>

<style lang="scss" scoped>
@import '../../../node_modules/flag-icons/css/flag-icons.min.css';
@import '#src/assets/scss/settings';

.kv-flag {
	border: 1px solid $kiva-bg-darkgray;
	display: flex;

	&__wrapper {
		position: relative;
		overflow: hidden;
		height: 100%;
		width: 100% !important;
		background-color: $kiva-bg-lightgray;
		line-height: 0;
		padding-bottom: 75%;
	}

	&__img-sprite {
		background-repeat: no-repeat;
		background-size: 100%;
		background-position-x: 0;
		position: absolute;
		width: 100%;
		height: 100%;
	}
}
</style>
