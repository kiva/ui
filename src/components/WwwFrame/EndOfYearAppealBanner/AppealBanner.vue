<template>
	<div class="appeal-banner-wrapper">
		<div class="appeal-banner">
			<div class="row"
				@click="toggleAccordion">
				<div class="small-2 show-for-large"></div>
				<div class="small-10">
					<!-- IF REGULAR APPEAL BANNER -->
					<!-- PUT CONDITIONAL HERE -->
					<h2>Your donation will power impact and hope in 2019

						<!-- IF MATCHED APPEAL BANNER -->
						<!-- PUT CONDITIONAL HERE -->
						<!-- <h2>Double or triple the impact of your donation!</h2> -->

						<!-- IF BONUS APPEAL BANNER -->
						<!-- PUT CONDITIONAL HERE -->
						<!-- <h2>Donate today and receive a bonus to lend!</h2> -->

						<a @click="toggleAccordion">
							<kv-icon
								@click="toggleAccordion"
								:class="{ flipped: open }"
								class="toggle-arrow"
								name="medium-chevron" />
						</a>
					</h2>
				</div>
			</div>

			<kv-expandable easing="ease-in-out">
				<div class="row"
					v-show="open">
					<div class="small-2 show-for-large text-center">
						<appeal-image />
					</div>
					<div class="small-10">
						<div>
							<!-- IF REGULAR APPEAL BANNER -->
							<!-- PUT CONDITIONAL HERE -->
							<p class="small-text">
								100% of money lent on Kiva goes to funding loans, so Kiva relies on donations
								from people like you to operate and grow. Donate to Kiva to help us reach more
								communities in 2019 - your donation of any size makes a difference. Thank you
								for investing in a better world.
							</p>
							<!-- IF MATCHED APPEAL BANNER -->
							<!-- PUT CONDITIONAL HERE -->
							<!-- <p class="small-text quote">
								100% of money lent on Kiva goes to funding loans, so Kiva relies on donations
								from people like you to operate and grow. For a limited time,
								<strong>donations to Kiva of $20 or more are matched, and donations of $50
								or more are triple matched by generous donors!</strong>
								Thank you for investing in a better world.
							</p> -->

							<!-- IF BONUS APPEAL BANNER -->
							<!-- PUT CONDITIONAL HERE -->
							<!-- <p class="small-text quote">
								100% of money lent on Kiva goes to funding loans, so Kiva relies on donations
								from people like you to operate and grow. <strong>TODAY ONLY, donate $35 or
								more to Kiva and we'll send you a $25 bonus tomorrow to make a loan!</strong>
								Thank you for investing in a better world.
							</p> -->

							<p class="small-text">
								Premal Shah, President & Co-Founder, Kiva
							</p>
						</div>
						<div>
							<kv-button class="smallest custom-width">$20</kv-button>
							<kv-button class="smallest custom-width">$35</kv-button>
							<kv-button class="smallest custom-width">$50</kv-button>
							<input
								class="dollar-amount-input show-for-large"
								placeholder="other">
							<kv-button class="smallest setting submit-button">Submit</kv-button>
						</div>
					</div>
				</div>
			</kv-expandable>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import AppealImage from '@/components/WwwFrame/EndOfYearAppealBanner/AppealImage';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import KvExpandable from '@/components/Kv/KvExpandable';

export default {
	components: {
		KvButton,
		KvIcon,
		AppealImage,
		KvExpandable,
	},
	inject: ['apollo'],
	data() {
		return {
			open: true,
		};
	},
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			this.isVisible = _get(data, 'general.setting.value') === 'true' || false;
		},
	},
	methods: {
		toggleAccordion() {
			this.open = !this.open;
		},
	},
};
</script>

<style lang='scss'>
@import 'settings';
@import "global/transitions";

.appeal-banner-wrapper {
	background: $kiva-alert-yellow;

	.appeal-banner {
		padding-left: 0.625rem;
	}

	.toggle-arrow {
		transition: transform 300ms ease;
		display: block;
		height: rem-calc(40);
		width: rem-calc(40);
		margin-right: rem-calc(22);
		float: right;
	}

	.flipped {
		transform: rotate(180deg);
	}

	h2 {
		font-weight: $global-weight-highlight;
	}

	.icon {
		width: rem-calc(25);
		height: rem-calc(40);
		cursor: pointer;
	}

	.small-text {
		font-weight: $global-weight-highlight;
	}

	.submit-button {
		vertical-align: super;
	}

	.dollar-amount-input {
		font-size: 1.25rem;
		padding: 0.7rem 1.5rem;
		width: rem-calc(120);
		margin-right: rem-calc(10);
		vertical-align: top;
	}

	.custom-width {
		padding: 0.75rem 3.5rem !important;
		margin-right: rem-calc(10);
	}
}
</style>
