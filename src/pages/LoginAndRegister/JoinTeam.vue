<template>
	<www-page>
		<kv-page-container class="tw-py-4 md:tw-py-6 lg:tw-py-8">
			<join-team-form />
		</kv-page-container>
	</www-page>
</template>

<script>
import JoinTeamForm from '@/components/Forms/JoinTeamForm';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		KvPageContainer,
		WwwPage,
		JoinTeamForm
	},
	metaInfo: {
		title: 'Join Team',
	}
};
</script>
