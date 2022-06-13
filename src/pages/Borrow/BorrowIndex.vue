<template>
	<www-page>
		<kv-page-container class="tw-py-4 md:tw-py-6 lg:tw-py-8">
			<borrow-intro v-if="isIntro" />
			<router-view v-else />
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import BorrowIntro from '@/pages/Borrow/BorrowIntro';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'BorrowIndex',
	metaInfo() {
		return {
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Apply for a loan on Kiva in three steps. '
					+ 'Get started on your application today to receive a 0% interest loan with Kiva.'
				}
			]
		};
	},
	components: {
		BorrowIntro,
		KvPageContainer,
		WwwPage
	},
	computed: {
		isIntro() {
			return this.$route.path === '/borrow/pre-application';
		}
	}
};
</script>
