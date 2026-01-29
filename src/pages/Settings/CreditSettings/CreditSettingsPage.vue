<template>
	<www-page
		class="credit-settings-page"
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>

		<kv-default-wrapper>
			<div class="row">
				<div class="columns small-12 large-8">
					<h1 class="tw-mb-4">
						Credit Settings
					</h1>

					<credit-settings-linked-section
						title="Subscriptions settings"
						description="Manage your Monthly Good or Auto Deposit settings"
						to="/settings/subscriptions"
					/>
					<credit-settings-linked-section
						title="Auto-lending settings"
						description="Turn auto-lending on or off and customize how your balance is put to work"
						to="/settings/autolending"
					/>

					<template v-if="!loading">
						<credit-settings-repayment
							v-model="form.donateRepayments"
							:disabled="loading"
						/>
						<credit-settings-inactivity
							:inactive-credit-recipient="form.inactiveCreditRecipient"
							:paypal-email-address="form.inactiveCreditEmailAddress"
							@update:inactive-credit-recipient="form.inactiveCreditRecipient = $event"
							@update:paypal-email-address="form.inactiveCreditEmailAddress = $event"
							:disabled="loading"
						/>
					</template>

					<div class="tw-mt-3">
						<kv-button
							:disabled="!isChanged || isSaving || v$.$invalid"
							@click="saveSettings"
						>
							{{ isSaving ? 'Saving...' : 'Save settings' }}
						</kv-button>
						<button
							v-if="isChanged && !isSaving"
							class="tw-text-link tw-font-medium tw-ml-2"
							@click="resetForm"
						>
							Reset
						</button>
					</div>
				</div>

				<div class="columns small-12 large-4">
					<credit-settings-sidebar
						:loading="loading"
						:balance="balance"
						:promo-balance="promoBalance"
						class="tw-mt-3 lg:tw-mt-0"
					/>
				</div>
			</div>
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import numeral from 'numeral';
import { useVuelidate } from '@vuelidate/core';
import { email, requiredIf } from '@vuelidate/validators';

import { KvButton } from '@kiva/kv-components';
import KvDefaultWrapper from '#src/components/Kv/KvDefaultWrapper';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import creditSettingsQuery from '#src/graphql/query/creditSettings/creditSettingsQuery.graphql';
import updateDonateRepaymentsMutation from '#src/graphql/mutation/updateDonateRepayments.graphql';
import updateInactiveCreditRecipientSettingsMutation
	from '#src/graphql/mutation/updateInactiveCreditRecipientSettings.graphql';

import CreditSettingsInactivity from './components/CreditSettingsInactivity';
import CreditSettingsLinkedSection from './components/CreditSettingsLinkedSection';
import CreditSettingsRepayment from './components/CreditSettingsRepayment';
import CreditSettingsSidebar from './components/CreditSettingsSidebar';

const INACTIVE_RECIPIENT_OPTIONS = ['kiva', 'email_address'];
const DEFAULT_INACTIVE_RECIPIENT = 'kiva';

export default {
	name: 'CreditSettingsPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		CreditSettingsInactivity,
		CreditSettingsLinkedSection,
		CreditSettingsRepayment,
		CreditSettingsSidebar,
		KvButton,
		KvDefaultWrapper,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	head: {
		title: 'Credit settings',
	},
	data() {
		return {
			loading: true,
			isSaving: false,
			balance: 0,
			promoBalance: 0,
			form: {
				donateRepayments: null,
				inactiveCreditRecipient: '',
				inactiveCreditEmailAddress: '',
			},
			initialValues: {},
		};
	},
	setup() {
		return { v$: useVuelidate() };
	},
	validations() {
		return {
			form: {
				inactiveCreditEmailAddress: {
					requiredIf: requiredIf(() => this.form.inactiveCreditRecipient === 'email_address'),
					email,
				},
			},
		};
	},
	apollo: {
		query: creditSettingsQuery,
		preFetch: true,
		result({ data }) {
			const ua = data?.my?.userAccount;
			if (!ua) {
				this.loading = false;
				return;
			}

			this.balance = numeral(ua.balance ?? 0).value();
			this.promoBalance = numeral(ua.promoBalance ?? 0).value();
			this.form.donateRepayments = typeof ua.donateRepayments === 'boolean' ? ua.donateRepayments : false;
			this.form.inactiveCreditRecipient = this.normalizeInactiveRecipient(ua.inactiveAccountSetting);
			this.form.inactiveCreditEmailAddress = ua.inactiveAccountEmailAddress ?? '';
			this.initialValues = JSON.parse(JSON.stringify(this.form));
			this.loading = false;
		},
	},
	computed: {
		isChanged() {
			return JSON.stringify(this.initialValues) !== JSON.stringify(this.form);
		},
	},
	methods: {
		normalizeInactiveRecipient(value) {
			const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
			return INACTIVE_RECIPIENT_OPTIONS.includes(normalized) ? normalized : DEFAULT_INACTIVE_RECIPIENT;
		},
		resetForm() {
			this.form = { ...this.initialValues };
		},
		async saveSettings() {
			this.isSaving = true;
			try {
				await this.saveDonateRepayments();
				await this.saveInactiveCreditRecipient();
				await this.apollo.query({ query: creditSettingsQuery, fetchPolicy: 'network-only' });
				this.initialValues = JSON.parse(JSON.stringify(this.form));
				this.$showTipMsg('Your credit settings have been saved');
			} catch (e) {
				this.$showTipMsg('There was a problem saving your settings', 'error');
			} finally {
				this.isSaving = false;
			}
		},
		async saveDonateRepayments() {
			const res = await this.apollo.mutate({
				mutation: updateDonateRepaymentsMutation,
				variables: { donateRepayments: this.form.donateRepayments },
			});
			const result = res?.data?.my?.updateDonateRepayments;
			if (res?.errors || result?.success === false) {
				throw new Error(
					result?.error || result?.value || res?.errors?.[0]?.message || 'Donate repayments update failed'
				);
			}
		},
		async saveInactiveCreditRecipient() {
			const res = await this.apollo.mutate({
				mutation: updateInactiveCreditRecipientSettingsMutation,
				variables: {
					recipient: this.form.inactiveCreditRecipient,
					emailAddress: this.form.inactiveCreditRecipient === 'email_address'
						? this.form.inactiveCreditEmailAddress
						: null,
				},
			});
			const result = res?.data?.my?.updateInactiveCreditRecipientSettings;
			if (res?.errors || result?.success === false) {
				throw new Error(
					result?.error || result?.value || res?.errors?.[0]?.message || 'Inactivity settings update failed'
				);
			}
		},
	},
};
</script>
