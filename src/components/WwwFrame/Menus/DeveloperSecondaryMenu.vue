<template>
	<custom-secondary-menu :menu-items="menuItems" :uses-exact-paths="true" />
</template>

<script>
import CustomSecondaryMenu from './CustomSecondaryMenu';

export default {
	components: {
		CustomSecondaryMenu,
	},
	data() {
		return {
			menuItems: [
				{
					name: 'Developer Home',
					routerLink: '/build',
				},
				{
					name: 'Docs',
					routerLink: '/build/docs',
				},
				{
					name: 'API',
					url: 'https://api.kivaws.org/graphql',
				},
				{
					name: 'My Apps',
					url: '/build/apps',
				},
			],
		};
	},
};
</script>

<style lang="scss">
</style>
