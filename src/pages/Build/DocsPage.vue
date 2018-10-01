<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Developer Docs</h1>
				<p v-for="(paragraph, index) in developerDocs" :key="index" v-html="paragraph"></p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import DeveloperSecondaryMenu from '@/components/WwwFrame/Menus/DeveloperSecondaryMenu';

export default {
	components: {
		WwwPage,
		DeveloperSecondaryMenu,
	},
	metaInfo: {
		title: 'Developer Docs'
	},
	data() {
		return {
			/* eslint-disable max-len */
			developerDocs: [
				'We created the Kiva API so that anyone with a good idea and some software savvy can help us expand the reach of Kiva, taking it into new environments and to new audiences, and creating new features for the Kiva community to experience our content in new ways. True to the name of our developer destination, we want you to help us build Kiva.org.',
				// eslint-disable-next-line quotes
				`In order to make the API as fast, usable, and mobile-friendly as possible we decided to use GraphQL. One of the great things about GraphQL is it's self documenting so you can easily explore all the functionality by going to <a href="https://api.kivaws.org/graphql">https://api.kivaws.org/graphql</a>, and clicking on the "Docs" link in the top right corner. The GraphiQL app allows you to practice writing queries and viewing the returned results. Try it out!`,
				'For more information on GraphQL itself, and how to write queries, please checkout these <a href="http://graphql.org/learn/">docs</a>',
			],
			/* eslint-enable max-len */
		};
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
