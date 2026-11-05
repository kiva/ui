<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
	<!-- eslint-disable max-len -->
	<div class="small-12 large-10 columns tw-prose">
		<h1 class="tw-text-display">
			Cookie and Data Policy
		</h1>

		<section>
			<h2 class="tw-text-headline">
				What are cookies and web beacons?
			</h2>
			<p>
				Cookies are small text files placed on your device by websites you visit, to allow those websites to recognize you. Cookies may be set by the site you are visiting or by third parties, such as those who serve content or provide advertising or analytics services. Web beacons are small graphic files embedded invisibly on websites and used to track online movements from page to page. Unlike cookies, web beacons are not stored on your device. Kiva uses cookies and similar technologies like web beacons for purposes like:
			</p>
			<ul>
				<li>Ensuring the Website functions properly when you do things like place a Loan in your checkout basket;</li>
				<li>Personalizing the Website to your requirements and remembering your settings;</li>
				<li>Displaying Kiva advertising to you when you visit other websites;</li>
				<li>Helping Kiva understand how visitors use the site and how we can enhance our Users’ experience.</li>
			</ul>
			<p>
				Some of these cookies are placed by Kiva and some are placed by third-party service providers (see the table below for more information). Kiva controls which third-party cookies may be set through the Website.
			</p>
		</section>

		<section id="manage-settings">
			<h2 class="tw-text-headline">
				How can I manage cookies and data sharing?
			</h2>
			<p>
				Most internet browsers allow you to manage cookies placed on your device by websites you visit (for example, accepting all cookies, disallowing all cookies, blocking third-party cookies, or accepting cookies only from trusted sites). Your browser should provide instructions for how to manage your browser's cookie settings. If you choose to prevent all cookies, Kiva’s Website may not work as intended, since we use cookies to keep track of your personal session when you use the Website. All cookies placed by Kiva are set to expire in two years or less, but you can clear the cookies on your device at any time. Please note that if you disable cookies, web beacons may still load, but they will have limited functionality.
			</p>
			<p>
				Kiva also provides a method to opt out of non-essential cookies placed by Kiva and our third-party service providers. Whether or not you are not logged into a Kiva account, you can change your session cookie preferences here:
				<button
					type="button"
					class="ot-sdk-show-settings tw-text-link tw-underline tw-font-medium"
					v-kv-track-event="['CookiePolicy', 'click-Cookie-Settings']"
					@click="openCookieSettings"
				>Cookie Settings</button>.
				You can also choose to opt out of analytics and marketing cookies whenever you are logged into your Kiva account by changing your preferences on the
				<router-link
					to="/settings/data"
					v-kv-track-event="['CookiePolicy', 'click-Data-Settings']"
				>data settings page</router-link>.
			</p>
			<div class="tw-not-prose tw-flex tw-flex-wrap tw-gap-2 tw-my-3">
				<kv-button
					variant="secondary"
					class="ot-sdk-show-settings"
					v-kv-track-event="['CookiePolicy', 'click-Cookie-Settings']"
					@click="openCookieSettings"
				>
					Cookie Settings
				</kv-button>
				<kv-button
					variant="secondary"
					to="/settings/data"
					v-kv-track-event="['CookiePolicy', 'click-Data-Settings']"
				>
					Data Settings
				</kv-button>
			</div>
		</section>

		<section>
			<h2 class="tw-text-headline">
				What kinds of cookies does Kiva use?
			</h2>
			<p>
				The following table explains the types of cookies used on our website:
			</p>
			<table>
				<thead>
					<tr>
						<th>Type of cookie</th>
						<th>Explanation</th>
						<th>Set by</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Login<br>(Strictly Necessary)</td>
						<td>Keeps you logged into the Website. These cookies collect information such as your IP address and date and time of your last visit.</td>
						<td>Kiva<br>Auth0</td>
					</tr>
					<tr>
						<td>Session and preferences<br>(Strictly Necessary)</td>
						<td>Remembers your user settings and tracks your interactions with the Website to facilitate site functionality. These cookies collect information such as your browser user-agent, browser language, and device type.</td>
						<td>Kiva<br>Auth0<br>Optimizely</td>
					</tr>
					<tr>
						<td>Analytics<br>(Performance)</td>
						<td>Tracks behavior on the Website in order to better understand Users and make improvements. These cookies collect information such as Web pages you’ve visited, your page load time, and detailed information about your interactions with web pages.</td>
						<td>Faro<br>Hotjar<br>Optimizely<br>Snowplow (Kiva Analytics)</td>
					</tr>
					<tr>
						<td>Advertising and marketing<br>(Targeting)</td>
						<td>Tracks your path to the Website; determines whether to show you retargeting ads on Facebook and other platforms. These cookies collect information such as whether you visited the Website and made a loan, and referral sources to the Website.</td>
						<td>Facebook<br>Google Ads<br><span class="tw-bg-caution">Google Analytics</span><br>LinkedIn<br>Microsoft Advertising<br>Pinterest<br>TikTok<br>X</td>
					</tr>
				</tbody>
			</table>
		</section>
	</div>
</template>

<script>
import { KvButton } from '@kiva/kv-components';

export default {
	name: 'CookiePolicy',
	components: {
		KvButton,
	},
	head: {
		title: 'Cookie Policy'
	},
	methods: {
		openCookieSettings() {
			// OneTrust only binds .ot-sdk-show-settings elements that exist when the SDK initializes,
			// so after client-side navigation the class alone does nothing. Call the SDK directly.
			// If the SDK hasn't loaded or is blocked, do nothing; the Data Settings link is alongside.
			window.OneTrust?.ToggleInfoDisplay?.();
		},
	},
};
</script>
