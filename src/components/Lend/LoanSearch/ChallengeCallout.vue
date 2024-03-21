<template>
	<div>
		<kv-page-container class="container md:tw-my-4">
			<kv-grid
				class="tw-grid-cols-12"
			>
				<div class="tw-col-span-12 tw-w-full">
					<div class="info tw-w-full">
						<img
							v-if="lenderImage"
							:alt="`${lenderName} image`"
							:src="lenderImage"
							class="md:tw-w-4 md:tw-h-4 tw-w-6 tw-h-6 tw-rounded-full data-hj-suppress"
						>
						<p class="tw-text-lg tw-py-1 data-hj-suppress">
							{{ headerCallout }}
						</p>
					</div>
				</div>
			</kv-grid>
		</kv-page-container>
	</div>
</template>

<script>
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'ChallengeCallout',
	components: {
		KvGrid,
		KvPageContainer,
	},
	props: {
		lender: {
			type: Object,
			default: () => ({}),
		},
		teamName: {
			type: String,
			default: 'Kiva',
			required: true,
		},
	},
	computed: {
		lenderName() {
			return this.lender?.name ?? '';
		},
		lenderImage() {
			return this.lender?.image?.url ?? '';
		},
		headerCallout() {
			return this.lenderName
				? `Support ${this.lenderName} and help ${this.teamName} hit their goal`
				: `Help ${this.teamName} hit their goal`;
		}
	}
};

</script>

<style lang="postcss">
.info {
  @apply tw-bg-white tw-flex tw-items-center tw-justify-center tw-gap-2 tw-shadow-lg tw-py-0.5
    md:tw-rounded-lg tw-rounded-b tw-px-4;
}

.container {
  padding-left: 0rem;
  padding-right: 0rem;
}

@screen md {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@screen lg {
  .container {
    padding-left: 4rem !important;
    padding-right: 4rem !important;
  }
}

</style>
