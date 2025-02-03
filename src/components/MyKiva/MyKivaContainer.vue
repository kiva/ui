<template>
	<div class="container">
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12 tw-relative">
					<slot></slot>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script setup>
import { KvPageContainer, KvGrid } from '@kiva/kv-components';
</script>

<style lang="postcss" scoped>

.container {
	max-width: 67rem;
	@apply tw-mx-auto;
}

.container > div {
	@media screen and (width >= 67rem) {
		padding-left: 0;
		padding-right: 0;
	}
}
</style>
