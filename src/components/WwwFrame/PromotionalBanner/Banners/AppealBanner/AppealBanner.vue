<template>
	<div ref="pageOverlay" class="test">
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

				<kv-expandable
					easing="ease-in-out"
				>
					<div class="sitewide-body small-12 columns"
						v-show="open"
					>
						<div class="row">
							<!-- eslint-disable-next-line max-len -->
							<div class="hide-for-small show-for-medium medium-2 large-1 large-offset-1 columms thermometer-holder"
								:title="`${ percentTowardGoal }% raised`"
							>
								<appeal-thermometer
									:percent-toward-goal="percentTowardGoal"
									:open="open"
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
									<ul>
										<li v-for="(buttonAmount, index) in buttonAmounts"
											:key="index"
										>
											<kv-button
												class="mini custom-width"
												@click.native.prevent.stop="updateDonationTo(buttonAmount)"
												v-kv-track-event="[
													'promo',
													'click-amount-btn',
													'AppealBanner',
													buttonAmount
												]"
											>
												${{ buttonAmount }}
											</kv-button>
										</li>
									</ul>
									<a
										class="other-amount"
										href="/donate/supportus"
										@blur="validateInput"
										v-kv-track-event="['promo', 'click-other', 'AppealBanner', 0]"
									>Other amount
									</a>
								</div>
							</div>
						</div>
					</div>
				</kv-expandable>
			</div>
		</div>
		<div :class="this.open ? 'sitewide-overlay' : ''"
			@click="toggleAccordion();"
			v-kv-track-event="[
				'promo',
				'homepage-overlay',
				'continue-to-site-dismiss'
			]"
		>
			<div class="overlay-content">
				<h3>
					Continue to site
				</h3>
			</div>
		</div>
		<kv-button
			class="smaller dismiss-button"
			:class="this.open ? 'white-button' : ''"
			ref=""
			@click.native="toggleAccordion();"
			v-kv-track-event="[
				'promo',
				'homepage-overlay',
				'remind-me-later-dismiss'
			]"
		>
			{{ this.open ? 'Donate later' : 'Donate' }}
		</kv-button>
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
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import lockScrollUtils from '@/plugins/lock-scroll';
import { documentToHtmlString } from '~/@contentful/rich-text-html-renderer';

