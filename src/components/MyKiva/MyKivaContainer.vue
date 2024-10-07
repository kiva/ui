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
import KvPageContainer from '@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '@kiva/kv-components/vue/KvGrid';
</script>

<style lang="postcss" scoped>

.container {
	max-width: 67rem;
	@apply tw-mx-auto;
}
</style>
