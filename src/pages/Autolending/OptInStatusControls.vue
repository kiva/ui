<template>
	<div>
		<div class="columns large-10" v-show="!idleCreditOptIn && !isEnabled">
			<blockquote>
				<em>
					You currently have auto-lending turned off and are opted out of this feature.
					If you turn it on you are electing to participate in this feature.
				</em>
			</blockquote><br>
		</div>
		<div
			class="columns large-10"
			v-show="showOptOutControls && idleCreditOptIn && !isEnabled && inactiveCreditEligible"
		>
			<blockquote>
				<em>
					You're scheduled to be enrolled in 90-day auto-lending starting Feb 20, 2020.
					<kv-button
						id="opt-out-button"
						class="setting secondary"
						@click.native.prevent="optedIn = false"
					>
						Opt out of this change
					</kv-button>
				</em>
			</blockquote><br>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton
	},
	inject: ['apollo'],
	props: {
		idleCreditOptIn: {
			type: Boolean,
			required: true
		},
		isEnabled: {
			type: Boolean,
			required: true
		},
		showOptOutControls: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			inactiveCreditEligible: true,
			optedIn: this.idleCreditOptIn
		};
	},
	apollo: {
		query: gql`{
			my {
				userAccount {
					id
					inactiveAccountSetting
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.inactiveCreditEligible = _get(data, 'my.userAccount.inactiveAccountSetting') !== 'email_address';
		},
	},
	watch: {
		optedIn(optIn) {
			if (optIn !== true) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { idleCreditOptIn: ${optIn} })
						}
					}`,
				}).then(() => {
					this.apollo.mutate({
						mutation: gql`mutation {
							autolending @client {
								saveProfile
							}
						}`
					}).then(() => {
						this.$showTipMsg('Your settings have been saved');
					}).catch(e => {
						console.error(e);
						this.$showTipMsg('There was a problem saving your settings', 'error');
					});
				});
			}
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

#opt-out-button {
	display: block;
	margin-top: 0.25rem;
}
</style>
