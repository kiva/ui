<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Developer Docs</h1>
				<p>
					We created the Kiva API so that anyone with a good idea and some
					software savvy can help us expand the reach of Kiva, taking it into
					new environments and to new audiences, and creating new features for
					the Kiva community to experience our content in new ways.
					True to the name of our developer destination, we want you to help us
					build Kiva.org.
				</p>
				<h2>API Spotlight</h2>
				<p>
					In order to make the API as fast, usable, and mobile-friendly as
					possible we decided to use GraphQL. One of the great things about
					GraphQL is it's self documenting so you can easily explore all the
					functionality by going to the
					<a href="https://api.kivaws.org/graphql">GraphiQL Explorer</a>.
					Click on the "Docs" link in the top right corner to open the Documentation
					Explorer. Click the "play" button to run the query you build.

					The GraphiQL Explorer allows you to practice writing queries
					and viewing the returned results. Try it out!
				</p>
				<h3>GraphQL Sample</h3>
				<p>Find loans raising funds right now at Kiva, newest first.</p>
				<p>
					<code>
						<!-- eslint-disable-next-line max-len -->
						curl -X GET -H "Content-Type: application/json" --data '{"query": "{lend{loans(filters:{status:fundRaising}sortBy:newest){values{id}}}}"}' https://api.kivaws.org/graphql
					</code>
				</p>
				<p>
					For more information on GraphQL itself, and how to write queries,
					please check out these <a href="http://graphql.org/learn/">docs</a>
				</p>
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
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
