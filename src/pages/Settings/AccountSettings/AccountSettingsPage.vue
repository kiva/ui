<template>
	<www-page
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>

		<kv-default-wrapper>
			<div>
				<h1 class="tw-mb-4">
					Account Settings
				</h1>
			</div>
			<account-settings-personal-info :countries="countries" />
			<account-settings-email />
			<account-settings-lender-profile :countries="countries" />
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import KvDefaultWrapper from '#src/components/Kv/KvDefaultWrapper';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import allCountriesIsoMapQuery from '#src/graphql/query/allCountriesIsoMap.graphql';
import { parseAllCountriesIsoMapToOptions } from '#src/util/countryOptions';
import AccountSettingsPersonalInfo from './components/AccountSettingsPersonalInfo';
import AccountSettingsEmail from './components/AccountSettingsEmail';
import AccountSettingsLenderProfile from './components/AccountSettingsLenderProfile';

export default {
	name: 'AccountSettingsPage',
	components: {
		AccountSettingsEmail,
		AccountSettingsLenderProfile,
		AccountSettingsPersonalInfo,
		KvDefaultWrapper,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		allCountriesIsoMap: {
			query: allCountriesIsoMapQuery,
			preFetch: true,
			result({ data }) {
				this.countries = parseAllCountriesIsoMapToOptions(data?.general?.allCountriesIsoMap ?? '');
			},
		},
	},
	data() {
		return {
			countries: [],
		};
	},
	head: {
		title: 'Account settings',
	},
};
</script>
