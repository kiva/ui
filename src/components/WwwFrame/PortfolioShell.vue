<template>
	<WwwPage main-class="tw-bg-secondary tw-pb-3">
		<template #secondary>
			<TheMyKivaSecondaryMenu />
		</template>
		<KvPageContainer>
			<KvGrid class="tw-grid-cols-12 tw--mx-2.5 md:tw-mx-0">
				<ThePortfolioTertiaryMenu class="tw-col-span-3 tw-hidden md:tw-block tw-pt-2" />
				<div class="tw-col-span-12 md:tw-col-span-9 tw-pt-1.5 md:tw-pt-3">
					<slot></slot>
				</div>
			</KvGrid>
		</KvPageContainer>
	</WwwPage>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import TheMyKivaSecondaryMenu from '#src/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import ThePortfolioTertiaryMenu from '#src/components/WwwFrame/Menus/ThePortfolioTertiaryMenu';
import { KvPageContainer, KvGrid } from '@kiva/kv-components';

export default {
	name: 'PortfolioShell',
	components: {
		WwwPage,
		TheMyKivaSecondaryMenu,
		ThePortfolioTertiaryMenu,
		KvPageContainer,
		KvGrid,
	},
};
</script>
