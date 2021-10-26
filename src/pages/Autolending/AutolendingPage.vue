<template>
	<www-page class="autolending" :gray-background="true">
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>

		<kv-default-wrapper>
			<div class="row column">
				<h1 class="tw-mb-2">
					Auto-lending settings
				</h1>
				<p class="tw-text-subhead tw-mb-4">
					Make the impact you want even if you’re away from your account for a while
				</p>
			</div>
			<router-view />
		</kv-default-wrapper>
	</www-page>
</template>

<script>
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		KvDefaultWrapper,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	metaInfo: {
		title: 'Auto-lending settings',
	},
};
</script>
