<template>
	<div class="appeal-banner" v-if="isVisible">
		<div class="appeal-banner-layout close" v-show="!isOpen">
			<div class="row">
				<div class="avatarSpacer">
				</div>
				<div class="info column">
					<div class="header columns">
						<h2>Fighting for a better future? We need your help.</h2>
						<span class="open-icon"
							@click="toggleAccordion">
							<kv-icon name="small-chevron-mobile"/>
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class="appeal-banner-layout" v-show="isOpen">
			<div class="row">
				<div class="avatar">
					<appeal-image />
				</div>
				<div class="info column">

					<!-- REGULAR DONATION APPEAL BANNER -->
					<!-- <div class="header columns">
						<h2>Your donation will power impact and hope in 2019</h2>
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
							from people like you to operate and grow. Donate to Kiva to help us reach more
							communities in 2019 - your donation of any size makes a difference. Thank you
							for investing in a better world.
						</p>
						<p class="small-text quote">
							Premal Shah, President & Co-Founder, Kiva
						</p>
					</div> -->


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
					<div class="header columns">
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
					</div>

					<div class="row columns">
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
		</div>
	</div>
</template>

<script>
/* eslint-disable max-len */
import _get from 'lodash/get';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import AppealImage from '@/components/WwwFrame/EndOfYearAppealBanner/AppealImage';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';

export default {
	components: {
		KvButton,
		KvIcon,
		AppealImage,
	},
	inject: ['apollo'],
	data() {
		return {
			isOpen: true,
			isVisible: false,
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
			this.isOpen = !this.isOpen;
		},
	},
};
</script>

<style lang='scss'>
@import 'settings';

.appeal-banner {
	background: $kiva-alert-yellow;
}

.appeal-banner-layout {
	margin: 0 auto;

	& .close {
		height: rem-cacl(50);
	}

	& > .row {
		align-items: center;
	}

	.avatar {
		//width: 13rem;
		align-items: center;
	}

	.avatarSpacer {
		width: 7.5rem;
	}

	.dollar-amount-input {
		font-size: 1.25rem;
		padding: 0.75rem 1.5rem;
		width: rem-calc(120);
	}

	// .info {
	// 	max-width: 45rem;
	// }

	.header {
		flex-direction: row;
		display: flex;
	}

	// .quote {
	// 	max-width: 40rem;
	// }

	.column {
		padding: 0;
	}

	.close-icon {
		transform: scaleY(-1);
		height: rem-calc(35);
	}

	.icon {
		width: rem-calc(25);
		height: rem-calc(25);
		cursor: pointer;
		margin-left: rem-calc(50);
		margin-top: rem-calc(5);
	}
}
</style>
