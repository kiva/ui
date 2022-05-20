<template>
	<div class="tw-flex tw-justify-center tw-mb-2">
		<p style="font-size: 12px;" class="tw-self-center tw-mr-2">
			Do you like this loan?
		</p>
		<div>
			<kv-button variant="ghost" class="tw-inline-block">
				👍
			</kv-button>
			<kv-button variant="ghost" class="tw-inline-block">
				👎
			</kv-button>
		</div>
	</div>
</template>

<script>
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	components: {
		KvButton
	}
};
</script>
