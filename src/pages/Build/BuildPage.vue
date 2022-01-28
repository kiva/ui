<template>
	<www-page>
		<template #secondary>
			<developer-secondary-menu />
		</template>

		<build-page-wrapper class="tw-prose">
			<h1>Developer Home</h1>

			<h2>Hello! We're Open!</h2>
			<p>
				Developers worldwide are helping us make it easy and transparent to
				lend to the working poor via microfinance and the Kiva API.
				This is the home for all the information and tools you need to join us!
			</p>
			<h2>Ready to Explore?</h2>
			<p>
				The documentation section of the site is a manual of sorts for
				working with the API. We talk about conventions and best practices,
				and introduce you to some of the various data objects and how to work
				with them. We recommend that you read through most of the sections
				before embarking on your first application.
			</p>
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
		</build-page-wrapper>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import DeveloperSecondaryMenu from '@/components/WwwFrame/Menus/DeveloperSecondaryMenu';
import BuildPageWrapper from '@/components/Build/BuildPageWrapper';

export default {
	components: {
		DeveloperSecondaryMenu,
		BuildPageWrapper,
		WwwPage,
	},
	metaInfo: {
		title: 'Developer Home'
	},
};
</script>
