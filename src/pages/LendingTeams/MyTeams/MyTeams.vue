<template>
	<www-page>
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
					<my-team-messages />
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
import MyTeamMessages from './MyTeamMessages';
import MyTeamsList from './MyTeamsList';

export default {
	name: 'MyTeams',
	components: {
		WwwPage,
		KvPageContainer,
		KvGrid,
		MyTeamMessages,
		MyTeamsList,
	},
};
</script>
