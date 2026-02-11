<template>
	<kv-settings-card
		class="account-settings-personal-info tw-mb-4"
		title="Personal Info"
	>
		<template #content>
			<p class="tw-mb-4 tw-text-small">
				* denotes a required field
			</p>
			<form @submit.prevent="save">
				<div class="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
					<div>
						<label for="firstName" class="tw-block tw-mb-1 tw-font-medium">
							First name *
						</label>
						<kv-text-input
							id="firstName"
							v-model="localForm.firstName"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('firstName', $event)"
						/>
					</div>
					<div>
						<label for="lastName" class="tw-block tw-mb-1 tw-font-medium">
							Last name *
						</label>
						<kv-text-input
							id="lastName"
							v-model="localForm.lastName"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('lastName', $event)"
						/>
					</div>
				</div>
				<div class="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
					<div>
						<label for="streetAddress" class="tw-block tw-mb-1 tw-font-medium">
							Street address
						</label>
						<kv-text-input
							id="streetAddress"
							v-model="localForm.streetAddress"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('streetAddress', $event)"
						/>
					</div>
					<div>
						<label for="city" class="tw-block tw-mb-1 tw-font-medium">
							City
						</label>
						<kv-text-input
							id="city"
							v-model="localForm.city"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('city', $event)"
						/>
					</div>
				</div>
				<div class="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
					<div>
						<label for="state" class="tw-block tw-mb-1 tw-font-medium">
							State/Province
						</label>
						<kv-text-input
							id="state"
							v-model="localForm.state"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('state', $event)"
						/>
					</div>
					<div>
						<label for="postalCode" class="tw-block tw-mb-1 tw-font-medium">
							Postal code
						</label>
						<kv-text-input
							id="postalCode"
							v-model="localForm.postalCode"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('postalCode', $event)"
						/>
					</div>
					<div>
						<label for="countryIsoCode" class="tw-block tw-mb-1 tw-font-medium">
							Country
						</label>
						<KvSelect
							id="countryIsoCode"
							v-model="localForm.countryIsoCode"
							:disabled="isSaving"
							@update:model-value="updateForm('countryIsoCode', $event)"
						>
							<option value="">
								--
							</option>
							<option
								v-for="c in countries"
								:key="c.isoCode"
								:value="c.isoCode"
							>
								{{ c.name }}
							</option>
						</KvSelect>
					</div>
				</div>
				<div>
					<kv-button
						type="submit"
						:disabled="isSaving"
					>
						{{ isSaving ? 'Saving...' : 'Save personal info' }}
					</kv-button>
				</div>
			</form>
		</template>
	</kv-settings-card>
</template>

<script>
import logFormatter from '#src/util/logFormatter';

import { KvButton, KvSelect, KvTextInput } from '@kiva/kv-components';
import KvSettingsCard from '#src/components/Kv/KvSettingsCard';
import personalInfoQuery from '#src/graphql/query/accountSettings/personalInfoQuery.graphql';
import updateContactRecordMutation from '#src/graphql/mutation/accountSettings/updateContactRecord.graphql';
import updateFirstLastNameMutation from '#src/graphql/mutation/accountSettings/updateFirstLastName.graphql';

const defaultForm = () => ({
	firstName: '',
	lastName: '',
	streetAddress: '',
	city: '',
	state: '',
	postalCode: '',
	countryIsoCode: '',
});

export default {
	name: 'AccountSettingsPersonalInfo',
	components: {
		KvButton,
		KvSelect,
		KvSettingsCard,
		KvTextInput,
	},
	props: {
		countries: {
			type: Array,
			default: () => [],
		},
	},
	inject: ['apollo', 'cookieStore'],
	apollo: [
		{
			query: personalInfoQuery,
			preFetch: true,
			result({ data }) {
				const userAccount = data?.my?.userAccount ?? {};
				const contactRecord = userAccount?.contactRecord ?? {};
				this.localForm = {
					firstName: userAccount.firstName ?? '',
					lastName: userAccount.lastName ?? '',
					streetAddress: contactRecord.streetAddress ?? '',
					city: contactRecord.city ?? '',
					state: contactRecord.state ?? '',
					postalCode: contactRecord.postalCode ?? '',
					countryIsoCode: contactRecord.country?.isoCode ?? '',
				};
			},
		},
	],
	data() {
		return {
			isSaving: false,
			localForm: defaultForm(),
		};
	},
	methods: {
		updateForm(field, value) {
			this.localForm = { ...this.localForm, [field]: value };
		},
		async save() {
			this.isSaving = true;
			try {
				const {
					firstName, lastName, streetAddress, city, state, postalCode, countryIsoCode
				} = this.localForm;

				const [nameResult, contactResult] = await Promise.all([
					this.apollo.mutate({
						mutation: updateFirstLastNameMutation,
						variables: { firstName: firstName || null, lastName: lastName || null },
						refetchQueries: [{ query: personalInfoQuery }],
					}),
					this.apollo.mutate({
						mutation: updateContactRecordMutation,
						variables: {
							streetAddress: streetAddress || null,
							city: city || null,
							state: state || null,
							postalCode: postalCode || null,
							countryIsoCode: countryIsoCode || null,
						},
						refetchQueries: [{ query: personalInfoQuery }],
					}),
				]);

				const nameResponse = nameResult?.data?.my?.updateFirstLastName;
				const contactResponse = contactResult?.data?.my?.updateContactRecord;
				if (nameResponse && !nameResponse.success) {
					throw new Error(nameResponse.error || 'Failed to update name');
				}
				if (contactResponse && !contactResponse.success) {
					throw new Error('Failed to update contact information');
				}

				this.$showTipMsg('Personal info saved successfully');
			} catch (error) {
				logFormatter(error, 'error');
				const errorMsg = error?.message || 'There was a problem saving your personal info';
				this.$showTipMsg(errorMsg, 'error');
			} finally {
				this.isSaving = false;
			}
		},
	},
};
</script>
