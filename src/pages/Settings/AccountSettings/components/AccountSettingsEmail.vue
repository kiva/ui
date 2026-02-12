<template>
	<kv-settings-card
		class="tw-mb-4"
		title="Email"
	>
		<template #content>
			<div
				v-if="!loading"
			>
				<p class="tw-mb-2">
					Current email address: <strong>{{ email }}</strong>
				</p>
				<p class="tw-mb-4 tw-text-small">
					This address is used for login and messages. If you would like to change the email
					address on your Kiva account, click the button below. Clicking this button will send
					a verification email to your current email address. You will need to click the link
					in that email to confirm that you want to change your email address. If you cannot
					access your old email address, please get in touch at
					<a
						href="mailto:contactus@kiva.org"
						class="tw-text-link"
						v-kv-track-event="['user-settings', 'click', 'contact-support-email-link']"
					>contactus@kiva.org</a>.
				</p>
				<kv-button
					variant="secondary"
					:disabled="isRequestingChange"
					@click="requestChange"
					v-kv-track-event="['user-settings', 'click', 'request-email-change']"
				>
					{{ isRequestingChange ? 'Requesting...' : 'Request change' }}
				</kv-button>
			</div>
		</template>
	</kv-settings-card>
</template>

<script>
import logFormatter from '#src/util/logFormatter';

import { KvButton } from '@kiva/kv-components';
import KvSettingsCard from '#src/components/Kv/KvSettingsCard';
import emailQuery from '#src/graphql/query/accountSettings/emailQuery.graphql';
import requestEmailChangeMutation from '#src/graphql/mutation/accountSettings/requestEmailChange.graphql';

export default {
	name: 'AccountSettingsEmail',
	components: {
		KvButton,
		KvSettingsCard,
	},
	inject: ['apollo', 'cookieStore'],
	apollo: [
		{
			query: emailQuery,
			preFetch: true,
			result({ data }) {
				this.loading = false;
				this.email = data?.my?.userAccount?.email ?? '';
			},
		},
	],
	data() {
		return {
			loading: true,
			email: '',
			isRequestingChange: false,
		};
	},
	methods: {
		async requestChange() {
			this.isRequestingChange = true;
			try {
				await this.apollo.mutate({
					mutation: requestEmailChangeMutation,
					refetchQueries: [{ query: emailQuery }],
				});
				this.$showTipMsg('A verification email has been sent to your current email address');
			} catch (error) {
				logFormatter(error, 'error');
				this.$showTipMsg('There was a problem requesting the email change', 'error');
			} finally {
				this.isRequestingChange = false;
			}
		},
	},
};
</script>
