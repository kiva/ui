<template>
	<WwwPage>
		<KvPageContainer>
			<GoalSettingContainer />
		</KvPageContainer>
	</WwwPage>
</template>

<script>
import { KvPageContainer } from '@kiva/kv-components';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import GoalSettingContainer from '#src/components/GoalSetting/GoalSettingContainer';

export default {
	name: 'GoalSetting',
	components: {
		WwwPage,
		KvPageContainer,
		GoalSettingContainer,
	},
};
</script>
