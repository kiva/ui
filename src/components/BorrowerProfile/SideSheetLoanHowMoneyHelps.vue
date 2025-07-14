<template>
	<div>
		<div class="tw-flex tw-items-stretch tw-gap-2">
			<div class="tw-w-0.5 tw-bg-brand-200"></div>
			<div class="tw-w-full tw-space-y-1" :class="loading ? 'tw-pb-4' : 'tw-pb-1'">
				<KvLoadingPlaceholder
					v-if="loading"
					:style="{width: 60 + (Math.random() * 15) + '%', height: '1rem'}"
				/>
				<h4 v-else>
					HOW THIS MONEY HELPS
				</h4>
				<KvLoadingPlaceholder v-if="loading" class="tw-mt-0.5 tw-h-2" />
				<p v-else>
					Helps {{ loanUse }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { KvLoadingPlaceholder } from '@kiva/kv-components';

const borrowerProfile = inject('borrowerProfile');

const loanUse = computed(() => borrowerProfile?.loanUse?.value);
const loading = computed(() => !loanUse.value);
</script>
