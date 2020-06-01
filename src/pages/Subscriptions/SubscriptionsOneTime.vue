<template>
	<div class="row mg-area">
		<div class="column large-8 settings-card">
			<div class="icon-wrapper">
				<kv-icon
					class="icon"
					title="Monthly Good"
					name="auto-icon-when"
				/>
			</div>
			<div class="title-wrapper">
				<h3>
					Global COVID-19 Response Lending
				</h3>
			</div>
			<div class="content-wrapper">
				<p>
					Thank you for supporting those affected by COVID-19. Your deposit will occur within one hour,
					after which you will be unable to cancel.
				</p>
				<p>
					<a role="button" @click.prevent="$emit('cancel-subscription')">Cancel Contribution</a>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
};
</script>
