<template>
	<div class="tw-my-2 tw-px-2">
		<div style="width: 136px" class="tw-mx-auto tw-px-1">
			<div class="tw-flex tw-items-center">
				<div class="tw-flex tw-items-center tw-text-brand tw-relative">
					<div
						class="tw-bg-brand tw-h-3.5 tw-rounded-full tw-w-3.5"
					>
						<kv-icon
							class="tw-fill-current tw-inline-flex tw-max-h-full tw-ml-1 tw-mt-1 tw-text-white tw-w-1.5"
							name="checkmark"
						/>
					</div>
					<p
						class="tw-text-small tw-absolute tw-font-medium tw-mt-7 tw-text-center tw-uppercase tw--ml-0.5"
					>
						Lend
					</p>
				</div>
				<div
					class="tw-flex-auto tw-border-t-2 tw-border-brand"
				></div>
				<div class="tw-flex tw-items-center tw-text-brand tw-relative">
					<div
						class="tw-border-2 tw-border-brand tw-h-3.5 tw-rounded-full tw-w-3.5"
					>
					</div>
					<p
						class="tw-text-small tw-absolute tw-font-medium tw-mt-7 tw-text-center tw-uppercase tw--ml-1"
					>
						Share
					</p>
				</div>
			</div>
		</div>
		<p class="tw-text-center tw-mt-4 tw-text-h3">
			{{ lenderName }}, complete your support by sharing this loan.
		</p>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'ShareStepper',
	components: { KvIcon },
	props: {
		lenderName: {
			type: String,
			default: ''
		}
	}
};
</script>
