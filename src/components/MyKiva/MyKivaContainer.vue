<template>
	<KvPageContainer>
		<KvGrid class="tw-grid-cols-12">
			<div class="tw-col-span-12 tw-relative">
				<slot></slot>
			</div>
		</KvGrid>
	</KvPageContainer>
</template>

<script setup>
import { KvPageContainer, KvGrid } from '@kiva/kv-components';
</script>
