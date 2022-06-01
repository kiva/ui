<template>
	<www-page-minimal>
		<div class="tw-relative tw-overflow-hidden md:tw-bg-secondary">
			<router-view />
		</div>
	</www-page-minimal>
</template>

<script>
import WwwPageMinimal from '@/components/WwwFrame/WwwPageMinimal';

export default {
	name: 'GetStarted',
	components: {
		WwwPageMinimal,
	},
	metaInfo: {
		title: 'Get Started'
	},
};
</script>
