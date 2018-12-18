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
					name: 'Getting Started',
					routerLink: '/build/getting-started',
				},
				{
					name: 'Data Snaphots',
					routerLink: '/build/data-snapshots',
				},
				{
					name: 'Code of Conduct',
					routerLink: '/build/code-of-conduct',
				},
				{
					name: 'API',
					url: 'https://api.kivaws.org/graphql',
				},
				{
					name: 'My Apps',
					url: '/build/apps',
				},
				{
					name: 'Terms of Service',
					url: '/build/terms-of-service',
				},
			],
		};
	},
};
</script>

<style lang="scss">
</style>
