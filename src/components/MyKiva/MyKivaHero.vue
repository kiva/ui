<template>
	<div class="landscape tw-relative tw-w-full">
		<MyKivaContainer>
			<div
				class="tw-p-1.5 tw-bg-white tw-rounded-b tw-absolute tw-top-0"
			>
				<h3>
					Welcome back 👋
				</h3>
			</div>
			<button @click="$emit('show-navigation')">
				<kv-material-icon
					class="tw-absolute tw-right-0 tw-bg-white tw-p-0.5 tw-rounded-full tw-shadow-lg tw-top-1 tw-w-4"
					name="settings"
					:icon="mdiCogOutline"
				/>
			</button>
		</MyKivaContainer>
	</div>
</template>

<script setup>
import { mdiCogOutline } from '@mdi/js';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import { KvMaterialIcon } from '@kiva/kv-components';

defineEmits(['show-navigation']);
</script>

<style lang="postcss" scoped>

.landscape {
	background-image: url('/src/assets/images/my-kiva/header_mobile.jpg');
	background-position: 75%;
	height: 148px;

	@screen lg {
		background-image: url('/src/assets/images/my-kiva/header-desktop.png');
		background-size: cover;
		background-position: center;
		height: 249px;
	}
	@apply tw-bg-cover tw-bg-no-repeat;
}

</style>
