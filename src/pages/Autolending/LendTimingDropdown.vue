<template>
	<div class="lend-timing-dropdown">
		<kv-dropdown-rounded :value="lendAfterDaysIdle" @input="updateLendAfterDaysIdle">
			<option value="0">
				As soon as possible
			</option>
			<option value="7">
				If I haven’t made a loan myself after 7 days
			</option>
			<option value="14">
				If I haven’t made a loan myself after 14 days
			</option>
			<option value="45">
				If I haven’t made a loan myself after 45 days
			</option>
			<option value="90">
				If I haven’t made a loan myself after 90 days
			</option>
			<option value="120">
				If I haven’t made a loan myself after 120 days
			</option>
		</kv-dropdown-rounded>
		<span class="text-notice" v-if="legacyAutoLender">{{ autoLendNotice }}</span>
		<span class="text-notice">{{ autolendExplanationText }} </span>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import { differenceInCalendarDays } from 'date-fns';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

export default {
	inject: ['apollo'],
	components: {
		KvDropdownRounded,
	},
	data() {
		return {
			changedTiming: false,
			legacyAutoLender: false,
			enableAfter: null, // legacy setting
			lendAfterDaysIdle: 0,
			cIdleStartTime: null // 'ex: 2018-10-22T23:04:15Z'
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
		// Calculating the number of days a user's balance has been idle
		// daysIdleCalculation() {
		// Calculating the number of days a user's balance has been idle
		// const now = Date.now();
		// Set user's idle start time from graphql to date after converting it to unix time
		// 	const idleStartTime = Date.parse(this.cIdleStartTime);
		//	const daysIdle = differenceInCalendarDays(now, idleStartTime);
		// 	return daysIdle;
		// },
		autolendExplanationText() {
			// Calculating the number of days a user's balance has been idle
			const now = Date.now();
			// Set user's idle start time from graphql to date after converting it to unix time
			const idleStartTime = Date.parse(this.cIdleStartTime);
			const daysIdle = differenceInCalendarDays(now, idleStartTime);
			const daysUntilLend = this.lendAfterDaysIdle - daysIdle;

			// TODO: I need to get user's avaialble credit into this function to use for the following if statment

			// R1: User balance > $25, # of days within dropdown - cIdleStartTime IS POSITIVE
			// if () {
			// eslint-disable-next-line max-len
			// const formedExplanationText = 'Since you haven’t made a loan yourself for ' + `${daysIdle}` + ' days, we will auto-lend your eligible balance after ' + `${daysUntilLend}` + ' days—timing may vary based on loan supply.';
			// }
			// // R2: Balanace is > $25 (greater than)
			// else if() {
			// eslint-disable-next-line max-len
			// const formedExplanationText = 'Since you haven’t made a loan yourself in over ' + `${daysIdle}` + ' days, you will be eligible for auto-lending immediately—timing may vary based on loan supply.';
			// }
			// // R3: Balance is < $25 (less than)
			// eslint-disable-next-line max-len
			const formedExplanationText = 'Your current balance is lower than the minimum loan share amount. The auto-lending timer will begin once your balance reaches $25 through repayments or additional deposits.';
			return formedExplanationText;
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
		updateLendAfterDaysIdle(value) {
			if (value !== this.lendAfterDaysIdle) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: {
								enableAfter: 0
								lendAfterDaysIdle: ${value}
							})
						}
					}`,
				});
			}
		},
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					enableAfter
					lendAfterDaysIdle
					cIdleStartTime
				}
				savedProfile {
					enableAfter
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.enableAfter = _get(data, 'autolending.savedProfile.enableAfter');
			this.cIdleStartTime = _get(data, 'autolending.currentProfile.cIdleStartTime');

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

.lend-timing-dropdown {
	margin-left: 3rem;
	margin-top: -0.5rem;

	// wraps the dropdown correctly for mobile
	::v-deep .dropdown-wrapper select.dropdown { max-width: 100%; }

	.text-notice {
		color: $kiva-text-light;
		font-style: italic;
	}
}
</style>
