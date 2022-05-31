<template>
	<div>
		<div class="tw-text-center tw-mb-4 md:tw-mb-6">
			<h1 class="tw-mb-4">
				Let’s get started.
			</h1>
			<p class="tw-text-subhead tw-text-secondary">
				There are three steps to applying for a loan on Kiva.<br>
				You’ll need at least 35 minutes to complete your application, but it might take longer.
			</p>
		</div>

		<kv-grid as="ol" class="tw-grid-cols-12 tw-text-center tw-mb-4 md:tw-mb-8">
			<li class="tw-col-span-12 md:tw-col-span-4">
				<div class="tw-rounded tw-bg-secondary tw-p-4">
					<div class="tw-flex tw-justify-center tw-mb-1.5">
						<borrow-step-1 class="tw-block" style="height: 6.25rem;" />
					</div>
					<h2 class="tw-text-h3 tw-mb-2">
						Step 1: <span class="no-wrap">Pre-check</span>
					</h2>
					<p class="tw-mb-2">
						Quick questions to ensure a Kiva loan is a good match
					</p>
					<p class="tw-flex tw-content-center tw-justify-center">
						<kv-material-icon
							:icon="mdiClock"
							class="tw-fill-current tw-text-tertiary tw-w-3 tw-h-3 tw-mr-1"
						/>
						<span>5 minutes</span>
					</p>
				</div>
			</li>
			<li class="tw-col-span-12 md:tw-col-span-4">
				<div class="tw-rounded tw-bg-secondary tw-p-4">
					<div class="tw-flex tw-justify-center tw-mb-1.5">
						<borrow-step-2 class="tw-block" style="height: 6.25rem;" />
					</div>
					<h2 class="tw-text-h3 tw-mb-2">
						Step 2: New account
					</h2>
					<p class="tw-mb-2">
						Create an account and fill out your profile
					</p>
					<p class="tw-flex tw-content-center tw-justify-center">
						<kv-material-icon
							:icon="mdiClock"
							class="tw-fill-current tw-text-tertiary tw-w-3 tw-h-3 tw-mr-1"
						/>
						<span>5 minutes</span>
					</p>
				</div>
			</li>
			<li class="tw-col-span-12 md:tw-col-span-4">
				<div class="tw-rounded tw-bg-secondary tw-p-4">
					<div class="tw-flex tw-justify-center tw-mb-1.5">
						<borrow-step-3 class="tw-block" style="height: 6.25rem;" />
					</div>
					<h2 class="tw-text-h3 tw-mb-2">
						Step 3: Application
					</h2>
					<p class="tw-mb-2">
						Complete your application and submit it to Kiva
					</p>
					<p class="tw-flex tw-content-center tw-justify-center">
						<kv-material-icon
							:icon="mdiClock"
							class="tw-fill-current tw-text-tertiary tw-w-3 tw-h-3 tw-mr-1"
						/>
						<span>25 minutes</span>
					</p>
				</div>
			</li>
		</kv-grid>

		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-6 md:tw-col-span-5 md:tw-col-start-2">
				<kv-button
					class="tw-w-full"
					href="/my/borrower/application"
					variant="secondary"
				>
					Continue my application
				</kv-button>
			</div>
			<div class="tw-col-span-6 md:tw-col-span-5 md:tw-col-start-7">
				<kv-button
					class="tw-w-full"
					:to="{
						path: '/borrow/pre-application/community',
						query: {
							refid: $route.query.refid
						}
					}"
				>
					Start Pre-check
				</kv-button>
			</div>
		</kv-grid>
	</div>
</template>

<script>
import { mdiClock } from '@mdi/js';

import BorrowStep1 from '@/assets/inline-svgs/borrow/precheck.svg';
import BorrowStep2 from '@/assets/inline-svgs/borrow/newaccount.svg';
import BorrowStep3 from '@/assets/inline-svgs/borrow/application.svg';

import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'BorrowIntro',
	components: {
		BorrowStep1,
		BorrowStep2,
		BorrowStep3,
		KvButton,
		KvGrid,
		KvMaterialIcon,
	},
	metaInfo: {
		title: 'Borrow Pre-application',
	},
	data() {
		return { mdiClock };
	}
};
</script>
