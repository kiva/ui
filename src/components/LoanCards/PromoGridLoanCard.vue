<template>
	<div class="column column-block">
		<div class="grid-loan-card promo-grid-card">
			<div class="promo-image-wrapper" :style="{ 'background-image': 'url(' + backgroundImage + ')' }"></div>
			<div class="image-overlay"></div>
			<div class="promo-content-wrapper">
				<div class="promo-content">
					<h1>Make a<br class="su">monthly impact</h1>
					<p v-if="categoryData.label">
						We’ll lend to {{ categoryData.label }} for you every month with a Monthly Good subscription.
					</p>
					<p v-else>
						We’ll make a loan for you every month with a Monthly Good subscription.
					</p>
					<kv-button
						class="small"
						:href="targetUrl"
						v-kv-track-event="['Lending', 'PromoGridCard-click-Learn more', 'CASH-1426 Dec2019']"
					>
						Learn more
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import { isHighDensity, isRetina } from '@/util/checkScreenDensity';

const promoLoanImageRequire = require.context('@/assets/images/mg-promo-loan-card/', true);

export default {
	components: {
		KvButton,
	},
	data() {
		return {
			isRetina: false,
		};
	},
	props: {
		categoryData: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		imageDensity() {
			return this.isRetina ? 'retina' : 'std';
		},
		targetUrl() {
			if (typeof this.categoryData.id !== 'undefined') {
				return `/monthlygood?category=${this.categoryData.id}`;
			}
			return '/monthlygood';
		},
		backgroundImage() {
			if (typeof this.categoryData.id !== 'undefined') {
				return promoLoanImageRequire(`./mg-promo-${this.categoryData.id}-${this.imageDensity}.jpg`);
			}
			return promoLoanImageRequire(`./mg-promo-default-${this.imageDensity}.jpg`);
		}
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		}
	},
	mounted() {
		// Check for retina/high density display
		this.isRetina = isRetina() || isHighDensity();
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.grid-loan-card {
	background-color: $white;
	border: 1px solid $kiva-stroke-gray;
	display: flex;
	flex-direction: column;
	height: 100%;
	min-width: rem-calc(280);
	max-width: rem-calc(480);
	margin: auto;

	&:hover {
		box-shadow: rem-calc(2) rem-calc(2) rem-calc(4) rgba(0, 0, 0, 0.1);
	}
}

.promo-grid-card {
	position: relative;
	overflow: hidden;
	min-height: 30rem;
	background-color: rgb(61, 61, 61);
}

.promo-image-wrapper {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-position: top center;
	background-size: cover;
}

.image-overlay {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: linear-gradient(transparent 25%, rgb(61, 61, 61) 80%);
}

.promo-content-wrapper {
	z-index: 1;
	text-align: center;
	padding: 1rem;
	position: absolute;
	bottom: 2rem;
	color: white;

	h1 {
		font-weight: 600;
	}

	p {
		font-size: 1.25rem;
		line-height: 1.6rem;
		margin-bottom: 2rem;
	}
}

.is-in-category-row {
	flex: 0 0 auto;

	.grid-loan-card {
		width: rem-calc(280);
		@include breakpoint(340px down) {
			min-width: rem-calc(256);
			width: rem-calc(256);
		}
	}

	&.column-block {
		padding: 0 rem-calc(10);
		margin-bottom: 0;

		&:first-of-type {
			padding-left: 0;
		}
	}
}
</style>
