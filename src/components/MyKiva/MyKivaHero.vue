<template>
	<div ref="landscape" class="tw-w-full landscape tw-relative">
		<kv-page-container class="!tw-max-w-4xl">
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12 tw-mb-4 tw-relative">
					<div class="tw-bg-white tw-rounded-b tw-absolute tw-top-0 tw-px-1 tw-py-2">
						<h3>Welcome back 👋</h3>
					</div>
					<kv-material-icon
						class="tw-absolute tw-right-0 tw-bg-white tw-p-1 tw-rounded-full tw-cursor-pointer tw-mt-2"
						name="settings"
						:icon="mdiCogOutline"
					/>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script>
import { mdiCogOutline } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'MyKivaHero',
	components: {
		KvPageContainer,
		KvGrid,
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
	background-image: url('~@/assets/images/my-kiva/header-mobile.svg');
	height: 148px;

	@screen md {
		background-image: url('~@/assets/images/my-kiva/header-desktop.svg');
		background-position: 75%;
		height: 249px;
	}
	@apply tw-bg-cover tw-bg-no-repeat;
}

</style>
