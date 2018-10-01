<template>
	<custom-secondary-menu :menu-items="menuItems" />
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
					routerLink: '/build-vue',
				},
				{
					name: 'Docs',
					routerLink: '/build-vue/docs',
				},
				{
					name: 'API',
					url: 'https://api.kivaws.org/graphql',
				},
				{
					name: 'Blog',
					url: 'https://blog.build.kiva.org/',
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
