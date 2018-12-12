<template>
	<www-page>
		<developer-secondary-menu slot="secondary" />
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Terms Of Service</h1>
				<p>Last updated: February 19, 2013</p>
				<h1 style="text-align:center">KIVA DEVELOPER TERMS OF SERVICE</h1>
				<p>
					By using the Kiva API provided by Kiva Microfunds (“Kiva”), you (the “Licensee”) agree to this Developer Terms of Service (“Agreement”). The following are incorporated by reference into this Agreement: (a) the Kiva Terms of Use (located at http://www.kiva.org/legal/terms) and (b) the Kiva Privacy Policy (located at http://www.kiva.org/legal/privacy). In the event of any irreconcilable conflict between this Agreement and any of the Kiva Terms of Use or Kiva Privacy Policy, the provisions of this Agreement shall govern. This Agreement may be modified by Kiva in its sole discretion from time to time and such modifications shall automatically become part of this Agreement and shall be effective once posted by Kiva on the Kiva Website (as indicated by the posted update date). Your License will be subject to any such modifications. You should review the Website and this Agreement from time to time for any modifications. If you do not agree with any such modifications, please immediately terminate your use of the Licensed API (as defined below), as outlined in Section 11 below.
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
		title: 'Terms Of Service'
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
