<template>
	<div
		v-if="visible"
		class="tw-absolute tw-inset-0 tw-bg-black tw-transition-all tw-duration-150 tw-z-modal
            tw-mt-8 md:tw-mt-9 tw-pt-0.5"
		:class="{
			'tw-bg-opacity-0 tw-delay-300': !open,
			'tw-bg-opacity-low': open,
		}"
		@click.self="closeSideSheet"
	>
		<div
			class="tw-absolute tw-right-0 tw-transition-all tw-duration-300 tw-bg-white tw-rounded-l-lg"
			:class="{
				'tw-w-0 tw-p-0 tw-delay-200': !open,
				'is-open tw-p-3': open,
			}"
		>
			<div
				class="tw-flex tw-justify-between tw-transition-opacity tw-delay-200"
				:class="{
					'tw-opacity-0 tw-duration-0': !open,
					'tw-opacity-full tw-duration-200': open,
				}"
			>
				<h3>Settings</h3>

				<button
					class="hover:tw-text-action-highlight"
					@click="closeSideSheet"
				>
					<kv-material-icon
						class="tw-w-3 tw-h-3"
						:icon="mdiClose"
					/>
				</button>
			</div>
			<div
				class="tw-overflow-y-auto tw-transition-opacity tw-delay-200"
				:class="{
					'tw-opacity-0 tw-duration-0': !open,
					'tw-opacity-full tw-duration-500': open,
				}"
			>
				<section class="tw-mt-3">
					<p class="tw-text-subhead tw-text-secondary">
						Profile settings
					</p>
					<ul>
						<li
							v-for="setting in profileSettingsOptions"
							:key="setting.text"
							class="tw-mt-1.5 hover:tw-translate-x-1 hover:lg:tw-translate-x-2 tw-duration-300"
						>
							<router-link
								class="tw-text-primary tw-font-medium"
								:to="setting.link"
								v-kv-track-event="[
									'SecondaryNav links',
									'click',
									`profile settings - ${setting.text}`
								]"
							>
								{{ setting.text }}
							</router-link>
						</li>
					</ul>
				</section>
				<section class="tw-mt-3">
					<p class="tw-text-subhead tw-text-secondary">
						Lending and impact
					</p>
					<ul>
						<li
							v-for="setting in lendingOptions"
							:key="setting.text"
							class="tw-mt-1.5 hover:tw-translate-x-1 hover:lg:tw-translate-x-2 tw-duration-300"
						>
							<component
								:is="setting.isDonate && !parseFloat(userBalance) ? 'span' : 'router-link'"
								class="tw-text-primary tw-font-medium"
								:to="returnLendingUrl(setting)"
								v-kv-track-event="[
									'SecondaryNav links',
									'click',
									`lending and impact - ${setting.text}`
								]"
							>
								{{ setting.text }}
							</component>
						</li>
					</ul>
				</section>
				<section class="tw-mt-3">
					<p class="tw-text-subhead tw-text-secondary">
						Community
					</p>
					<ul>
						<li
							v-for="setting in communityOptions"
							:key="setting.text"
							class="tw-mt-1.5 hover:tw-translate-x-1 hover:lg:tw-translate-x-2 tw-duration-300"
						>
							<router-link
								class="tw-text-primary tw-font-medium"
								:to="setting.link"
								v-kv-track-event="[
									'SecondaryNav links',
									'click',
									`community - ${setting.text}`
								]"
							>
								{{ setting.text }}
							</router-link>
						</li>
					</ul>
				</section>
			</div>
		</div>
	</div>
</template>

<script>
import { mdiClose } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'MyKivaNavigation',
	components: {
		KvMaterialIcon,
	},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		userBalance: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			open: false,
			mdiClose,
			profileSettingsOptions: [
				{ link: '/settings/account', text: 'Account' },
				{ link: '/settings/security', text: 'Security and login' },
				{ link: '/settings/email', text: 'Email' },
				{ link: '/settings/payments', text: 'Payment methods' },
				{ link: '/settings/data', text: 'Data' },
			],
			lendingOptions: [
				{ link: '/portfolio/loans', text: 'My loans' },
				{ link: '/portfolio/lending-stats', text: 'Lending stats' },
				{ link: '/portfolio/estimated-repayments', text: 'Estimated repayments' },
				{ link: '/portfolio/credit/deposit', text: 'Add credit' },
				{ link: '/portfolio/withdraw', text: 'Withdraw' },
				{ link: '/donate/supportusprocess', text: 'Donate credit', isDonate: true },
				{ link: '/portfolio/donations', text: 'My donations' },
				{ link: '/portfolio/transactions', text: 'Transaction history' },
				{ link: '/portfolio/invites', text: 'Invite friends' },
				{ link: '/portfolio/credit/bonus-history', text: 'Free credit history' },
				{ link: '/portfolio/kiva-cards', text: 'Purchased Kiva cards' },
			],
			communityOptions: [
				{ link: '/teams/my-teams', text: 'My teams' },
				{ link: '/account/messages', text: 'Messages' },
			],
		};
	},
	methods: {
		returnLendingUrl(setting) {
			if (setting.isDonate) {
				return {
					path: setting.link,
					query: {
						donationAmount: this.userBalance
					}
				};
			}
			return setting.link;
		},
		closeSideSheet() {
			this.open = false;
			setTimeout(() => {
				this.$emit('navigation-closed');
			}, '700');
		},
	},
	watch: {
		visible() {
			if (this.visible) {
				setTimeout(() => {
					this.open = true;
				}, '300');
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.is-open {
	width: 20rem;
	@screen md {
		width: 25rem;
	}
}
</style>
