<template>
	<secondary-menu>
		<ul class="row">
			<li><router-link to="/portfolio">Portfolio</router-link></li>
			<li><router-link to="/teams/my-teams">My teams</router-link></li>
			<li><router-link to="/account/messages">Messages</router-link></li>
			<li><router-link to="/settings">Settings</router-link></li>
		</ul>
	</secondary-menu>
</template>

<script>
import SecondaryMenu from '@/components/WwwFrame/SecondaryMenu';

export default {
	components: {
		SecondaryMenu
	}
};
</script>

