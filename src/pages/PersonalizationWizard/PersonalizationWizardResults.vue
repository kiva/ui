<template>
	<www-page>
		<template>
			<kv-page-container>
				<div class="tw-mt-4">
					<h2 class="tw-text-h1 tw-mb-2">
						We found the perfect loan for you!
					</h2>
				</div>
			</kv-page-container>
		</template>
	</www-page>
</template>

<script>
// import gql from 'graphql-tag';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	components: {
		KvGrid,
		KvPageContainer,
		WwwPage
	},
};
</script>
