<template>
	<div class="appeal-banner-wrapper">
		<div class="appeal-banner">
			<!-- REGULAR DONATION APPEAL BANNER -->
			<!-- TOP ROW -->
			<div class="row"
				@click="toggleAccordion">
				<div class="small-2"></div>
				<div class="small-10">
					<h2>Your donation will power impact and hope in 2019</h2>
					<a @click="toggleAccordion">
						<kv-icon
							:class="{ flipped: open }"
							class="toggle-arrow"
							name="medium-chevron" />
					</a>
				</div>
			</div>

			<kv-expandable easing="ease-in-out">

				<!-- MIDDLE ROW IMG, TEXT & Buttons -->
				<div class="row"
					v-show="open">
					<div class="small-2">
						<appeal-image />
					</div>
					<div class="small-10">
						<div>
							<p class="small-text">
								100% of money lent on Kiva goes to funding loans, so Kiva relies on donations
								from people like you to operate and grow. Donate to Kiva to help us reach more
								communities in 2019 - your donation of any size makes a difference. Thank you
								for investing in a better world.
							</p>
							<p class="small-text">
								Premal Shah, President & Co-Founder, Kiva
							</p>
						</div>
						<div>
							<kv-button class="smallest">$20</kv-button>
							<kv-button class="smallest">$35</kv-button>
							<kv-button class="smallest">$50</kv-button>
							<input
								class="dollar-amount-input"
								placeholder="other">
							<kv-button class="smallest setting">Submit</kv-button>
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

	.dollar-amount-input {
		font-size: 1.25rem;
		padding: 0.75rem 1.5rem;
		width: rem-calc(120);
	}

	.icon {
		width: rem-calc(25);
		height: rem-calc(25);
		cursor: pointer;
	}
}
</style>

<!-- MATCHED DONATION APPEAL BANNER -->
					<!-- <div class="header columns">
						<h2>Double or triple the impact of your donation!</h2>
						<span class="close-icon">
							<a @click="toggleAccordion">
								<kv-icon
									:class="{ flipped: open }"
									class="toggle-arrow"
									name="medium-chevron"
								/>
							</a>
						</span>
					</div>
					<div class="columns ">
						<p class="small-text quote">
							100% of money lent on Kiva goes to funding loans, so Kiva relies on donations
							from people like you to operate and grow. For a limited time,
							<strong>donations to Kiva of $20 or more are matched, and donations of $50
							or more are triple matched by generous donors!</strong>
							Thank you for investing in a better world.
						</p>
						<p class="small-text quote">
							Premal Shah, President & Co-Founder, Kiva
						</p>
					</div> -->


					<!-- BONUS DONATION APPEAL BANNER -->
					<!-- <div class="header columns">
						<h2>Donate today and receive a bonus to lend!</h2>
						<span class="close-icon">
							<a @click="toggleAccordion">
								<kv-icon
									:class="{ flipped: open }"
									class="toggle-arrow"
									name="medium-chevron"
								/>
							</a>
						</span>
					</div>
					<div class="columns ">
						<p class="small-text quote">
							100% of money lent on Kiva goes to funding loans, so Kiva relies on donations
							from people like you to operate and grow. <strong>TODAY ONLY, donate $35 or
							more to Kiva and we'll send you a $25 bonus tomorrow to make a loan!</strong>
							Thank you for investing in a better world.
						</p>
						<p class="small-text quote">
							Premal Shah, President & Co-Founder, Kiva
						</p>
					</div> -->
