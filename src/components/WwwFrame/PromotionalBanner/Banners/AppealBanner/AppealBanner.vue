<template>
	<div class="sitewide-appeal-wrapper">
		<div class="sitewide-appeal row" @click="toggleAccordion">
			<div class="sitewide-header small-12 medium-9 medium-offset-2 large-9 large-offset-2  columns">
				<h2>
					<span v-html="bannerHeadline" class="strong"></span>
					<kv-icon
						@click="toggleAccordion"
						:class="{ flipped: open }"
						class="toggle-arrow"
						name="medium-chevron"
						:from-sprite="true"
					/>
				</h2>
			</div>

			<kv-expandable easing="ease-in-out">
				<div class="sitewide-body small-12 columns"
					v-show="open"
				>
					<div class="row">
						<div
							class="hide-for-small show-for-medium medium-2 large-1 large-offset-1 columms thermometer-holder"
							:title="`${ percentTowardGoal }% raised`"
						>
							<appeal-thermometer
								:percent-toward-goal="percentTowardGoal"
							/>
						</div>
						<div class="small-12 medium-9 large-8 xlarge-7 columns">
							<div>
								<span
									v-html="bannerBody"
									class="message"
								></span>
								<!-- <span class="strong" v-html="bannerMatchingText"></span> -->
							</div>
							<div class="show-for-small hide-for-medium small-12 columns thermometer-holder">
								<appeal-thermometer
									:percent-toward-goal="percentTowardGoal"
								/>
							</div>
							<div class="donation-buttons">
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
									class="other-amount"
									href="/donate/supportus"
									@blur="validateInput"
									v-kv-track-event="['promo', 'click', 'EOYBanner', 'other-button']"
								>Other amount
								</a>
							</div>
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
import AppealThermometer from '@/components/WwwFrame/PromotionalBanner/Banners/AppealBanner/AppealThermometer';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';
import KvExpandable from '@/components/Kv/KvExpandable';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

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
			this.amountRaised = _get(data, 'general.kivaStats.latestDonationCampaign.amount_raised');
			this.targetAmount = _get(data, 'general.kivaStats.latestDonationCampaign.target_amount');
		},
	},
	computed: {
		isMatchedEnabled(props) {
			console.log(props.appealMatchEnabled);
			return true;
		},
		bannerHeadline(props) {
			const appealHeadline = props.appealBannerContent.richText;
			return documentToHtmlString(appealHeadline);
		},
		bannerBody(props) {
			const appealBody = props.appealBannerContent.additionalContent[0].fields.richText;
			return documentToHtmlString(appealBody);
		},
		// NOT YET HOOKED UP
		// bannerMatchingText(props) {
		// 	let matchingText = props.appealBannerContent.dataObject.matchingTextReplacement;

		// 	if (props.appealMatchEnabled === true) {
		// 		// eslint-disable-next-line max-len
		// 		matchingText = props.appealBannerContent.dataObject.matchingText;
		// 	}
		// 	return matchingText;
		// },
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
	background-color: $kiva-bg-lightgray;

	// .sitewide-appeal-loading {
	// 	display: block;
	// 	text-align: center;

	// 	.loading-spinner {
	// 		width: 2rem;
	// 		height: 2rem;
	// 		margin: 0.5rem;
	// 	}
	// }

	.sitewide-appeal {
		.sitewide-header {
			top: rem-calc(8);
			position: relative;

			h2 {
				font-weight: 700;
				position: relative;
				padding-right: 2.5rem;
				line-height: 1.825rem;
				font-size: rem-calc(25);

				.toggle-arrow.flipped {
					transform: rotate(180deg);
				}

				.toggle-arrow {
					position: absolute;
					top: rem-calc(11);
					right: 0;
					height: rem-calc(25);
					width: rem-calc(25);
					transition:
						transform 0.3s ease,
						-webkit-transform 0.3s ease;
				}
			}
		}

		.thermometer-holder {
			position: relative;

			@include breakpoint(medium) {
				height: rem-calc(155);
			}
		}

		.sitewide-body {
			.row {
				padding-top: 0.75rem;

				// NOT WORKING YET
				.message {
					overflow: hidden;
					line-height: 1.325rem !important;
					margin-bottom: 1.5rem !important;
					font-weight: 300;
				}

				.donation-buttons {
					margin: 0 auto;
					display: table;

					@include breakpoint(medium) {
						margin-bottom: rem-calc(33);
						// margin: 0;
					}

					// Overriding .mini button class, not ideal, but text is too small otherwise
					.mini {
						margin: rem-calc(9);
						margin-bottom: 0;
						font-size: 0.875rem;
						height: 2rem;
						line-height: 0.2rem;
						padding: 1.125rem;
					}

					.other-amount {
						cursor: pointer;
						font-size: 0.925rem;
						width: 100%;
						text-align: center;
						line-height: 2.5;

						@include breakpoint(medium) {
							width: rem-calc(112);
							padding: 0;
							top: rem-calc(7);
							position: relative;
						}

						a:visited {
							color: $blue;
						}
					}
				}
			}
		}
	}
}
</style>
