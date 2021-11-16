<template>
	<www-page
		:header-theme="headerTheme"
	>
		<div class="row page-content">
			<join-team-form />
		</div>
	</www-page>
</template>

<script>
import JoinTeamForm from '@/components/Forms/JoinTeamForm';
import WwwPage from '@/components/WwwFrame/WwwPage';
import { lightHeader } from '@/util/siteThemes';

export default {
	data() {
		return {
			headerTheme: lightHeader,
		};
	},
	components: {
		WwwPage,
		JoinTeamForm
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem rem-calc(10);
	max-width: rem-calc(340);

	@include breakpoint(medium) {
		padding: 1.625rem 0;
	}
}
</style>
