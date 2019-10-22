<template>
	<figure class="floating-counter" :class="classNames" :style="style">
		<figcaption class="count-caption">
			Current loans that match your criteria:
		</figcaption>
		<loan-count-span class="count-value" :count="count" :counting="counting" />
	</figure>
</template>

<script>
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import gql from 'graphql-tag';
import numeral from 'numeral';
import LoanCountSpan from './LoanCountSpan';

export default {
	inject: ['apollo'],
	components: {
		LoanCountSpan,
	},
	data() {
		return {
			count: 0,
			counting: false,
			fixed: false,
			marginRight: 0,
			marginTop: 0,
			warningThreshold: 0,
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentLoanCount
				countingLoans
				warningThreshold
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.count = _get(data, 'autolending.currentLoanCount');
			this.counting = _get(data, 'autolending.countingLoans');
			this.warningThreshold = _get(data, 'autolending.warningThreshold');
		},
	},
	computed: {
		classNames() {
			return {
				low: this.count < this.warningThreshold,
			};
		},
		style() {
			if (this.fixed) {
				return {
					position: 'fixed',
					right: `${this.marginRight}px`,
					top: `${this.marginTop}px`,
				};
			}
			return {
				position: 'absolute',
			};
		},
		throttledResize() {
			return _throttle(this.checkMargins, 100);
		},
		throttledScroll() {
			return _throttle(this.checkPosition, 20);
		},
	},
	mounted() {
		this.checkMargins();
		this.checkPosition();
		window.addEventListener('resize', this.throttledResize);
		window.addEventListener('scroll', this.throttledScroll);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize);
		window.removeEventListener('scroll', this.throttledScroll);
	},
	methods: {
		checkPosition() {
			if (this.$el && this.$el.parentElement) {
				const rect = this.$el.parentElement.getBoundingClientRect();
				if (rect.top - this.marginTop > 0) {
					this.fixed = false;
				} else {
					this.fixed = true;
				}
			}
		},
		checkMargins() {
			if (this.$el && this.$el.parentElement) {
				const rect = this.$el.parentElement.getBoundingClientRect();
				this.marginRight = document.body.clientWidth - rect.right;
				this.marginTop = this.getTopMargin(this.$el.parentElement);
			}
		},
		getTopMargin(el) {
			const margin = window.getComputedStyle(el).getPropertyValue('margin-top');
			return numeral(margin).value();
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.floating-counter {
	$border-radius: rem-calc(3);

	position: absolute;
	top: 0;
	right: 0;
	width: rem-calc(202);
	border-radius: $border-radius;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.13);
	text-align: center;
	overflow: hidden;

	.count-caption {
		padding: rem-calc(10) 1rem;
		background-color: $white;
		color: $kiva-text-light;
		font-size: rem-calc(18);
		line-height: 1.33;
		border: 1px solid $kiva-stroke-gray;
		border-radius: $border-radius $border-radius 0 0;
		border-bottom: none;
	}

	.count-value {
		display: block;
		margin: 0;
		color: $white;
		font-size: rem-calc(36);
		font-weight: 500;
		line-height: rem-calc(54);
		background-color: $kiva-green;
	}

	.loading-spinner {
		vertical-align: middle;
		width: 2.5rem;
		height: 2.5rem;
		margin-top: -0.25rem;

		& >>> .line {
			background-color: $white;
		}
	}

	&.low {
		.count-value {
			background-color: $kiva-accent-red;
		}
	}
}
</style>
