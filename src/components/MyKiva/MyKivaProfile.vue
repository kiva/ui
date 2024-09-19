<template>
	<kv-page-container class="!tw-max-w-4xl">
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
							class="avatar !tw-h-10 !tw-w-10"
							:lender-image-url="lenderImageUrl"
							:lender-name="lenderName"
						/>
					</a>
				</div>
			</div>
		</kv-grid>
	</kv-page-container>
</template>

<script>

import ActivityAvatar from '@/components/Iwd/ActivityAvatar';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'MyKivaProfile',
	props: {
		lender: {
			type: Object,
			default: () => ({}),
		}
	},
	components: {
		ActivityAvatar,
		KvPageContainer,
		KvGrid,
	},
	computed: {
		lenderName() {
			return this?.lender?.name ?? 'Christian';
		},
		lenderImageUrl() {
			return this?.lender?.image?.url ?? '';
		},
	},
};
</script>

<style lang="postcss" scoped>

.profile {
	margin-top: -40px;

	@screen md {
		margin-top: -50px;
	}
	@apply tw-relative;
}

.avatar {
	@screen md {
		width: 6.25rem !important;
		height: 6.25rem !important;
	}
}

.avatar >>> img {
	@screen md {
		width: 6.25rem;
		height: 6.25rem;
	}
	@apply tw-h-10 tw-w-10 tw-border-4 tw-border-white;
}

.avatar >>> span {
	@apply tw-text-h1 tw--mt-1;
}

</style>
