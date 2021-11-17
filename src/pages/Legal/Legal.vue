<template>
	<www-page
		:header-theme="headerTheme"
	>
		<template #secondary>
			<custom-secondary-menu

				class="hide-for-large"
				:menu-items="menuItems"
			/>
		</template>
		<div class="row page-content">
			<tertiary-menu class="show-for-large large-2 tertiary-menu-terms">
				<ul>
					<li v-for="{name, routerLink} in menuItems" :key="name">
						<router-link
							:to="routerLink"
						>
							{{ name }}
						</router-link>
					</li>
				</ul>
			</tertiary-menu>
			<router-view />
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import TertiaryMenu from '@/components/WwwFrame/TertiaryMenu';
import CustomSecondaryMenu from '@/components/WwwFrame/Menus/CustomSecondaryMenu';
import { lightHeader } from '@/util/siteThemes';

export default {
	components: {
		WwwPage,
		TertiaryMenu,
		CustomSecondaryMenu
	},
	metaInfo: {
		title: 'Terms Of Use'
	},
	data() {
		return {
			headerTheme: lightHeader,
			menuItems: [
				{
					name: 'Privacy Policy',
					routerLink: '/legal/privacy',
				},
				{
					name: 'Terms of Use',
					routerLink: '/legal/terms',
				},
				{
					name: 'Promotional Lending Terms and Conditions',
					routerLink: '/legal/promo-terms',
				}
			],
		};
	},
};
</script>

<style lang="scss">
@import 'settings';

.page-content {
	.tertiary-menu-terms {
		margin: 1.625rem 0;
	}

	h1,
	h3 { font-weight: bold; }

	.twoLineHeader {
		margin-top: 0.75rem;
		margin-bottom: 0.5rem;
	}
}
</style>
