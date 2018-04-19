<template>
	<secondary-menu>
		<ul class="row">
			<li><router-link to="/portfolio">Portfolio</router-link></li>
			<li><router-link to="/teams/my-teams">My teams</router-link></li>
			<li><router-link to="/account/messages">Messages</router-link></li>
			<li><router-link to="/settings">Settings</router-link></li>
			<li v-if="isborrower"><router-link to="/my/borrower">Borrower Dashboard</router-link></li>
			<li v-if="istrustee"><router-link to="/my/trustee">Trustee Dashboard</router-link></li>
		</ul>
	</secondary-menu>
</template>

<script>
import SecondaryMenu from '@/components/WwwFrame/SecondaryMenu';

export default {
	components: {
		SecondaryMenu
	},
	props: {
		istrustee: {
			type: Boolean,
			default: false
		},
		isborrower: {
			type: Boolean,
			default: false
		}
	}
};
</script>

