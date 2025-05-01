<template>
	<div class="tw-w-full landscape tw-relative">
		<MyKivaContainer>
			<div class="tw-bg-white tw-rounded-b tw-absolute tw-top-0 tw-p-1.5">
				<h3>Welcome back 👋</h3>
				<div
					v-if="isBorrower || isTrustee"
					class="tw-flex tw-flex-col tw-mt-1 tw-gap-1"
				>
					<router-link
						v-if="isBorrower"
						to="/my/borrower"
						class="tw-text-h4"
						v-kv-track-event="[
							'portfolio',
							'click',
							'Go to borrower dashboard'
						]"
					>
						Go to borrower Dashboard &rarr;
					</router-link>
					<router-link
						v-if="isTrustee"
						to="/my/trustee"
						class="tw-text-h4"
						v-kv-track-event="[
							'portfolio',
							'click',
							'Go to Trustee dashboard'
						]"
					>
						Go to Trustee Dashboard &rarr;
					</router-link>
				</div>
			</div>
			<button
				v-if="!userInHomepage"
				:disabled="isLoading"
				@click="$emit('show-navigation')"
			>
				<kv-material-icon
					class="tw-absolute tw-right-0 tw-bg-white tw-p-0.5 tw-rounded-full tw-shadow-lg tw-top-1 tw-w-4"
					name="settings"
					:icon="mdiCogOutline"
				/>
			</button>
		</MyKivaContainer>
	</div>
</template>

<script setup>
import { mdiCogOutline } from '@mdi/js';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import { KvMaterialIcon } from '@kiva/kv-components';
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';

defineEmits(['show-navigation']);

const props = defineProps({
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
});

const { userInfo } = toRefs(props);
const router = useRouter();

const isBorrower = computed(() => userInfo.value?.isBorrower ?? false);
const isTrustee = computed(() => !!userInfo.value?.trustee?.id ?? false);

const userInHomepage = computed(() => {
	return router.currentRoute.value?.path === '/mykiva';
});

</script>

<style lang="postcss" scoped>

.landscape {
	background-image: url('/src/assets/images/my-kiva/header_mobile.jpg');
	background-position: 75%;
	height: 148px;

	@screen lg {
		background-image: url('/src/assets/images/my-kiva/header-desktop.png');
		background-size: cover;
		background-position: center;
		height: 249px;
	}
	@apply tw-bg-cover tw-bg-no-repeat;
}

</style>
