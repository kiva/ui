<template>
	<div class="sitewide-appeal-wrapper" v-if="showAppeal">
		<div class="appeal-banner sitewide-appeal row">
			<div class="row"
				@click="toggleAccordion">
				<div class="appeal-header small-12 padding sitewide-header">
					<h2>
						<!-- IF BONUS APPEAL BANNER -->
						<span v-if="appealBonusEnabled">Donate to Kiva today and earn a free loan!</span>
						<!-- ELSE STANDARD APPEAL BANNER -->
						<span v-else>Your donations keep Kiva growing</span>
						<kv-icon
							@click="toggleAccordion"
							:class="{ flipped: open }"
							class="toggle-arrow"
							name="medium-chevron" />
					</h2>
				</div>
			</div>

			<kv-expandable easing="ease-in-out">
				<div class="grid-x row"
					v-show="open">
					<div class="sitewide-body cell small-12 medium-2">
						<div class="hide-for-small show-for-medium thermometer-holder">
							<appeal-thermometer
								:amount-raised="amountRaised"/>
						</div>
					</div>
					<div class="cell small-12 medium-10">
						<div class="appeal-copy">
							<!-- IF BONUS APPEAL BANNER -->
							<p v-if="appealBonusEnabled" class="small-text quote">
								Each loan on Kiva costs us more than $3 to facilitate
								(and we facilitate a lot of loans!) so when you donate to Kiva
								you help us cover the costs to grow our impact. <strong> Donate
								$35 or more to kiva today and we'll send you a bonus tomorrow to
								make a free loan. </strong> Your donation of any amount makes a difference!
							</p>
							<!-- IF REGULAR APPEAL BANNER -->
							<p v-else class="small-text">
								Each loan on Kiva costs us more than $3 to facilitate (and we faciliate a lot of loans!)
								so when you donate to Kiva you help us cover costs, grow our impact and develop
								innovative new programs that improve lives. Your donation of any amount
								makes a difference!
							</p>
						</div>
						<div class="show-for-small hide-for-medium thermometer-holder">
							<appeal-thermometer
								:amount-raised="amountRaised"/>
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
							<a
								class="dollar-amount-input show-for-large"
								placeholder="other"
								href="/donate"
								@blur="validateInput">Other amount
							</a>
						</div>
					</div>
				</div>
			</kv-expandable>
		</div>
	</div>
</template>

<script>
// import { readBoolSetting } from '@/util/settingsUtils';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import AppealThermometer from '@/components/WwwFrame/EndOfYearAppealBanner/AppealThermometer';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import KvExpandable from '@/components/Kv/KvExpandable';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import store2 from 'store2';

export default {
	components: {
		KvButton,
		KvIcon,
		AppealThermometer,
		KvExpandable,
	},
	inject: ['apollo'],
	data() {
		return {
			open: true,
			appealEnabled: false,
			appealMatchEnabled: false,
			appealBonusEnabled: false,
			amount: 0,
			donationAmount: null,
		};
	},
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			this.appealEnabled = JSON.parse(_get(data, 'general.appeal_enabled.value', false));

			this.appealMatchEnabled = JSON.parse(_get(data, 'general.appeal_match_enabled.value', false));

			// eslint-disable-next-line max-len
			this.amountRaised = _get(data, 'general.kivaStats.latestDonationCampaign.amount_raised');
			// eslint-disable-next-line max-len
			this.targetAmount = _get(data, 'general.kivaStats.latestDonationCampaign.target_amount');

			// This setting SHOULD be temporary and CANNOT reveal this appeal alone.
			// this.appealBonusEnabled = readBoolSetting(data, 'general.appeal_bonus_active.value');
		},
	},
	computed: {
		showAppeal() {
			// make sure the appeal is enable + we're not on checkout
			return (this.appealEnabled || this.appealMatchEnabled) && this.$route.path !== '/checkout';
		}
	},
	mounted() {
		if (store2.session.get('appeal_banner_shrunk')) {
			this.open = false;
		} else {
			this.open = true;
		}
	},
	methods: {
		toggleAccordion() {
			this.setIsShrunkSession(this.open);
			this.open = !this.open;
		},
		setIsShrunkSession(isShrunk) {
			if (isShrunk) {
				store2.session.set('appeal_banner_shrunk', true);
			} else {
				store2.session.remove('appeal_banner_shrunk');
			}
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

<style lang='scss' scoped>
@import 'settings';
@import "global/transitions";

.sitewide-appeal-wrapper {
	background: $kiva-alert-yellow;

	.sitewide-appeal {
		padding-left: rem-calc(10);
		padding-right: rem-calc(10);
	}

	.thermometer-holder {
		@media #{$medium-up} {
			height: rem-calc(185);
		}
	}

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
