<template>
	<p
		class="tw-mt-2"
		:class="{'tw-font-medium' : strong, 'tw-font-book': !strong }"
	>
		<!-- eslint-disable-next-line max-len  -->
		Currently, <loan-count-span class="count-value" :count="count" :counting="counting" /> loans match your criteria.
	</p>
</template>

<script>
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import { gql } from '@apollo/client';
import numeral from 'numeral';
import LoanCountSpan from './LoanCountSpan';

export default {
	name: 'InlineCounter',
	inject: ['apollo', 'cookieStore'],
	props: {
		strong: {
			type: Boolean,
			default: false
		},
	},
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
		query: gql`query autolendProfileLoanCount {
			autolending @client {
				id
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
			if (this.$el && this.$el.parentElement && this.$el.parentElement.style.display !== 'none') {
				const rect = this.$el.parentElement.getBoundingClientRect();
				if (rect.top - this.marginTop > 0) {
					this.fixed = false;
				} else {
					this.fixed = true;
				}
			} else {
				this.fixed = false;
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
