<template>
	<div class="lend-timing-messaging">
		<div v-if="legacyAutoLender">
			<span class="tw-text-tertiary tw-italic">{{ autoLendNotice }}</span>
		</div>
		<div
			data-test="timing-explanation"
			class="autolend-explanation-text tw-text-brand"
			v-if="isEnabled && this.cIdleStartTime !== null"
		>
			{{ autolendExplanationText }}
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import { differenceInCalendarDays } from 'date-fns';
import numeral from 'numeral';

export default {
	name: 'LendTimingMessaging',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			changedTiming: false,
			legacyAutoLender: false,
			isEnabled: false,
			enableAfter: null, // legacy setting
			lendAfterDaysIdle: 0,
			cIdleStartTime: null,
			userBalance: 0,
			donationPercentage: 15
		};
	},
	computed: {
		// returns legacy setting descriptions based on legacy enableAfter setting value
		autoLendNotice() {
			let legacyAutoLendDescription;
			switch (this.enableAfter) {
				case 0:
					legacyAutoLendDescription = 'Whenever I have credit available';
					break;
				case 1:
					legacyAutoLendDescription = 'If I don\'t log in for 1 Month';
					break;
				case 2:
					legacyAutoLendDescription = 'If I don\'t log in for 2 Months';
					break;
				case 3:
					legacyAutoLendDescription = 'If I don\'t log in for 3 Months';
					break;
				case 6:
					legacyAutoLendDescription = 'If I don\'t log in for 6 Months';
					break;
				case 12:
					legacyAutoLendDescription = 'If I don\'t log in for 1 Year';
					break;
				case 18:
					legacyAutoLendDescription = 'If I don\'t log in for 1.5 Years';
					break;
				default:
					return '';
			}

			let notice = `Notice: Your previous setting was '${legacyAutoLendDescription}'`;
			notice += this.changedTiming ? '.' : ', the closest matching setting above will be applied upon save.';
			return notice;
		},
		autolendExplanationText() {
			const userBalance = numeral(this.userBalance).value();
			const loanAndDonationAmount = numeral((1 + this.donationPercentage / 100) * 25).value();
			const loanAndDonationAmountFormatted = numeral((1 + this.donationPercentage / 100) * 25).format('0,0.00');

			// Lender's balance is lower that the amount of a loan share + their chosen donation percentage
			if (!this.cIdleStartTime || userBalance < loanAndDonationAmount) {
				// eslint-disable-next-line max-len
				return `Your current balance is lower than the minimum loan share amount. The auto-lending timer will begin once your balance reaches $${loanAndDonationAmountFormatted} through repayments or additional deposits.`;
			}

			const idleStartTime = Date.parse(this.cIdleStartTime);
			const daysIdle = differenceInCalendarDays(new Date(), idleStartTime);
			const daysUntilLend = this.lendAfterDaysIdle - daysIdle > 0 ? this.lendAfterDaysIdle - daysIdle : 0;

			// cash-1883
			if (daysIdle === 0) {
				// eslint-disable-next-line max-len
				return `You're currently active! You'll be eligible for auto-lending if you don't make a loan yourself in the next ${this.lendAfterDaysIdle} days.`;
			}

			// R1: User balance > $25 + the user's , # of days within dropdown - cIdleStartTime is greater than 0
			if (daysUntilLend > 0) {
				// eslint-disable-next-line max-len
				return `Since you haven’t made a loan yourself for ${daysIdle} days, we will auto-lend your eligible balance after ${daysUntilLend} days—timing may vary based on loan supply.`;
			}
			// eslint-disable-next-line max-len
			return `Since you haven’t made a loan yourself in over ${daysIdle} days, you will be eligible for auto-lending immediately—timing may vary based on loan supply.`;
		}
	},
	methods: {
		convertEnableAfterToNewSetting(value) {
			switch (value) {
				case 0:// 'Whenever I have credit available'
					return 0;
				case 1:// 'If I don\'t log in for 1 Month'
					return 45;
				case 2:// 'If I don\'t log in for 2 Months'
					return 45;
				case 3:// 'If I don\'t log in for 3 Months';
					return 90;
				case 6:// 'If I don\'t log in for 6 Months';
				case 12:// 'If I don\'t log in for 1 Year'
				case 18:// 'If I don\'t log in for 1.5 Years'
					return 120;
				default:
					return 0;
			}
		},
	},
	apollo: {
		query: gql`query LendTimingMessaging {
			my {
				id
				userAccount {
					id
					balance
				}
			}
			autolending @client {
				id
				currentProfile {
					id
					isEnabled
					enableAfter
					lendAfterDaysIdle
					cIdleStartTime
					donationPercentage
				}
				savedProfile {
					id
					enableAfter
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = _get(data, 'autolending.currentProfile.isEnabled');
			this.enableAfter = _get(data, 'autolending.savedProfile.enableAfter');
			this.cIdleStartTime = _get(data, 'autolending.currentProfile.cIdleStartTime');
			this.userBalance = _get(data, 'my.userAccount.balance');
			this.donationPercentage = _get(data, 'autolending.currentProfile.donationPercentage');

			// flag user as one who had auto lending set
			this.legacyAutoLender = this.enableAfter > 0;
			this.changedTiming = _get(data, 'autolending.currentProfile.enableAfter') !== this.enableAfter;
			if (this.legacyAutoLender && !this.changedTiming) {
				this.lendAfterDaysIdle = this.convertEnableAfterToNewSetting(this.enableAfter);
			} else {
				this.lendAfterDaysIdle = _get(data, 'autolending.currentProfile.lendAfterDaysIdle');
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.lend-timing-messaging > div {
	margin-top: 1.5rem;
}

.autolend-explanation-text {
	max-width: 30rem;
}
</style>
