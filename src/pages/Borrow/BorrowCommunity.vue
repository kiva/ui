<template>
	<div class="tw-text-center">
		<community-graphic
			class="tw-w-full tw-mx-auto tw-mb-4"
			style="max-width: 31rem;"
		/>
		<p class="tw-text-h4 tw-mb-1">
			Step 1: Pre-check
		</p>
		<h1 class="tw-mb-4">
			Start with your community
		</h1>
		<kv-grid class="tw-grid-cols-12">
			<div class="tw-col-span-12 md:tw-col-span-10 lg:tw-col-span-8 md:tw-col-start-2 lg:tw-col-start-3">
				<p class="tw-mb-4">
					To receive your Kiva loan, you’ll need a small amount
					of funding from your community first.
				</p>
				<p class="tw-mb-4">
					We do this because we believe that if your community
					will invest in you, so will our community as Kiva.
				</p>
				<kv-button
					:to="{
						path: '/borrow/pre-application/how-long',
						query: {
							refid: $route.query.refid
						}
					}"
				>
					Got it
				</kv-button>
			</div>
		</kv-grid>
	</div>
</template>

<script>
import CommunityGraphic from '#src/assets/inline-svgs/borrow/community.svg';
import { KvButton, KvGrid } from '@kiva/kv-components';

export default {
	name: 'BorrowCommunity',
	components: {
		CommunityGraphic,
		KvButton,
		KvGrid,
	},
	head() {
		return {
			title: 'Community | Borrow Pre-application',
			meta: [
				{
					vmid: 'description',
					name: 'description',
					content: 'Here at Kiva, we believe that if your community will invest in you, '
						+ 'so will the Kiva lender community. Get started today.'
				}
			]
		};
	}
};
</script>
