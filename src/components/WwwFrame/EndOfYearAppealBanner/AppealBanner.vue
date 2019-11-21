<template>
	<div class="sitewide-appeal-wrapper" v-if="showAppeal">
		<div class="sitewide-appeal">
			<div class="row"
				@click="toggleAccordion"
			>
				<div class="appeal-header small-12 columns sitewide-header">
					<h2>
						<!-- IF ALTERNATE APPEAL BANNER -->
						<!-- current version implemented has bonus language,
						but we're using the appealMatchedEnabled flag -->
						<span v-if="appealMatchEnabled">Donate to Kiva today and earn up to 2 free loans!</span>
						<!-- ELSE STANDARD APPEAL BANNER -->
						<span v-else>Your donations keep Kiva growing</span>
						<kv-icon
							@click="toggleAccordion"
							:class="{ flipped: open }"
							class="toggle-arrow"
							name="medium-chevron"
						/>
					</h2>
				</div>
			</div>

			<kv-expandable easing="ease-in-out">
				<div class="row appeal-content"
					v-show="open"
				>
					<div class="small-12 medium-1 columms">
						<div
							class="hide-for-small show-for-medium thermometer-holder"
							:title="`${ percentTowardGoal }% raised`"
						>
							<appeal-thermometer
								:percent-toward-goal="percentTowardGoal"
							/>
						</div>
					</div>
					<div class="small-12 medium-10 columns sitewide-body">
						<div class="appeal-copy">
							<!-- IF ALTERNATE APPEAL BANNER -->
							<!-- current version implemented has bonus language,
							but we're using the appealMatchedEnabled flag -->
							<p v-if="appealMatchEnabled">
								We're extending our spring donation drive by 1 day only!
								<strong> TODAY when you donate $25 to Kiva, we'll send you a $25 bonus
									to make a free loan. Donate $50 and you'll get $50 to lend!
								</strong> That's up to 2 loans when you help fund our work creating opportunity.
							</p>
							<!-- IF REGULAR APPEAL BANNER -->
							<p v-else>
								Each loan on Kiva costs us more than $3 to facilitate (and we faciliate a lot of loans!)
								so when you donate to Kiva you help us cover costs, grow our impact and develop
								innovative new programs that improve lives. Your donation of any amount
								makes a difference!
							</p>
						</div>
						<div class="show-for-small hide-for-medium thermometer-holder">
							<appeal-thermometer
								:percent-toward-goal="percentTowardGoal"
							/>
						</div>
						<div class="button-wrapper">
							<kv-button
								class="smallest custom-width"
								@click.native.prevent.stop="updateDonationTo(20)"
							>
								$20
							</kv-button>
							<kv-button
								class="smallest custom-width"
								@click.native.prevent.stop="updateDonationTo(35)"
							>
								$35
							</kv-button>
							<kv-button
								class="smallest custom-width"
								@click.native.prevent.stop="updateDonationTo(50)"
							>
								$50
							</kv-button>
							<a
								class="other-amount-link"
								href="/donate/supportus"
								@blur="validateInput"
								v-kv-track-event="['promo', 'click', 'EOYBanner', 'other-button']"
							>Other amount
							</a>
						</div>
					</div>
				</div>
			</kv-expandable>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import store2 from 'store2';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import AppealThermometer from '@/components/WwwFrame/EndOfYearAppealBanner/AppealThermometer';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import KvExpandable from '@/components/Kv/KvExpandable';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';

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
			amount: 0,
			donationAmount: null,
			percentTowardGoal: null
		};
	},
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			try {
				this.appealEnabled = JSON.parse(_get(data, 'general.appeal_enabled.value', false));
			} catch (e) {
				this.appealEnabled = false;
			}

			try {
				this.appealMatchEnabled = JSON.parse(_get(data, 'general.appeal_match_enabled.value', false));
			} catch (e) {
				this.appealMatchEnabled = false;
			}
			// eslint-disable-next-line max-len
			this.amountRaised = _get(data, 'general.kivaStats.latestDonationCampaign.amount_raised');
			// eslint-disable-next-line max-len
			this.targetAmount = _get(data, 'general.kivaStats.latestDonationCampaign.target_amount');
		},
	},
	computed: {
		showAppeal() {
			// make sure the appeal is enable + we're not on certain blacklisted pages
			const blacklist = [
				'/checkout',
				'/error',
				'/join-team',
				'/register/social',
				'/possibility/giving-tuesday',
				'/possibility/12-days-of-lending',
				'/possibility/year-end'
			];
			return (this.appealEnabled || this.appealMatchEnabled) && !blacklist.includes(this.$route.path);
		},
	},
	mounted() {
		if (store2.session.get('appeal_banner_shrunk')) {
			this.open = false;
		} else {
			this.open = true;
		}
		this.calculateAmountRaised();
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
		calculateAmountRaised() {
			// calculating the % toward the appeal banner fundraising goal
			this.percentTowardGoal = Math.round((this.amountRaised / this.targetAmount) * 100);
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
		}
	},
};
</script>

<style lang='scss' scoped>
@import 'settings';

.sitewide-appeal-wrapper {
	background: $kiva-alert-yellow;

	.sitewide-appeal {
		padding-right: rem-calc(10);
	}

	.appeal-content {
		padding: 0.4rem 0;
	}

	.sitewide-body {
		@include breakpoint(medium) {
			padding-bottom: 1.25rem;
		}
	}

	.thermometer-holder {
		@include breakpoint(medium) {
			height: rem-calc(195);
			top: rem-calc(19);
			left: -2.5rem;
			position: relative;
		}
	}

	.appeal-copy {
		margin-bottom: 1.25rem;
	}

	h2 {
		font-weight: 300;
		margin-top: 0.3rem;
		padding-right: 2.5rem;
		font-size: rem-calc(28);
	}

	.icon {
		width: rem-calc(25);
		height: rem-calc(40);
		cursor: pointer;
	}

	.button-wrapper {
		text-align: center;

		@include breakpoint(medium) {
			text-align: left;
		}

		.custom-width {
			margin-right: rem-calc(15);
			margin-bottom: 0;
		}
	}

	button.submit-button {
		vertical-align: super;
		padding: 0.9rem 0;
		width: 46%;

		@include breakpoint(large) {
			width: 17%;
		}
	}

	.other-amount-link {
		margin: auto;
		line-height: 2.5;
		display: block;
		font-size: 1.25rem;
		font-weight: 400;

		@include breakpoint(medium) {
			display: inline-block;
			top: rem-calc(4);
			position: relative;
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
