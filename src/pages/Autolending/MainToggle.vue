<template>
	<kv-toggle class="main-toggle" v-model="isEnabled">
		<p class="toggle-text-wrapper">
			<span class="toggle-text">
				<template v-if="isEnabled">
					Auto-lending on
				</template>
				<template v-else>
					Auto-lending off
				</template>
			</span>
			<span class="toggle-sub-text">
				<template v-if="isEnabled">
					Kiva will automatically lend my balance
				</template>
				<template v-else>
					I’ll lend my balance myself
				</template>
			</span>
		</p>
	</kv-toggle>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import KvToggle from '@/components/Kv/KvToggle';

export default {
	inject: ['apollo'],
	components: {
		KvToggle,
	},
	data() {
		return {
			isEnabled: false,
		};
	},
	apollo: {
		query: gql`{
			autolending @client {
				currentProfile {
					isEnabled
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
		},
	},
	watch: {
		isEnabled(enabled, previouslyEnabled) {
			if (enabled !== previouslyEnabled) {
				this.apollo.mutate({
					mutation: gql`mutation {
						autolending @client {
							editProfile(profile: { isEnabled: ${enabled} })
						}
					}`,
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.main-toggle {
	.toggle-text-wrapper {
		margin-top: -0.4rem;
		margin-left: 3rem;
	}

	.toggle-text {
		font-weight: 500;
	}

	.toggle-sub-text {
		font-size: $normal-text-font-size;
		display: block;
		color: $kiva-text-light;
	}
}
</style>
