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
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
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
			lendAfterDaysIdle: 0
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
				}
				savedProfile {
					enableAfter
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.enableAfter = _get(data, 'autolending.savedProfile.enableAfter');
			// flag user as one who had auto lending set
			this.legacyAutoLender = this.enableAfter > 0;
			this.changedTiming = _get(data, 'autolending.currentProfile.enabledAfter') !== this.enableAfter;
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
