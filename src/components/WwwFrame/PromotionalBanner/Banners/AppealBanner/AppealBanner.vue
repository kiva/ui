<template>
	<div class="sitewide-appeal-wrapper">
		<div class="sitewide-appeal">
			<div class="row"
				@click="toggleAccordion"
			>
				<div class="columns small-12 medium-9 medium-offset-2 large-9 large-offset-2">
					<div class="appeal-header sitewide-header">
						<h2>
							<span v-html="bannerHeadline" class="strong"></span>
						</h2>
						<kv-icon
							@click="toggleAccordion"
							:class="{ flipped: open }"
							class="toggle-arrow"
							name="medium-chevron"
							:from-sprite="true"
						/>
						<kv-expandable easing="ease-in-out">
							<div class="row appeal-content"
								v-show="open"
							>
								<div class="medium-2 large-1 large-offset-1 columms">
									<div
										class="hide-for-small show-for-medium thermometer-holder"
										:title="`${ percentTowardGoal }% raised`"
									>
										<appeal-thermometer
											:percent-toward-goal="percentTowardGoal"
										/>
									</div>
								</div>
								<div class="small-12 medium-9 large-8 xlarge-7 columns sitewide-body">
									<div class="appeal-copy">
										<span v-html="bannerBody"></span>
										<span class="strong" v-html="bannerMatchingText"></span>
									</div>
									<div class="show-for-small hide-for-medium thermometer-holder">
										<appeal-thermometer
											:percent-toward-goal="percentTowardGoal"
										/>
									</div>
									<div class="button-wrapper">
										<kv-button
											class="mini custom-width"
											@click.native.prevent.stop="updateDonationTo(20)"
										>
											$20
										</kv-button>
										<kv-button
											class="mini custom-width"
											@click.native.prevent.stop="updateDonationTo(35)"
										>
											$35
										</kv-button>
										<kv-button
											class="mini custom-width"
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
			</div>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import store2 from 'store2';
import AppealThermometer from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealThermometer';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
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
	props: {
		appealMatchEnabled: {
			type: Boolean,
			default: false,
		},
		appealBannerContent: {
			type: Object,
			default: () => {},
		}
	},
	data() {
		return {
			open: true,
			amount: 0,
			donationAmount: null,
			percentTowardGoal: null,
		};
	},
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			// eslint-disable-next-line max-len
			this.amountRaised = _get(data, 'general.kivaStats.latestDonationCampaign.amount_raised');
			// eslint-disable-next-line max-len
			this.targetAmount = _get(data, 'general.kivaStats.latestDonationCampaign.target_amount');
		},
	},
	computed: {
		isMatchedEnabled(props) {
			console.log(props.appealMatchEnabled);
			return true;
		},
		bannerHeadline(props) {
			const appealHeadline = props.appealBannerContent.richText.content[0].content[0].value;
			return appealHeadline;
		},
		bannerBody(props) {
			// eslint-disable-next-line max-len
			const appealBody = props.appealBannerContent.additionalContent[0].fields.richText.content[0].content[0].value;
			return appealBody;
		},
		bannerMatchingText(props) {
			let matchingText = props.appealBannerContent.dataObject.matchingTextReplacement;
			// console.log('testing', props.appealBannerContent.dataObject.matchingText);
			// console.log('testing', props.appealBannerContent.dataObject.matchingTextReplacement);

			// NOT YET WORKING
			if (props.appealMatchEnabled === true) {
				// eslint-disable-next-line max-len
				matchingText = props.appealBannerContent.dataObject.matchingText;
			}
			return matchingText;
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
		},
	},
};
</script>

<style lang='scss' scoped>
@import 'settings';

.sitewide-appeal-wrapper {
	// background: $kiva-alert-yellow;

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
		overflow: hidden;
		line-height: 1.325rem;
		margin-bottom: 1.5rem;
		font-weight: 300;
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

		.mini {
			margin-bottom: 0;
			font-size: 0.875rem;
			height: 2rem;
			line-height: 0.2rem;
			padding: 1.125rem;
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
		cursor: pointer;
		font-size: 0.925rem;
		width: 100%;
		text-align: center;
		line-height: 2.5;
		font-weight: 400;

		// @include breakpoint(medium) {
		// 	display: inline-block;
		// 	top: rem-calc(4);
		// 	position: relative;
		// }
	}

	.toggle-arrow {
		transition: transform 300ms ease;
		display: block;
		position: absolute;
		top: 0.25rem;
		right: 15%;
		height: 1.5625rem;
		width: 1.5625rem;
	}

	.flipped {
		transform: rotate(180deg);
	}
}
</style>
