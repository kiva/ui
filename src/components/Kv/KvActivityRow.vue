<template>
	<div class="tw-flex tw-gap-x-1 tw-items-center">
		<div>
			<kv-user-avatar
				:lender-name="activity.lenderName"
				:lender-image-url="activity.lenderImage"
				:is-small="true"
			/>
		</div>
		<div>
			<!-- eslint-disable vue/no-v-html -->
			<p v-html="activity.text"></p>
			<!-- eslint-enable -->
		</div>
	</div>
</template>

<script>
import KvUserAvatar from '@kiva/kv-components/dist/components/KvUserAvatar';

export default {
	name: 'KvActivityRow',
	components: {
		KvUserAvatar,
	},
	props: {
		activity: {
			type: Object,
			required: true,
		},
	},
};
</script>
