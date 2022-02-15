<template>
	<div :class="{ 'overlay-shown': isUserInExp }">
		<div class="sitewide-appeal-wrapper">
			<div
				class="sitewide-appeal row"
				@click="toggleAccordion"
				@keyup.esc="toggleAccordion"
			>
				<div class="sitewide-header small-12 medium-9 medium-offset-2 large-9 large-offset-2  columns">
					<h2>
						<span v-html="bannerHeadline" class="tw-font-medium"></span>
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
													buttonAmount,
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
										v-kv-track-event="['promo', 'click-other', 'AppealBanner', 0, 0]"
									>Other amount
									</a>
								</div>
							</div>
						</div>
					</div>
				</kv-expandable>
			</div>
		</div>

		<!-- GROW-230 -->
		<div :class="this.open ? 'sitewide-overlay' : ''"
			@click="toggleAccordion();"
			v-kv-track-event="[
				'Homepage',
				'EXP-GROW-230-Sept2020',
				'homepage-overlay-click-dismiss',
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
			@click.native="donateButtonToggle();"
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
	inject: ['apollo', 'cookieStore'],
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
			// GROW-230
			forceDismissOverlayExperiment: { id: 'homepage_force_dismiss_overlay', version: 'variant-a' },
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
		// GROW-230
		// Checking to see if user is in experiment
		// Boolean value determins a dynamic class being applied
		// to be used for css overrides
		isUserInExp() {
			if (this.$route.name === 'homepage' && this.forceDismissOverlayExperiment.version === 'variant-b') {
				return true;
			}
			return false;
		},
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
	},
	created() {
		// GROW-230
		if (this.$route.name === 'homepage') {
			// read experiment fragment to get experiment version
			this.forceDismissOverlayExperiment = this.apollo.readFragment({
				id: 'Experiment:homepage_force_dismiss_overlay',
				fragment: experimentVersionFragment,
			});

			// fire analytics with EXP version
			if (this.forceDismissOverlayExperiment.version === 'variant-a') {
				this.$kvTrackEvent(
					'Homepage',
					'EXP-GROW-230-Sept2020',
					'a',
				);
			} else if (this.forceDismissOverlayExperiment.version === 'variant-b') {
				this.$kvTrackEvent(
					'Homepage',
					'EXP-GROW-230-Sept2020',
					'b',
				);
				// if EXP-GROW-230-Sept2020 is active and banner is open/expaned lock the page scroll
				if (this.open) {
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

			// GROW-230
			// Locking/unlocking scroll on homepage as banner opens/closes
			if (this.$route.name === 'homepage') {
				if (this.open) {
					this.lockScroll();
				} else {
					this.unlockScroll();
				}
			}
		},
		// GROW-230
		donateButtonToggle() {
			this.toggleAccordion();
			// Tracking event for the dismiss-button
			this.$kvTrackEvent(
				'Homepage',
				'EXP-GROW-230-Sept2020',
				this.open ? 'homepage-overlay-donate-open' : 'homepage-overlay-donate-close'
			);
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
				this.$kvTrackEvent('promo', 'clickOther', 'EOYBanner', this.amount, this.amount);
			} else {
				this.amount = amount;
				this.$kvTrackEvent('promo', 'click', 'EOYBanner', this.amount, this.amount);
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

// GROW-230 changes
// Hide experiment on all pages
.dismiss-button,
.overlay-content {
	display: none;
}

// Hiding normal accordion chevron on experiment pages
.overlay-shown .toggle-arrow {
	display: none;
}

.overlay-shown .sitewide-header {
	padding-top: rem-calc(50);
	max-width: inherit;

	@include breakpoint(medium) {
		padding-top: inherit;
		max-width: 60%;
	}

	@include breakpoint(xlarge) {
		max-width: 65%;
	}
}
// GROW-230 changes END (more below)

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

// GROW-230 changes
.overlay-shown .sitewide-appeal-wrapper {
	z-index: 1002;
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
	cursor: pointer;

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

	@include breakpoint(375) {
		width: 95%;
	}

	@include breakpoint(medium) {
		top: rem-calc(33);
		right: rem-calc(30);
		width: inherit;
	}

	@include breakpoint(958) {
		top: rem-calc(21);
	}

	@include breakpoint(xga) {
		right: 13%;
	}

	@include breakpoint(1400) {
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
