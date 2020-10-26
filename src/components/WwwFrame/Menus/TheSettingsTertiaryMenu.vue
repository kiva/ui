<template>
	<tertiary-menu>
		<ul>
			<li>
				<router-link
					to="/settings/account"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-account']"
				>
					Account Settings
				</router-link>
			</li>
			<li>
				<router-link
					to="/settings/security"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-security']"
				>
					Security and login
				</router-link>
			</li>
			<li>
				<router-link
					to="/settings/credit"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-credit']"
				>
					Credit Settings
				</router-link>
			</li>
			<li>
				<router-link
					to="/settings/email"
					v-kv-track-event="['TertiaryNav','click-MyKiva-Settings-email']"
				>
					Email Preferences
				</router-link>
			</li>
			<li>
				<router-link
					to="/settings/data"
					v-kv-track-event="['TertiaryNav','click-Settings-data']"
				>
					Data Settings
				</router-link>
			</li>
		</ul>
	</tertiary-menu>
</template>

<script>
import TertiaryMenu from '@/components/WwwFrame/TertiaryMenu';

export default {
	components: { TertiaryMenu },
};
</script>
