<template>
	<www-page>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-page-container>
			<kv-grid
				class="tw-grid-cols-12"
			>
				<div
					class="tw-col-span-12"
				>
					<h1
						class="tw-text-h1 tw-mt-4 tw-mb-4"
					>
						My Teams
					</h1>
				</div>
				<div
					class="tw-col-span-12 md:tw-col-span-8"
				>
					<my-team-messages-list />
				</div>
				<div
					class="tw-col-span-12 md:tw-col-span-4"
				>
					<my-teams-list />
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import { KvPageContainer, KvGrid } from '@kiva/kv-components';
import MyTeamMessagesList from '#src/components/LendingTeams/MyTeams/MyTeamMessagesList';
import MyTeamsList from '#src/components/LendingTeams/MyTeams/MyTeamsList';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';

export default {
	name: 'MyTeamsPage',
	components: {
		TheMyKivaSecondaryMenu,
		WwwPage,
		KvPageContainer,
		KvGrid,
		MyTeamMessagesList,
		MyTeamsList,
	},
	head: {
		title: 'My Teams',
	},
};
</script>
