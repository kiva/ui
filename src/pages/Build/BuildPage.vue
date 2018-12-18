<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Developer Home</h1>

				<h2>Hello! We're Open!</h2>
				<p>
					Developers worldwide are helping us make it easy and transparent to
					lend to the working poor via microfinance and the Kiva API.
					This is the home for all the information and tools you need to join us!
				</p>
				<p>
					<!-- eslint-disable-next-line max-len -->
					We created the Kiva API so that anyone with a good idea and some software savvy can help us expand the reach of Kiva, taking it into new environments and to new audiences, and creating new features for the Kiva community to experience our content in new ways. True to the name of our developer destination, we want you to help us build Kiva.org.
				</p>

				<h2>Ready to Explore?</h2>
				<p>
					Check out our <a href="https://api.kivaws.org/graphql"> GraphQL API methods</a>.
				</p>
				<h2>Share your app </h2>
				<p>
					Let the world experience microlending through
					<a href="http://pages.kiva.org/apps">the applications you've built</a>!

				</p>
				<h2>Discussion</h2>
				<p>
					Here are recent topics from our developer forum.
					Join our <a href="http://groups.google.com/group/build-kiva">Google Group</a>
					and take part in the discussion.
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
		title: 'Developer Home'
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
