<template>
	<custom-secondary-menu :menu-items="menuItems" />
</template>

<script>
import CustomSecondaryMenu from './CustomSecondaryMenu';

export default {
	name: 'DeveloperSecondaryMenu',
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
					name: 'Research',
					routerLink: '/build/research',
				},
				{
					name: 'API',
					url: 'https://gateway.production.kiva.org/graphql',
				},
				{
					name: 'My Apps',
					url: '/build/apps',
				},
				{
					name: 'Code of Conduct',
					routerLink: '/build/code-of-conduct',
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
