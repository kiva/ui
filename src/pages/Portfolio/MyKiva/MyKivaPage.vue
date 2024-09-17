<template>
	<www-page main-class="tw-bg-secondary">
		<div ref="landscape" class="tw-w-full landscape tw-relative">
			<kv-page-container>
				<kv-grid class="tw-grid-cols-12">
					<div class="tw-col-span-12 tw-mb-4 tw-relative">
						<div class="tw-bg-white tw-rounded-b tw-absolute tw-top-0 tw-px-1 tw-pt-2 tw-pb-1">
							<h3>Welcome back 👋</h3>
						</div>
						<a
							href="/settings/account"
							v-kv-track-event="[
								'portofolio',
								'click',
								'account-profile-pic'
							]"
						>
							<ActivityAvatar
								v-if="avatarStyle.top"
								:style="avatarStyle"
								class="avatar !tw-h-10 !tw-w-10 tw-border-4 tw-border-white"
								:lender-image-url="lenderImageUrl"
								:lender-name="lenderName"
							/>
						</a>
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
			<kv-grid class="tw-grid-cols-12 tw-mt-1.5">
				<div class="tw-col-span-8 md:tw-col-span-11">
					<h2 class="md:tw-mr-3 md:tw-text-right">
						{{ lenderName }}
					</h2>
				</div>
				<div class="tw-col-span-12">
					<p>NEXT STEPS GOES HERE!</p>
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
			avatarStyle: {
				position: 'absolute',
				top: '',
				right: '0px',
			},
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
		this.adjustAvatarPosition();

		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'event-tracking',
			MY_KIVA_EXP_KEY,
			'EXP-MP-623-Sept2024'
		);

		this.$kvTrackEvent('portofolio', 'view', 'new-my-kiva');
	},
	methods: {
		adjustAvatarPosition() {
			const { landscape } = this.$refs;
			if (landscape) {
				const containerHeight = landscape.clientHeight;
				this.avatarStyle.top = `${containerHeight - 40}px`;
			}
		},
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
	background-size: cover;
	background-repeat: no-repeat;
	height: 148px;

	@screen md {
		background-image: url('~@/assets/images/my-kiva/header-desktop.svg');
		background-position: 75%;
		height: 249px;
	}
}

.avatar >>> img {
	@apply tw-h-10 tw-w-10;
}

.avatar >>> span {
	@apply tw-text-h2;
}

</style>
