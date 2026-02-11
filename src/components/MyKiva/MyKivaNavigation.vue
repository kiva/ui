<template>
	<div
		v-if="visible"
		class="tw-absolute tw-inset-0 tw-z-modal tw-pt-0.5 tw-overflow-hidden"
	>
		<div
			class="tw-absolute tw-inset-0 tw-bg-black tw-transition-all tw-duration-150"
			:class="{
				'tw-bg-opacity-0 tw-delay-300': !open,
				'tw-bg-opacity-low': open,
			}"
			@click.self="closeSideSheet"
		></div>
		<div
			class="my-kiva-navigation tw-absolute tw-right-0 tw-transition-all tw-duration-300 tw-bg-white
				tw-rounded-l-lg tw-p-3"
			:class="{
				'tw-translate-x-full tw-delay-200': !open,
				'tw-translate-x-0 tw-p-3': open,
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
				class="tw-overflow-y-auto tw-overflow-x-hidden tw-transition-opacity tw-delay-200"
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
							class="tw-mt-1.5
								hover:tw-translate-x-1 hover:lg:tw-translate-x-2 tw-duration-300 tw-delay-100"
						>
							<router-link
								class="tw-text-primary tw-font-medium tw-block"
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
							:class="[
								'tw-mt-1.5 tw-duration-300 tw-delay-100',
								{ 'hover:tw-translate-x-1 hover:lg:tw-translate-x-2' :
									!setting.isDonate || parseFloat(userBalance) }
							]"
						>
							<component
								:is="setting.isDonate && !parseFloat(userBalance) ? 'span' : 'router-link'"
								:class="[
									'tw-text-primary tw-font-medium',
									{ 'tw-text-tertiary': setting.isDonate && !parseFloat(userBalance) }
								]"
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
							class="tw-mt-1.5
								hover:tw-translate-x-1 hover:lg:tw-translate-x-2 tw-duration-300 tw-delay-100"
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

<script setup>
import { mdiClose } from '@mdi/js';
import { KvMaterialIcon } from '@kiva/kv-components';
import {
	ref,
	toRefs,
	watch,
	computed,
} from 'vue';

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	userBalance: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['navigation-closed']);

const { visible, userInfo, userBalance } = toRefs(props);

const publicId = computed(() => {
	return userInfo.value?.userAccount?.publicId ?? '';
});

const open = ref(false);
const profileSettingsOptions = computed(() => [
	{ link: '/settings/account-beta', text: 'Account' },
	{ link: '/settings/security', text: 'Security and login' },
	{ link: '/settings/email', text: 'Email' },
	{ link: '/settings/payments', text: 'Payment methods' },
	{ link: '/settings/data', text: 'Data' },
	{ link: `/lender/${publicId.value}`, text: 'Public lender profile' },
]);
const lendingOptions = ref([
	{ link: '/portfolio/loans', text: 'My loans' },
	{ link: '/portfolio/lending-stats', text: 'Lending stats' },
	{ link: '/portfolio/estimated-repayments', text: 'Estimated repayments' },
	{ link: '/portfolio/credit/deposit', text: 'Add credit' },
	{ link: '/withdraw', text: 'Withdraw' },
	{ link: '/donate/supportusprocess', text: 'Donate credit', isDonate: true },
	{ link: '/portfolio/donations', text: 'My donations' },
	{ link: '/portfolio/transactions', text: 'Transaction history' },
	{ link: '/portfolio/invites', text: 'Invite friends' },
	{ link: '/portfolio/credit/bonus-history', text: 'Free credit history' },
	{ link: '/portfolio/kiva-cards', text: 'Purchased Kiva cards' },
]);
const communityOptions = ref([
	{ link: '/teams/my-teams', text: 'My teams' },
	{ link: '/account/messages', text: 'Messages' },
]);

const returnLendingUrl = setting => {
	if (setting.isDonate) {
		return {
			path: setting.link,
			query: {
				donationAmount: userBalance.value
			}
		};
	}
	return setting.link;
};

const closeSideSheet = () => {
	open.value = false;
	setTimeout(() => {
		emit('navigation-closed');
	}, '700');
};

watch(visible, () => {
	if (visible.value) {
		setTimeout(() => {
			open.value = true;
		}, '300');
	}
});
</script>

<style lang="postcss" scoped>
.my-kiva-navigation {
	width: 20rem;

	@screen md {
		width: 25rem;
	}
}
</style>
