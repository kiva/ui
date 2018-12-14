<template>
	<div class="appeal-banner-wrapper" v-if="showAppeal">
		<div class="appeal-banner">
			<div class="row"
				@click="toggleAccordion">
				<div class="small-2 show-for-large"></div>
				<div class="small-10">
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
					<div class="small-10">
						<div>
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
								class="smallest custom-width"
								value="20"
								v-kv-track-event="['promo', 'click', 'EOYBanner', this.value]"
								@click.native.prevent.stop="updateDonation()"
							>$20</kv-button>
							<kv-button
								class="smallest custom-width"
								value="35"
								v-kv-track-event="['promo', 'click', 'EOYBanner', this.value]"
							>$35</kv-button>
							<kv-button
								class="smallest custom-width"
								value="50"
								v-kv-track-event="['promo', 'click', 'EOYBanner', this.value]"
							>$50</kv-button>
							<kv-button
								class="smallest other-button-width hide-for-large"
								value="Variable"
								v-kv-track-event="['promo', 'click', 'EOYBanner', 'other-button']"
							>Other</kv-button>
							<input
								class="dollar-amount-input show-for-large"
								placeholder="other">
							<kv-button
								class="smallest setting submit-button show-for-large"
								v-kv-track-event="['promo', 'click', 'EOYBanner', 'custom-donation-amount']"
							>Submit</kv-button>
						</div>
					</div>
				</div>
			</kv-expandable>
		</div>
	</div>
</template>

<script>
import { settingEnabled, readJSONSetting, readBoolSetting } from '@/util/settingsUtils';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import AppealImage from '@/components/WwwFrame/EndOfYearAppealBanner/AppealImage';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import appealIsShrunkMutation from '@/graphql/mutation/setUserSession.graphql';
import KvExpandable from '@/components/Kv/KvExpandable';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import numeral from 'numeral';
import _forEach from 'lodash/forEach';

export default {
	components: {
		KvButton,
		KvIcon,
		AppealImage,
		KvExpandable,
	},
	inject: ['apollo'],
	props: {
		donation: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			open: true,
			appealEnabled: false,
			appealMatchEnabled: false,
			appealBonusEnabled: false,
			isAppealShrunk: false,
		};
	},
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			this.appealEnabled = settingEnabled(
				data,
				'general.appeal_enabled.value',
				'general.appeal_start_time.value',
				'general.appeal_end_time.value'
			);

			this.appealMatchEnabled = settingEnabled(
				data,
				'general.appeal_match_enabled.value',
				'general.appeal_match_start_time.value',
				'general.appeal_match_end_time.value'
			);

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
		updateDonation() {
			console.log('update donation function entered');
			// Add clicked value to basket as a donation
			// this.$emit('updating-totals', true);
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: numeral(this.amount).format('0.00'),
					isTip: this.donation.isTip
				}
			}).then(data => {
				if (data.errors) {
					_forEach(data.errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
					this.amount = this.cachedAmount;
					this.$emit('updating-totals', false);
				} else {
					// Redirect user to /checkout page if user
					// is not already on the checkout page.
					this.$emit('refreshtotals');
					// KARAN: This will have to be the new tracking events
					// this.$kvTrackEvent(
					// 	'basket',
					// 	'Update Donation',
					// 	'Update Success',
					// 	// pass donation amount as whole number
					// 	numeral(this.amount).value() * 100
					// );
					this.amount = numeral(this.amount).format('$0,0.00');
					this.cachedAmount = numeral(this.amount).format('$0,0.00');
				}
			}).catch(error => {
				console.error(error);
				this.$emit('updating-totals', false);
			});
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

		.custom-width {
			padding: 0.75rem 3.5rem;
			margin-right: rem-calc(10);
		}

		.other-button-width {
			padding: 0.75rem 3.15rem;
		}
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
}
</style>
