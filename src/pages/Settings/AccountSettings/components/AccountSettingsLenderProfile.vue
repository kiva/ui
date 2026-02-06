<template>
	<kv-settings-card
		class="tw-mb-4"
		title="My Lender Profile"
	>
		<template #content>
			<div
				v-if="!loading"
			>
				<!-- Profile image -->
				<ProfileImageUpload
					:image-url="lenderImageUrl"
					:disabled="isSaving"
					@update:image-id="updateForm('imageId', $event)"
				/>

				<!-- Lender page URL -->
				<div class="tw-mb-4">
					<div class="tw-flex tw-gap-2 tw-mb-1">
						<label for="publicId" class="tw-font-medium">
							My lender page URL
						</label>
						<a
							v-if="lenderPageUrl"
							:href="lenderPageUrl"
							target="_blank"
							rel="noopener noreferrer"
							class="tw-text-link"
						>
							View your lender page »
						</a>
					</div>
					<div class="tw-flex tw-items-center tw-gap-1">
						<span class="tw-text-small tw-text-secondary">{{ lenderPageUrlBase }}</span>
						<kv-text-input
							id="publicId"
							v-model="localForm.publicId"
							type="text"
							:disabled="isSaving"
							maxlength="24"
							@update:model-value="updateForm('publicId', $event)"
						/>
					</div>
				</div>

				<!-- Name, City -->
				<div class="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
					<div>
						<label for="name" class="tw-block tw-mb-1 tw-font-medium">
							Name
						</label>
						<kv-text-input
							id="name"
							v-model="localForm.name"
							type="text"
							:disabled="isSaving"
							maxlength="50"
							@update:model-value="updateForm('name', $event)"
						/>
					</div>
					<div>
						<label for="profileCity" class="tw-block tw-mb-1 tw-font-medium">
							City
						</label>
						<kv-text-input
							id="profileCity"
							v-model="localForm.city"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('city', $event)"
						/>
					</div>
				</div>

				<!-- State/Province, Country -->
				<div class="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
					<div>
						<label for="profileState" class="tw-block tw-mb-1 tw-font-medium">
							State/Province
						</label>
						<kv-text-input
							id="profileState"
							v-model="localForm.state"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('state', $event)"
						/>
					</div>
					<div>
						<label for="profileCountry" class="tw-block tw-mb-1 tw-font-medium">
							Country
						</label>
						<KvSelect
							id="profileCountry"
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

				<!-- Occupation, Website -->
				<div class="tw-flex tw-flex-wrap tw-gap-4 tw-mb-4">
					<div>
						<label for="occupation" class="tw-block tw-mb-1 tw-font-medium">
							Occupation
						</label>
						<kv-text-input
							id="occupation"
							v-model="localForm.occupation"
							type="text"
							:disabled="isSaving"
							@update:model-value="updateForm('occupation', $event)"
						/>
					</div>
					<div>
						<label for="website" class="tw-block tw-mb-1 tw-font-medium">
							Website
						</label>
						<kv-text-input
							id="website"
							v-model="localForm.website"
							type="url"
							:disabled="isSaving"
							class="tw-w-full"
							@update:model-value="updateForm('website', $event)"
						/>
					</div>
				</div>

				<!-- I loan because -->
				<div class="tw-mb-4">
					<label for="loanBecause" class="tw-block tw-mb-1 tw-font-medium">
						I loan because
					</label>
					<textarea
						id="loanBecause"
						v-model="localForm.loanBecause"
						:disabled="isSaving"
						class="tw-w-full tw-p-2 tw-border tw-border-tertiary tw-rounded tw-min-h-20"
						rows="3"
						@input="updateForm('loanBecause', $event.target.value)"
					></textarea>
				</div>

				<!-- About Me -->
				<div class="tw-mb-4">
					<label for="otherInfo" class="tw-block tw-mb-1 tw-font-medium">
						About Me
					</label>
					<textarea
						id="otherInfo"
						v-model="localForm.otherInfo"
						:disabled="isSaving"
						class="tw-w-full tw-p-2 tw-border tw-border-tertiary tw-rounded tw-min-h-20"
						rows="3"
						@input="updateForm('otherInfo', $event.target.value)"
					></textarea>
				</div>

				<!-- Public visibility checkbox -->
				<div class="tw-mb-4">
					<kv-checkbox
						id="public"
						v-model="localForm.public"
						:disabled="isSaving"
						@update:model-value="updateForm('public', $event)"
					>
						Make my page and loans public. If unchecked, the information above will not be displayed.
					</kv-checkbox>
				</div>

				<!-- Save button -->
				<div>
					<kv-button
						:disabled="isSaving"
						@click="save"
					>
						{{ isSaving ? 'Saving...' : 'Save profile info' }}
					</kv-button>
				</div>

				<!-- Footnote -->
				<p class="tw-mt-4 tw-text-small tw-text-secondary">
					Your lender page will also include information about your
					<a href="/portfolio/loans" class="tw-text-link">loans</a>,
					<a href="/community/teams/my-teams" class="tw-text-link">teams</a>
					and
					<a href="/portfolio/invites" class="tw-text-link">accepted invitations</a>.
					All posted information on Kiva falls under our
					<a href="/legal/terms" class="tw-text-link">Terms of Use</a>.
				</p>
			</div>
		</template>
	</kv-settings-card>
