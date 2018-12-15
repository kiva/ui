<template>
	<div class="appeal-banner-wrapper" v-if="showAppeal">
		<div class="appeal-banner">
			<div class="row"
				@click="toggleAccordion">
				<div class="small-2 show-for-large"></div>
				<div class="appeal-header small-12 large-10 padding">
					<h2>
						<!-- IF BONUS APPEAL BANNER -->
						<span v-if="appealBonusEnabled">Donate today and receive a bonus to lend!</span>
						<!-- IF MATCHED APPEAL BANNER -->
						<span v-else-if="appealMatchEnabled">Double or triple the impact of your donation!</span>
						<!-- ELSE STANDARD APPEAL BANNER -->
						<span v-else>Your donation will power impact and hope in 2019</span>
						<kv-icon
							@click="toggleAccordion"
							:class="{ flipped: open }"
							class="toggle-arrow"
							name="medium-chevron" />
					</h2>
				</div>
			</div>

			<kv-expandable easing="ease-in-out">
				<div class="row"
					v-show="open">
					<div class="small-2 show-for-large text-center">
						<appeal-image />
					</div>
					<div class="small-12 large-10 padding">
						<div class="appeal-copy">
							<!-- IF BONUS APPEAL BANNER -->
							<p v-if="appealBonusEnabled" class="small-text quote">
								100% of money lent on Kiva goes to funding loans, so Kiva relies on donations
								from people like you to operate and grow. <strong>TODAY ONLY, donate $35 or
								more to Kiva and we'll send you a $25 bonus tomorrow to make a loan!</strong>
								Thank you for investing in a better world.
							</p>
							<!-- IF MATCHED APPEAL BANNER -->
							<p v-else-if="appealMatchEnabled" class="small-text quote">
								100% of money lent on Kiva goes to funding loans, so Kiva relies on donations
								from people like you to operate and grow. For a limited time,
								<strong>donations to Kiva of $20 or more are matched, and donations of $50
								or more are triple matched by generous donors!</strong>
								Thank you for investing in a better world.
							</p>
							<!-- IF REGULAR APPEAL BANNER -->
							<p v-else class="small-text">
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
							<kv-button
								class='smallest custom-width'
								@click.native.prevent.stop="updateDonationTo(20)"
							>$20</kv-button>
							<kv-button
								class="smallest custom-width"
								@click.native.prevent.stop="updateDonationTo(35)"
							>$35</kv-button>
							<kv-button
								class="smallest custom-width"
								@click.native.prevent.stop="updateDonationTo(50)"
							>$50</kv-button>
							<kv-button
								class="smallest custom-width hide-for-large"
								to="/donate/supportus"
								v-kv-track-event="['promo', 'click', 'EOYBanner', 'other-button']"
							>Other</kv-button>
							<input
								class="dollar-amount-input show-for-large"
								placeholder="other"
								@blur="validateInput"
								v-model="donationAmount">
							<kv-button
								class="smallest setting submit-button show-for-large"
								id="appeal-donation-button"
								@click.native.prevent.stop="updateDonationTo(undefined, true)"
							>Submit</kv-button>
						</div>
					</div>
				</div>
			</kv-expandable>
		</div>
	</div>
</template>

<script>
import { readJSONSetting, readBoolSetting } from '@/util/settingsUtils';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import AppealImage from '@/components/WwwFrame/EndOfYearAppealBanner/AppealImage';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import appealIsShrunkMutation from '@/graphql/mutation/setUserSession.graphql';
import KvExpandable from '@/components/Kv/KvExpandable';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';

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
			appealEnabled: false,
			appealMatchEnabled: false,
			appealBonusEnabled: false,
			isAppealShrunk: false,
			amount: 0,
			donationAmount: null,
		};
	},
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			this.appealEnabled = JSON.parse(_get(data, 'general.appeal_enabled.value'));

			this.appealMatchEnabled = JSON.parse(_get(data, 'general.appeal_match_enabled.value'));

			// This setting SHOULD be temporary and CANNOT reveal this appeal alone.
			this.appealBonusEnabled = readBoolSetting(data, 'general.appeal_bonus_active.value');

			// the IsAppealBannerShrunk session value returns either false or '"1"'
			this.isAppealShrunk = readJSONSetting(data, 'general.appeal_banner_shrunk.data') === 1;
		},
	},
	computed: {
		showAppeal() {
			// make sure the appeal is enable + we're not on checkout
			return (this.appealEnabled || this.appealMatchEnabled) && this.$route.path !== '/checkout';
		}
	},
	watch: {
		isAppealShrunk(isShrunk) {
			if (isShrunk) {
				this.open = false;
			}
		}
	},
	methods: {
		toggleAccordion() {
			// if state when clicked is open/true we are closing the accordian so pass '"1"' as the php expects
			// otherwise if state when clicked is closed/false, we are opening so false is the expected value
			this.setIsShrunkSession(this.open ? '"1"' : false);
			this.open = !this.open;
		},
		setIsShrunkSession(isShrunk) {
			this.apollo.mutate({
				mutation: appealIsShrunkMutation,
				variables: {
					sessionKey: 'IsAppealBannerShrunk',
					data: isShrunk // "1" or false
				}
			}).catch(error => {
				console.error(error);
			});
		},
		updateDonationTo(amount, isCustom) {
			if (isCustom) {
				this.amount = this.donationAmount;
				this.$kvTrackEvent('promo', 'clickOther', 'EOYBanner', this.amount);
			} else {
				this.amount = amount;
				this.$kvTrackEvent('promo', 'click', 'EOYBanner', this.amount);
			}
			this.updateDonation();
		},
		updateDonation() {
			if (numeral(this.amount).value() <= 0) {
				window.location = '/donate/supportus';
				return;
			}
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: numeral(this.amount).format('0.00'),
					isTip: false,
				}
			}).then(data => {
				if (data.errors) {
					_forEach(data.errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				} else {
					// direct user to /basket page
					window.location.href = '/basket';
				}
			}).catch(error => {
				console.error(error);
			});
		},
		validateInput() {
			// format the value taken from the donation input
			this.donationAmount = numeral(this.donationAmount).format('$0,0.00');
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

		.padding {
			padding: 0 rem-calc(10);
		}

		.appeal-copy {
			padding-right: 0.25rem;
		}

		.custom-width {
			padding: 0.75rem 0;
			margin-right: rem-calc(10);
			text-align: center;
			width: 46%;

			@include breakpoint(large) {
				width: 18%;
			}
		}

		h2 {
			font-weight: $global-weight-highlight;
			margin-top: 0.3rem;
			padding-right: 2.5rem;
		}

		.icon {
			width: rem-calc(25);
			height: rem-calc(40);
			cursor: pointer;
		}

		.small-text {
			font-weight: $global-weight-highlight;
		}

		button.submit-button {
			vertical-align: super;
			padding: 0.9rem 0;
			width: 46%;

			@include breakpoint(large) {
				width: 17%;
			}
		}

		input.dollar-amount-input {
			font-size: 1.25rem;
			padding: 0.7rem 0.5rem;
			margin-right: rem-calc(10);
			vertical-align: top;
			width: 46%;

			@include breakpoint(large) {
				width: 17%;
			}
		}
	}

	.toggle-arrow {
		transition: transform 300ms ease;
		display: block;
		height: rem-calc(40);
		width: rem-calc(40);
		position: absolute;
		top: 0.25rem;
		right: 0.6rem;
		margin: 0;
	}

	.flipped {
		transform: rotate(180deg);
	}
}
</style>
