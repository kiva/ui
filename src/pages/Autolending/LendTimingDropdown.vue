<template>
	<div class="lend-timing-dropdown">
		<span>Lend my balance for me</span>
		<kv-select :value="lendAfterDaysIdle" @input="updateLendAfterDaysIdle">
			<option value="0">
				As soon as possible
			</option>
			<option value="7">
				If I haven’t made a loan after 7 days
			</option>
			<option value="14">
				If I haven’t made a loan after 14 days
			</option>
			<option value="45">
				If I haven’t made a loan after 45 days
			</option>
			<option value="90">
				If I haven’t made a loan after 90 days
			</option>
			<option value="120">
				If I haven’t made a loan after 120 days
			</option>
		</kv-select>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import KvSelect from '@/components/Kv/KvSelect';

export default {
	name: 'LendTimingDropdown',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvSelect,
	},
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
					mutation: gql`mutation updateLendAfterDaysIdle($value: Int) {
						autolending @client {
							id
							editProfile(profile: {
								enableAfter: 0
								lendAfterDaysIdle: $value
							})
						}
					}`,
					variables: {
						value: Number(value),
					},
				});
			}
		},
	},
	apollo: {
		query: gql`query lendTimingDropdown {
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

.lend-timing-dropdown {
	margin-bottom: 1rem;

	.dropdown-wrapper {
		display: inline;
	}
}
</style>
