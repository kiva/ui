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
				<tertiary-menu class="show-for-large large-2">
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
import WwwPage from '@/components/WwwFrame/WwwPage';
import TertiaryMenu from '@/components/WwwFrame/TertiaryMenu';
import CustomSecondaryMenu from '@/components/WwwFrame/Menus/CustomSecondaryMenu';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';

export default {
	components: {
		KvDefaultWrapper,
		WwwPage,
		TertiaryMenu,
		CustomSecondaryMenu
	},
	metaInfo: {
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
