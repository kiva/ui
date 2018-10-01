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
					url: '/build-vue',
				},
				{
					name: 'Docs',
					url: '/build-vue/docs',
				},
				{
					name: 'API',
					url: 'https://api.kivaws.org/graphql',
					externalLink: true,
				},
				{
					name: 'Blog',
					url: 'https://blog.build.kiva.org/',
					externalLink: true,
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
