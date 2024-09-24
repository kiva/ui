<template>
	<www-page>
		<kv-default-wrapper>
			<template #secondary>
				<custom-secondary-menu
					class="hide-for-large"
					:menu-items="menuItems"
				/>
			</template>
			<div class="row page-content">
				<tertiary-menu data-testid="tertiary-menu-terms" class="show-for-large large-2">
					<ul>
						<li v-for="{name, routerLink} in menuItems" :key="name" class="tw-mb-2">
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
		</kv-default-wrapper>
	</www-page>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TertiaryMenu from '#src/components/WwwFrame/TertiaryMenu';
import CustomSecondaryMenu from '#src/components/WwwFrame/Menus/CustomSecondaryMenu';
import KvDefaultWrapper from '#src/components/Kv/KvDefaultWrapper';

export default {
	name: 'Legal',
	components: {
		KvDefaultWrapper,
		WwwPage,
		TertiaryMenu,
		CustomSecondaryMenu
	},
	head: {
		title: 'Terms Of Use'
	},
	data() {
		return {
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
