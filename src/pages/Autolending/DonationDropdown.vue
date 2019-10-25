<template>
	<div class="donation-dropdown">
		<h3 class="filter-title">
			Optional donation to cover the cost of my loans:
		</h3>
		<kv-dropdown-rounded v-model="donation">
			<option value="0">
				0%
			</option>
			<option value="5">
				5%
			</option>
			<option value="10">
				10%
			</option>
			<option value="15">
				15%
			</option>
			<option value="20">
				20%
			</option>
		</kv-dropdown-rounded>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _isFinite from 'lodash/isFinite';
import gql from 'graphql-tag';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

export default {
	inject: ['apollo'],
	components: {
		KvDropdownRounded,
	},
	data() {
		return {
			donation: 15,
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					donationPercentage
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			const donation = _get(data, 'autolending.currentProfile.donationPercentage');
			this.donation = _isFinite(donation) ? donation : 15;
		},
	},
	watch: {
		donation(donation, previousDonation) {
			if (donation !== previousDonation) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { donationPercentage: ${donation} })
						}
					}`,
				});
			}
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.donation-dropdown {
	margin-left: 3rem;
	margin-bottom: 0.5rem;

	.filter-title {
		font-size: 1rem;
		color: $kiva-text-light;
		margin-bottom: 0.5rem;
	}
}
</style>