</template>

<script>
import logFormatter from '#src/util/logFormatter';

import {
	KvButton, KvCheckbox, KvSelect, KvTextInput
} from '@kiva/kv-components';
import ProfileImageUpload from '#src/components/Settings/ProfileImageUpload';
import KvSettingsCard from '#src/components/Kv/KvSettingsCard';
import { getCountryOptions } from '#src/util/countryOptions';
import lenderProfileQuery from '#src/graphql/query/accountSettings/lenderProfileQuery.graphql';
import updateProfileImageMutation from '#src/graphql/mutation/accountSettings/updateProfileImage.graphql';
import changePublicVisibilityMutation from '#src/graphql/mutation/accountSettings/changePublicVisibility.graphql';
import updateDisplayNameMutation from '#src/graphql/mutation/accountSettings/updateDisplayName.graphql';
import updateLoanBecauseMutation from '#src/graphql/mutation/accountSettings/updateLoanBecause.graphql';
import updateLocationMutation from '#src/graphql/mutation/accountSettings/updateLocation.graphql';
import updateOccupationMutation from '#src/graphql/mutation/accountSettings/updateOccupation.graphql';
import updateOtherInfoMutation from '#src/graphql/mutation/accountSettings/updateOtherInfo.graphql';
import updateProfileUrlMutation from '#src/graphql/mutation/accountSettings/updateProfileUrl.graphql';
import updatePublicIdMutation from '#src/graphql/mutation/accountSettings/updatePublicId.graphql';

const FORM_KEYS = [
	'name', 'publicId', 'imageId', 'city', 'state', 'countryIsoCode',
	'occupation', 'website', 'loanBecause', 'otherInfo', 'public',
];

const defaultForm = () => Object.fromEntries(
	FORM_KEYS.map(k => {
		if (k === 'imageId') return [k, null];
		if (k === 'public') return [k, false];
		return [k, ''];
	}),
);

/** Profile field mutations: run in order, one at a time. */
const PROFILE_MUTATION_CONFIG = [
	{
		changed: (local, initial) => local.name !== initial.name,
		mutation: updateDisplayNameMutation,
		getVariables: form => ({ displayName: form.name ?? '' }),
	},
	{
		changed: (local, initial) => local.publicId !== initial.publicId,
		mutation: updatePublicIdMutation,
		getVariables: form => ({ publicId: form.publicId ?? '' }),
	},
	{
		changed: (local, initial) => local.city !== initial.city
			|| local.state !== initial.state
			|| local.countryIsoCode !== initial.countryIsoCode,
		mutation: updateLocationMutation,
		getVariables: form => ({
			city: form.city ?? '',
			state: form.state ?? '',
			countryIsoCode: form.countryIsoCode ?? '',
		}),
	},
	{
		changed: (local, initial) => local.occupation !== initial.occupation,
		mutation: updateOccupationMutation,
		getVariables: form => ({ occupation: form.occupation ?? '' }),
	},
	{
		changed: (local, initial) => local.website !== initial.website,
		mutation: updateProfileUrlMutation,
		getVariables: form => ({ url: form.website ?? '' }),
	},
	{
		changed: (local, initial) => local.loanBecause !== initial.loanBecause,
		mutation: updateLoanBecauseMutation,
		getVariables: form => ({ loanBecause: form.loanBecause ?? '' }),
	},
	{
		changed: (local, initial) => local.otherInfo !== initial.otherInfo,
		mutation: updateOtherInfoMutation,
		getVariables: form => ({ otherInfo: form.otherInfo ?? '' }),
	},
	{
		changed: (local, initial) => local.public !== initial.public,
		mutation: changePublicVisibilityMutation,
		getVariables: form => ({ public: form.public }),
	},
];

