<template>
	<www-page>
		<template #secondary>
			<developer-secondary-menu />
		</template>
		<build-page-wrapper class="tw-prose">
			<h1>Getting Started</h1>
			<p>Here are some tips to help you get started.</p>

			<h2>Step 1: Read the developer Terms Of Service and Code Of Conduct</h2>
			<p>
				We know you are eager to start working with code, but it is important
				that you read and understand the
				<router-link to="/build/terms-of-service">
					Terms of Service
				</router-link> and
				<router-link to="/build/code-of-conduct">
					Code of Conduct
				</router-link>.
				Start with these to make sure the application you have in mind is in
				the spirit of our terms for use of the API.
			</p>

			<h2>Step 2: Play around with the loan search method</h2>
			<p>Our GraphQL API methods can be tested easily with most any browser</p>
			<p>
				As an example, try out this GraphQL that will return the newest
				loans fundraising on the website:
			</p>
			<p>
				<!-- eslint-disable-next-line max-len -->
				<a href="https://gateway.production.kiva.org/graphql?explorerURLState=N4IgJg9gxgrgtgUwHYBcQC4QEcYIE4CewANsmCRAIZIDOABABQBmAlsSvjesDSpSjC5MYSMHkosaLJAHMAvnRoQ8KAEIF0SBAHcEvAJTAAbpWK4awFmDpJKiOsSpIAgnAgiUcr3JAAaECZ4LJQARqQ0GCAgckA">
					Query for newest fundraising loans
				</a>
			</p>
			<p>
				Try changing up some of the parameters and see how the search results change.
				<br>
				Press the "Play" button on the top left hand corner to see the new results.
				<br>
				Click the "Docs" button on the top right hand corner for information
				about the GraphQL data schema.
			</p>

			<h2>Step 3: Start designing your application!</h2>
			<p>
				Think about the experience you'd like to create for Kiva users.
				Maybe you want to create a notification system for a particular type of
				loan; perhaps you let your users specify the kind of loan about which
				to be notified. Maybe you have an idea for a creative way to show off
				Kiva's statistics or activity on the site. The application might be as
				simple as a widget for a blog that shows off loans you've recently
				made on Kiva.
			</p>
		</build-page-wrapper>
	</www-page>
</template>

<script>
import DeveloperSecondaryMenu from '#src/components/WwwFrame/Menus/DeveloperSecondaryMenu';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import BuildPageWrapper from '#src/components/Build/BuildPageWrapper';

export default {
	name: 'GettingStartedPage',
	components: {
		DeveloperSecondaryMenu,
		BuildPageWrapper,
		WwwPage,
	},
	head: {
		title: 'Getting Started'
	}
};
</script>
