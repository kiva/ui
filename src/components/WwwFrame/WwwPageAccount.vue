<template>
	<www-page gray-background>
		<slot name="nav"></slot>
		<kv-page-container class="tw-pt-3 tw-pb-5 md:tw-pt-4 md:tw-pb-8">
			<header class="tw-flex tw-flex-col tw-gap-1 tw-mb-3 md:tw-mb-4">
				<p v-if="eyebrow" class="tw-text-upper tw-text-secondary" data-testid="account-frame-eyebrow">
					{{ eyebrow }}
				</p>
				<h1 data-hj-suppress>
					{{ title }}
				</h1>
				<p v-if="subtitle" class="tw-text-subhead tw-text-secondary" data-testid="account-frame-subtitle">
					{{ subtitle }}
				</p>
			</header>
			<slot></slot>
		</kv-page-container>
	</www-page>
</template>

<script setup>
import { KvPageContainer } from '@kiva/kv-components';
import WwwPage from '#src/components/WwwFrame/WwwPage';

defineOptions({ name: 'WwwPageAccount' });

defineProps({
	eyebrow: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		default: '',
	},
});
</script>
