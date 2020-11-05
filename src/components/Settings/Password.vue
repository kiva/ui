<template>
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
			<kv-alert
				v-if="isPasswordRequestSuccess"
				class="alert"
				role="alert"
				variant="success"
				:can-close="true"
			>
				<b>{{ successMsg }}</b>
			</kv-alert>
			<kv-alert
				v-if="isPasswordRequestFailure"
				class="alert"
				role="alert"
				variant="danger"
				:can-close="true"
			>
				There was a problem sending the password reset email
			</kv-alert>
			<kv-button
				class="smallest"
				@click.native="onClickRequestPassword"
				:disabled="isPasswordRequestPending"
			>
				Send change password email
			</kv-button>
		</template>
	</kv-settings-card>
</template>

<script>
import KvAlert from '@/components/Kv/KvAlert';
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
		KvAlert,
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
	computed: {
		successMsg() { // TODO: What's the text here?
			return this.userEmail
				? `Email has been sent to ${this.userEmail}`
				: 'Email has been sent to the address on file';
		}
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
				this.isPasswordRequestSuccess = true;
			} catch (err) {
				console.error(err);
				this.isPasswordRequestFailure = true;
			}
			this.isPasswordRequestPending = false;
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.alert {
	margin: 1rem 0 1.5rem;
}
</style>
