<template>
	<div class="tw-px-2.5 lg:tw-px-0">
		<div class="tw-flex tw-items-stretch tw-gap-2">
			<div class="tw-w-0.5 tw-bg-brand-200"></div>
			<div class="tw-w-full tw-pb-1">
				<KvLoadingPlaceholder
					v-if="loading"
					class="tw-mb-2"
					:style="{width: 60 + (Math.random() * 15) + '%', height: '1rem'}"
				/>
				<h4 v-else class="tw-pb-1">
					HOW THIS MONEY HELPS
				</h4>
				<KvLoadingPlaceholder v-if="loading" class="tw-mt-0.5" style="height: 1rem;" />
				<p v-else>
					Helps {{ loanUse }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, watch } from 'vue';
import { KvLoadingPlaceholder } from '@kiva/kv-components';

const borrowerProfile = inject('borrowerProfile');

const loanUse = computed(() => borrowerProfile?.loanUse?.value);
const loading = computed(() => !loanUse.value);

watch(loanUse, () => {
	console.log('SideSheetLoanHowMoneyHelps loanUse:', loanUse);
});
</script>
