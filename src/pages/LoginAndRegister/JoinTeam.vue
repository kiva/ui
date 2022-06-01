<template>
	<www-page>
		<kv-default-wrapper>
			<join-team-form />
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import JoinTeamForm from '@/components/Forms/JoinTeamForm';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';

export default {
	name: 'JoinTeam',
	components: {
		KvDefaultWrapper,
		WwwPage,
		JoinTeamForm
	},
	metaInfo: {
		title: 'Join Team',
	}
};
</script>