export default {
	name: 'AccountSettingsLenderProfile',
	components: {
		KvButton,
		KvCheckbox,
		KvSelect,
		KvSettingsCard,
		KvTextInput,
		ProfileImageUpload,
	},
	props: {
		lenderPageUrlBase: {
			type: String,
			default: '/lender/',
		},
	},
	inject: ['apollo', 'cookieStore'],
	apollo: [
		{
			query: lenderProfileQuery,
			preFetch: true,
			result({ data }) {
				this.loading = false;
				this.applyProfileData(data);
			},
		},
	],
	data() {
		return {
			loading: true,
			isSaving: false,
			localForm: defaultForm(),
			initialForm: defaultForm(),
			countries: getCountryOptions(),
			lenderImageUrl: '',
		};
	},
	computed: {
		lenderPageUrl() {
			const { publicId } = this.initialForm;
			return publicId ? `${this.lenderPageUrlBase}${publicId}` : '';
		},
	},
	methods: {
		applyProfileData(data) {
			const userAccount = data?.my?.userAccount ?? {};
			const lender = data?.my?.lender ?? {};
			const lenderPage = lender?.lenderPage ?? {};
			const country = lenderPage?.country ?? {};
			const image = lender?.image ?? {};

			this.lenderImageUrl = image?.url ?? '';
			const form = {
				name: lender.name ?? userAccount.firstName ?? '',
				publicId: lender.publicId ?? userAccount.publicId ?? '',
				imageId: image?.id ?? null,
				city: lenderPage.city ?? '',
				state: lenderPage.state ?? '',
				countryIsoCode: country?.isoCode ?? '',
				occupation: lenderPage.occupation ?? '',
				website: lenderPage.url ?? '',
				loanBecause: lenderPage.loanBecause ?? '',
				otherInfo: lenderPage.otherInfo ?? '',
				public: userAccount.public ?? false,
			};
			this.localForm = form;
			this.initialForm = { ...form };
		},
		updateForm(field, value) {
			this.localForm = { ...this.localForm, [field]: value };
		},
		/**
		 * Throws if the mutation response indicates an error.
		 * @param {object} response - Apollo mutation result
		 * @param {string} fallbackMessage
		 */
		checkMutationResponse(response, fallbackMessage = 'Failed to save profile') {
			if (response?.errors?.length) {
				throw new Error(response.errors[0].message || fallbackMessage);
			}
			const result = Object.values(response?.data?.my ?? {}).find(
				v => v && typeof v === 'object' && 'success' in v,
			);
			if (result && !result.success) {
				throw new Error(result?.error || fallbackMessage);
			}
		},
		async save() {
			const { localForm, initialForm } = this;
			const mutationRunners = PROFILE_MUTATION_CONFIG
				.filter(({ changed }) => changed(localForm, initialForm))
				.map(({ mutation, getVariables }) => () => this.apollo.mutate({
					mutation,
					variables: getVariables(localForm),
				}));

			const imageIdChanged = localForm.imageId != null
				&& localForm.imageId !== initialForm.imageId;
			const hasChanges = imageIdChanged || mutationRunners.length > 0;

			if (!hasChanges) {
				return;
			}

			this.isSaving = true;
			try {
				if (imageIdChanged) {
					const response = await this.apollo.mutate({
						mutation: updateProfileImageMutation,
						variables: { imageId: localForm.imageId },
					});
					this.checkMutationResponse(response, 'Failed to update profile image');
				}

				await mutationRunners.reduce(
					(p, runMutation) => p.then(async () => {
						const response = await runMutation();
						this.checkMutationResponse(response);
					}),
					Promise.resolve(),
				);

				const { data } = await this.apollo.query({
					query: lenderProfileQuery,
					fetchPolicy: 'network-only',
				});
				this.applyProfileData(data);
				this.$showTipMsg('Profile saved successfully');
			} catch (error) {
				logFormatter(error, 'error');
				const errorMsg = error?.message || 'There was a problem saving your lender profile';
				this.$showTipMsg(errorMsg, 'error');
			} finally {
				this.isSaving = false;
			}
		},
	},
};
</script>
