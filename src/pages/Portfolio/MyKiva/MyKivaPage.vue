<template>
	<www-page main-class="tw-bg-secondary">
		<div ref="landscape" class="tw-w-full landscape tw-relative">
			<kv-page-container>
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
		<kv-page-container>
			<kv-grid class="tw-grid-cols-12">
				<div class="tw-col-span-12">
					<div class="profile tw-flex tw-items-end tw-justify-end tw-gap-3">
						<h2>
							{{ lenderName }}
						</h2>
						<a
							href="/settings/account"
							v-kv-track-event="[
								'portofolio',
								'click',
								'account-profile-pic'
							]"
						>
							<ActivityAvatar
								:class="{'tw-border-4 tw-border-white': !lenderImageUrl}"
								class="avatar md:!tw-h-12 md:!tw-w-12 !tw-h-10 !tw-w-10"
								:lender-image-url="lenderImageUrl"
								:lender-name="lenderName"
							/>
						</a>
					</div>
				</div>
				<div class="tw-col-span-12">
					<p>NEXT STEPS GO HERE!</p>
				</div>
			</kv-grid>
		</kv-page-container>
	</www-page>
</template>

<script>
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import ActivityAvatar from '@/components/Iwd/ActivityAvatar';
import { mdiCogOutline } from '@mdi/js';
import myKivaQuery from '@/graphql/query/myKiva.graphql';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

const MY_KIVA_EXP_KEY = 'my_kiva_page';

export default {
	name: 'MyKivaPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		ActivityAvatar,
		KvPageContainer,
		KvGrid,
		WwwPage,
		KvMaterialIcon,
	},
	data() {
		return {
			lender: null,
			mdiCogOutline
		};
	},
	apollo: {
		query: myKivaQuery,
		preFetch: true,
		result(result) {
			this.lender = result.data?.my?.lender ?? null;
		},
	},
	mounted() {
		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'event-tracking',
			MY_KIVA_EXP_KEY,
			'EXP-MP-623-Sept2024'
		);

		this.$kvTrackEvent('portofolio', 'view', 'new-my-kiva');
	},
	computed: {
		lenderName() {
			return this?.lender?.name ?? '';
		},
		lenderImageUrl() {
			return this?.lender?.image?.url ?? '';
		},
	},
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

.profile {
	margin-top: -40px;

	@screen md {
		margin-top: -48px;
	}
	@apply tw-relative;
}

.avatar >>> img {
	@apply tw-h-10 tw-w-10 md:tw-h-12 md:tw-w-12 tw-border-4 tw-border-white;
}

.avatar >>> span {
	@apply tw-text-h2;
}

</style>
