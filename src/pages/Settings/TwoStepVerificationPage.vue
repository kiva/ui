<template>
	<www-page class="two-step-verification" :gray-background="true">
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="title-area">
			<div class="row column">
				<h1>
					2-step verification
				</h1>
			</div>
		</div>
		<div class="row">
			<div class="column small-12 large-8">
				<kv-settings-card :title="cardTitle">
					<template v-slot:icon>
						<!-- TODO: THIS ICON IS A PLACEHOLDER
						Get correct icon assest from design, or remove this KvIcon -->
						<kv-icon
							class="icon"
							title="Auto-lending On"
							name="auto-icon-on"
						/>
					</template>

					<template v-slot:content>
						<p>{{ cardSubhead }}</p>

						<div v-if="MFA">
							<h3 class="strong">
								2-step verification is turned on
							</h3>
							<p>
								We'll ask you for your password and verification code from your
								mobile phone in order to log into your Kiva account.
							</p>
							<a>Turn off 2-step verification</a>
						</div>

						<div v-if="MFA">
							<h3 class="strong">
								Your security method(s)
							</h3>
							<h4>Authenticator app</h4>
							<p>Added:<span>DATE</span></p>
							<a>REMOVE LINK</a>
						</div>

						<h3 class="strong">
							Authentication app <span class="green">(Recommended)</span>
						</h3>
						<p>
							Receive code from an authenticator app on your device,
							like Google Authenticator, Duo, or Authy.
						</p>
						<kv-button class="smallest">
							Use authentication app
						</kv-button>

						<h3 class="strong">
							Text message or phone call
						</h3>
						<p>
							Receive a code via text message on your mobile device.
						</p>
						<kv-button class="smallest">
							Use text message or phone call
						</kv-button>
					</template>
				</kv-settings-card>
			</div>
		</div>
	</www-page>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import KvButton from '@/components/Kv/KvButton';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	data() {
		return {
			MFA: false,
		};
	},
	components: {
		KvIcon,
		KvSettingsCard,
		KvButton,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	metaInfo: {
		title: '2-step verification',
	},
	computed: {
		cardTitle() {
			if (this.MFA) {
				return 'Add a backup method';
			}
			return 'How would you like your verification code?';
		},
		cardSubhead() {
			if (this.MFA) {
				return "Set up additional backup steps so you can log in even if your other options aren't available";
			}
			return "You'll be asked for a verification code when accessing you Kiva account.";
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.two-step-verification {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	.green {
		color: $kiva-green;
	}
}

</style>
