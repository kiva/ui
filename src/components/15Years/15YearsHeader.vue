<template>
	<div class="header">
		<div class="row align-middle">
			<div class="header__text large-4 columns">
				<h1 class="header__headline">
					<span class="header__headline-stroked">Power in</span><br> Numbers
				</h1>
				<p>
					Something something 15 year anniversary Lorem ipsum dolor sit lorem ipsum
				</p>
				<kv-button>CTA</kv-button>
			</div>

			<div class="header__globe large-offset-2 large-6 columns">
				<img class="header__globe-img" src="@/assets/images/15-years/temp/globe.png">
			</div>
		</div>

		<div class="header__blobs blobs">
			<svg class="blobs__svg" viewBox="0 0 1566 1110" xmlns="http://www.w3.org/2000/svg">
				<path class="blobs__1" d="M517 952C1058.67 1088.49 1334.7 704.898 1566 588.882V1096.06H0C79 1057 328.5 904.5 517 952Z" fill="#9EEBD5" />
				<path class="blobs__2" d="M836.625 296.118C1202 481.412 1164.5 839.294 906 1089.71H1295.12V145.235L427.125 0.176514C389.291 38.4706 439.617 94.7815 836.625 296.118Z" fill="#3E4653" />
				<path class="blobs__3" d="M499.592 168.582C560.792 179.17 588.759 207.935 595.092 220.994C666.092 296.17 388.592 220.994 379.092 183.405C369.664 146.099 422.292 155.206 497.873 168.284L499.592 168.582Z" fill="#3E4653" />
				<path class="blobs__4" d="M1062.5 807C1224.7 541.545 1398.07 534.407 1445 547.073V1109.98H665.159C664.061 1110.01 663.007 1110.01 662 1109.98H665.159C727.458 1108.37 934.962 1015.73 1062.5 807Z" fill="#DF5D4F" />
				<path class="blobs__5" d="M1237.82 456.816C1251.3 442.092 1258.65 422.278 1263.67 402.475C1270.08 377.232 1283.61 341.429 1278.13 321.715C1274.44 308.45 1249.78 287.814 1238.27 285.942C1219.89 282.954 1201.2 282.15 1182.65 283.549C1151.83 285.875 1117.98 297.06 1103.56 325.983C1095.42 342.322 1094.93 361.775 1097.12 380.105C1099.73 401.988 1106.06 423.7 1117.92 441.836C1145.06 483.347 1202.72 495.146 1237.82 456.816Z" fill="#B8CEF8" />
				<path class="blobs__6" d="M1005.5 276.969C807.514 257.118 697.956 101.614 687 99.9602C768.126 58.3271 928.811 -8.8923 922.551 55.2943C914.725 135.527 1203.49 296.821 1005.5 276.969Z" fill="#F8F8F8" />
			</svg>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'components/15-years/15-years';

.header {
	background: $offwhite;
	position: relative;
	z-index: 1;

	&__headline {
		@include huge-headline();
	}

	&__headline-stroked {
		-webkit-text-stroke: 1px $body-font-color;
		-webkit-text-fill-color: $offwhite;
	}

	&__globe {
	}

	&__globe-img {
		margin: 4rem 0;
	}

	&__blobs {
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: -1;
		top: 0;
		position: absolute;
	}
}

.blobs {
	&__svg {
		transform: translateX(420px) translateY(-240px);
	}
}
</style>
