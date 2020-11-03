<template>
	<div class="row">
		<div class="column small-12 large-8">
			<kv-settings-card title="Password">
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
					<p>
						Clicking this button will send you a verification email.
						As a final step in this process, you'll need to click the
						link in that email to successfully update your account password.
					</p>
					<kv-button
						class="smaller"
						@click.native="onClickRequestPassword"
						:disabled="isPasswordRequestPending"
					>
						Send change password email
					</kv-button>
				</template>
			</kv-settings-card>
		</div>
	</div>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import gql from 'graphql-tag';

const userQuery = gql`query getUserEmail {
	my {
		userAccount {
			id
			email
		}
	}
}`;

const passwordResetMutation = gql`mutation passwordReset {
	my {
		sendChangePasswordEmail
	}
}`;

export default {
	components: {
		KvButton,
		KvIcon,
		KvSettingsCard,
	},
	inject: ['apollo'],
	data() {
		return {
			userEmail: null,
			isPasswordRequestPending: false,
			isPasswordRequestSuccess: false,
			isPasswordRequestFailure: false
		};
	},
	mounted() {
		this.loadUserEmail(); // load user email async since it's not crucial
	},
	methods: {
		loadUserEmail() {
			this.apollo.query({
				query: userQuery
			}).then(({ data }) => {
				this.userEmail = data?.my?.userAccount?.email;
			}).catch(err => {
				console.error(err);
			});
		},
		async onClickRequestPassword() {
			this.isPasswordRequestPending = true;
			this.isPasswordRequestSuccess = false;
			this.isPasswordRequestFailure = false;
			try {
				await this.apollo.mutate({
					mutation: passwordResetMutation
				});
				const msg = this.userEmail // TODO: What's the text here?
					? `Email has been sent to ${this.userEmail}`
					: 'Email has been sent to the address on file';
				this.isPasswordRequestSuccess = true;
				this.$showTipMsg(msg);
			} catch (err) {
				console.error(err);
				this.isPasswordRequestFailure = true; // TODO: Do we want an error message for the user?
			}
			this.isPasswordRequestPending = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

</style>
