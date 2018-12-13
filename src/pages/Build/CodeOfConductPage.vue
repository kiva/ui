<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Code Of Conduct</h1>
				<p>
					We really want you to be creative and have a fun time using the Kiva API,
					but you can easily spoil the fun for yourself or everyone if you write
					an application that (unknowingly or not) doesn't play by the rules.
				</p>
				<h2>1. Abide by the developer Terms of Service</h2>
				<p>
					Before you develop an application on the Kiva API we must insist you
					read the Terms of Service. Our staff and some pretty smart lawyers
					worked really hard on these to protect you, Kiva, and our lenders.
					You must understand and abide by these terms
				</p>
				<h2>2. Respect our users and their dignity</h2>
				<p>
					Both borrowers and lenders have profiles on Kiva for the purposes of
					eradicating poverty through microfinance. Please respect the dignity
					of both, and create experiences that help us toward our mission.
					Disrespect of our users will not be tolerated.
				</p>
				<h2>3. Don't misrepresent the data</h2>
				<p>
					To the best of your ability, please reflect data from the API accurately.
					For example, don't make an application that uses Kiva photos or
					descriptions to help promote your own cause, even if you think the
					data is related or the cause is just. Representing a loan in your
					application should be done for the sole purpose of promoting that loan
					for funding or communicating to others the story of that loan and entrepreneur
					as it appears on Kiva.
				</p>
				<p>
					Additionally, please make sure you understand the data structure of
					responses, represent fields properly (e.g., don't confuse the loan
					schedule with the loan payments), and draw conclusions or aggregate
					statistics from the data accurately. We understand you might make mistakes,
					but it is your responsibility to fix egregious mistakes if we or others
					find them.
				</p>
				<h2>4. Do not use the API for commercial use</h2>
				<p>
					Kiva is a 501(c)(3) non-profit and, by law, we cannot allow our
					resources to be used for commercial purposes. Commercial entities can
					use the API to charitable ends in line with Kiva's mission, but if you
					have any doubts that what you are doing is within our terms of service,
					please contact us.
				</p>
				<h2>5. Be your own brand</h2>
				<p>
					We're excited that you want to help us build applications and experiences
					for the Kiva community, but we do ask that you maintain your own brand.
					This means users should understand that your products are yours alone
					and not owned or operated by Kiva. You can use the Kiva logo or color
					scheme within reason for purposes of associating the content with Kiva,
					just don't call your application "Kiva Mobile." A name like "Mobile Loaner"
					might be more appropriate.
				</p>
				<h2>6. Be nice to the API servers</h2>
				<p>
					Share and share alike. The more often you make calls to the API,
					the less resources there are available for other developers and the more
					Kiva's operating expenses rise. Don't request data you don't need.
					Cache data when possible. Refreshed cached data only when it expires or
					you hit a cache miss (e.g., you come across an image URL template that
					is previously unknown to you). If your application is slow because you
					are making a lot of API calls or the API calls take a long time to return,
					you're probably doing something wrong. If you think that's not the case,
					please bring up your situation in the forums so we can help you or modify
					the API to make what you want to do faster and less demanding on the system.
				</p>
				<h2>7. Link images back to Kiva whenever possible</h2>
				<p>
					When writing applications that use Kiva images, we'd like you to hyperlink
					those images back to Kiva — either to a full-size image hosted by Kiva or
					to a entrepreneur or lender profile as appropriate. If you have a great
					idea for linking the image to something else in your application, that's
					okay, we'd just like for you eventually to provide a link to the associated
					data on Kiva somewhere in the application flow. This helps you communicate
					copyright of the data back to Kiva.
				</p>
				<h2>8. Use app_id in your requests</h2>
				<p>
					When making API calls or linking back to Kiva, please pass an App ID
					in your request. Currently, this isn't required by the Terms Of Service,
					but consider it a polite way of saying hello and letting us know who's
					using the API. In the future we hope to return the favor by giving you
					stats on how your app is doing.
				</p>
				<h2>9. Offer your users the ability to donate to Kiva</h2>
				<p>
					Kiva relies on the donations we ask for at checkout. Either ask your
					users for a donation and set it in the request to the basket, or
					leave it blank so we can set it to our suggested default amount.
				</p>
				<h2>10. Keep your data in sync with the API</h2>
				<p>
					We understand the need to download Kiva's data and store it locally.
					However, for regulatory and policy reasons, such data can only be stored
					for a limited time.
				</p>
				<p>
					If Kiva's data changes, this will be reflected in the API. You must
					keep local copies of Kiva's data in-sync with the current data available
					through the API.
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
		title: 'Code of Conduct'
	}
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
