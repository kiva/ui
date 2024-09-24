<template>
	<div class="tw-w-full landscape tw-relative">
		<MyKivaContainer>
			<div class="tw-bg-white tw-rounded-b tw-absolute tw-top-0 tw-px-1 tw-py-2">
				<h3>Welcome back 👋</h3>
			</div>
			<button
				@click="$emit('show-navigation')"
			>
				<kv-material-icon
					class="tw-absolute tw-right-0 tw-bg-white tw-p-1 tw-rounded-full tw-mt-2"
					name="settings"
					:icon="mdiCogOutline"
				/>
			</button>
		</MyKivaContainer>
	</div>
</template>

<script>
import { mdiCogOutline } from '@mdi/js';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'MyKivaHero',
	components: {
		MyKivaContainer,
		KvMaterialIcon
	},
	data() {
		return {
			mdiCogOutline
		};
	}
};
</script>

<style lang="postcss" scoped>

.landscape {
	background-image: url('/src/assets/images/my-kiva/header-mobile.svg');
	background-position: 75%;
	height: 148px;

	@screen md {
		background-image: url('/src/assets/images/my-kiva/header-desktop.svg');
		background-size: cover;
		background-position: center;
		height: 249px;
	}
	@apply tw-bg-cover tw-bg-no-repeat;
}

</style>