export default {
	components: {
		KvButton,
		KvIcon,
		AppealThermometer,
		KvExpandable,
	},
	mixins: [
		lockScrollUtils,
	],
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
		bannerHeadline(props) {
			const appealHeadline = props.appealBannerContent.richText;
			return documentToHtmlString(appealHeadline);
		},
		bannerBody(props) {
			const appealBody = props.appealBannerContent.additionalContent[0].fields.richText;
			return documentToHtmlString(appealBody);
		},
		buttonAmounts(props) {
			const defaultAmounts = [20, 35, 50];
			// eslint-disable-next-line max-len
			return props.appealBannerContent.dataObject.donationAmounts && props.appealBannerContent.dataObject.donationAmounts.length ? props.appealBannerContent.dataObject.donationAmounts : defaultAmounts;
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

		// Grow-230
		// Set dynamic class to override css on homepage only
		if (this.$route.name === 'homepage') {
			this.$refs.pageOverlay.classList.add('overlay-shown');
		}
	},
	created() {
		if (this.$route.name === 'homepage') {
			// read experiment fragment to get experiment version
			const forceDismissOverlayExperiment = this.apollo.readFragment({
				id: 'Experiment:homepage_force_dismiss_overlay',
				fragment: experimentVersionFragment,
			});
			// fire analytics with exp version
			if (forceDismissOverlayExperiment.version === 'variant-a') {
				this.$kvTrackEvent(
					'Homepage',
					'EXP-GROW-230-Sept2020',
					'a',
				);
			} else if (forceDismissOverlayExperiment.version === 'variant-b') {
				this.$kvTrackEvent(
					'Homepage',
					'EXP-GROW-230-Sept2020',
					'b',
				);
				// if EXP is active and banner is open/expaned lock the scroll
				if (this.open) {
					// Lock scroll
					this.$nextTick(() => {
						this.lockScroll();
					});
				}
			}
		}
	},
	methods: {
		toggleAccordion() {
			this.setIsShrunkSession(this.open);
			this.open = !this.open;

			// Grow-230
			// Locking/unlocking scroll on homepage as banner opens/closes
			if (this.$route.name === 'homepage') {
				if (this.open) {
					this.lockScroll();
				} else {
					this.unlockScroll();
				}
			}
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
// Hide dismiss button on all pages
.dismiss-button,
.overlay-content {
	display: none;
}

// Overriding styles for homepage changes
.overlay-shown .toggle-arrow {
	// .overlay-content {
	display: none;
}

.overlay-shown .sitewide-header {
	padding-top: 50px;
	max-width: inherit;

	@include breakpoint(medium) {
		padding-top: inherit;
		max-width: 60%;
	}

	@include breakpoint(xlarge) {
		max-width: 65%;
	}
}

.sitewide-appeal-wrapper {
	background-color: $kiva-bg-lightgray;

	.sitewide-appeal {
		padding: 0.75rem 0.625rem 0.75rem;

		.sitewide-header {
			top: rem-calc(8);
			position: relative;

			h2 {
				::v-deep p {
					// contentful rich text content is wrapped in a p tag, this removes all styles from it
					font-weight: 700;
					position: relative;
					padding-right: 2.5rem;
					line-height: 1.825rem;
					font-size: rem-calc(25);
				}

				.toggle-arrow.flipped {
					transform: rotate(180deg);
				}

				.toggle-arrow {
					position: absolute;
					top: rem-calc(5);
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

				.message {
					::v-deep p {
						// contentful rich text content is wrapped in a p tag, this removes all styles from it
						overflow: hidden;
						line-height: 1.325rem;
						margin-bottom: 1.5rem;
						font-weight: 300;
					}
				}

				.donation-buttons {
					margin: 0 auto;
					display: table;

					@include breakpoint(medium) {
						margin: unset;
						margin-bottom: rem-calc(20);
					}

					ul {
						list-style: none;
						display: flex;

						@include breakpoint(medium) {
							margin-left: 0;
						}

						li {
							width: inherit;
							padding-bottom: 0;

							@include breakpoint(medium) {
								width: unset;
							}

							// Overriding .mini button class, not ideal, but text is too small otherwise
							.mini {
								margin-right: rem-calc(20);
								margin-bottom: 0;
								font-size: 0.875rem;
								height: rem-calc(36);
								line-height: 0.2rem;
								padding: 1.125rem;
								box-shadow: none;
								border-radius: 0;
							}
						}
					}

					.other-amount {
						cursor: pointer;
						font-size: 0.925rem;
						width: 100%;
						text-align: center;
						line-height: 2.5;
						margin: 0 auto rem-calc(12) auto;
						display: block;
						white-space: nowrap;

						@include breakpoint(medium) {
							width: rem-calc(112);
							padding: 0;
							margin: unset;
							display: table-cell;
							font-weight: 400;
						}

						a:visited {
							color: $blue;
						}
					}
				}
			}
		}

		// .sitewide-body.thermometerStart {
		// 	overflow: visible;
		// }
	}
}

.overlay-shown .sitewide-appeal-wrapper {
	z-index: 2000;
	position: relative;
}

.overlay-shown .sitewide-overlay {
	background: rgba(0, 0, 0, 0.7);
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1001;
	display: flex;

	.overlay-content {
		position: absolute;
		top: 75%;
		display: block;
		left: 50%;
		margin-left: rem-calc(-63.75);
		color: white;
	}
}

.overlay-shown .dismiss-button {
	display: block;
	z-index: 2002;
	position: absolute;
	top: rem-calc(19);
	font-size: 0.9rem;
	padding: rem-calc(10) rem-calc(20);
	right: rem-calc(10);
	width: 94%;

	@include breakpoint(375px) {
		width: 95%;
	}

	@include breakpoint(medium) {
		top: rem-calc(33);
		right: rem-calc(30);
		width: inherit;
	}

	@include breakpoint(958px) {
		top: rem-calc(21);
	}

	@include breakpoint(xga) {
		right: 13%;
	}

	@include breakpoint(1400px) {
		right: 20%;
	}

	&.white-button {
		// Overriding button styles
		background-color: white;
		color: $kiva-accent-blue;
		border: 1px solid gray;
		box-shadow: none;
	}
}
</style>
