<template>
	<ul>
		<li>
			<router-link
				to="/settings/account"
				class="settings-tertitary-menu-link"
				exact-active-class="settings-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-account']"
			>
				Account
			</router-link>
		</li>
		<li v-if="isMfaActive">
			<router-link
				to="/settings/security"
				class="settings-tertitary-menu-link"
				exact-active-class="settings-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-security']"
			>
				Security and login
			</router-link>
		</li>
		<li>
			<router-link
				to="/settings/credit"
				class="settings-tertitary-menu-link"
				exact-active-class="settings-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-credit']"
			>
				Credit
			</router-link>
		</li>
		<li>
			<router-link
				to="/settings/payments"
				class="settings-tertitary-menu-link"
				exact-active-class="settings-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-payments']"
			>
				Payments
			</router-link>
		</li>
		<li>
			<router-link
				to="/settings/email"
				class="settings-tertitary-menu-link"
				exact-active-class="settings-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-email']"
			>
				Email
			</router-link>
		</li>
		<li>
			<router-link
				to="/settings/data"
				class="settings-tertitary-menu-link"
				exact-active-class="settings-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-Settings-data']"
			>
				Data
			</router-link>
		</li>
		<li>
			<router-link
				to="/lend/saved-search"
				class="settings-tertitary-menu-link"
				exact-active-class="settings-tertitary-menu-active-link"
				v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-saved-searches']"
			>
				Saved searches
			</router-link>
		</li>
	</ul>
</template>

<script>
import { gql } from '@apollo/client';

export default {
	name: 'TheSettingsTertiaryMenu',
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			isMfaActive: false,
		};
	},
	apollo: {
		query: gql`query mfaFeatureFlagQuery {
			general {
				mfaEnabled: featureSetting(key: "mfa.enabled") {
					key
					value
				}
			}
		}`,
		preFetch: true,
		result({ data }) {
			this.isMfaActive = data?.general?.mfaEnabled?.value === 'true';
		},
	},
};
</script>

<style lang="postcss" scoped>
.settings-tertitary-menu-link {
	@apply tw-block tw-px-2 tw-py-1;
}

.settings-tertitary-menu-active-link {
	@apply tw-text-tertiary;
}
</style>
