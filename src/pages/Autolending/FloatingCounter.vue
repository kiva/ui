<template>
	<loan-count class="floating-counter" :style="style">
		Current loans that match your criteria:
	</loan-count>
</template>

<script>
import _throttle from 'lodash/throttle';
import numeral from 'numeral';
import LoanCount from './LoanCount';

export default {
	components: {
		LoanCount,
	},
	data() {
		return {
			fixed: false,
			marginRight: 0,
			marginTop: 0,
		};
	},
	computed: {
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
	position: absolute;
	top: 0;
	right: 0;
	width: rem-calc(202);
	border-radius: rem-calc(3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.13);
	text-align: center;
	overflow: hidden;

	.count-caption {
		padding: rem-calc(10) 1rem;
		background-color: $white;
		color: $kiva-text-light;
		font-size: rem-calc(18);
		line-height: 1.33;
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

	&.zero .count-value {
		background-color: $kiva-accent-red;
	}
}
</style>
