<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Getting Started</h1>
				<p>Here are some tips to help you get started.</p>

				<h2>Step 1: Read the developer Terms Of Service and Code Of Conduct</h2>
				<p>
					We know you are eager to start working with code, but it is important
					that you read and understand the Terms of Service and Code of Conduct.
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
					<a href="https://api.kivaws.org/graphql?query=query{lend{loans%20(filters:{status:fundRaising}%20sortBy:newest){values{id%20name%20loanAmount}}}}">
						Query for newest fundraising loans
					</a>
				</p>
				<p>Try changing up some of the parameters and see how the search results
				change.
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
		title: 'Getting Started'
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
