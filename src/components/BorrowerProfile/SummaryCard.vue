<template>
	<section class="tw-flex tw-flex-wrap tw-bg-gray-100 tw-p-2.5 md:tw-bg-white md:tw-p-3 md:tw-rounded lg:tw-p-4">
		<borrower-avatar
			class="
				tw-flex-none tw-w-8 tw-h-8 tw-mr-1.5 tw-mb-1.5
				md:tw-w-9 md:tw-h-9 md:tw-mr-3 md:tw-mb-3
				lg:tw-w-10 lg:tw-h-10 lg:tw-mr-4 lg:tw-mb-4
			"
			:alt="`Small, circular photograph of ${name}`"
			:fallback="fallbackImage"
			:sources="images"
		/>
		<div class="tw-flex-auto">
			<borrower-name :name="name" />
			<!-- fundraising progress placeholder  -->
		</div>
		<loan-use
			class="tw-flex-none tw-w-full"
			:borrower-count="borrowerCount"
			:loan-amount="loanAmount"
			:name="name"
			:status="status"
			:use="use"
		/>
		<!-- location/sector placeholder class="flex-auto" -->
	</section>
</template>

<script>
import gql from 'graphql-tag';
import BorrowerAvatar from './BorrowerAvatar';
import BorrowerName from './BorrowerName';
import LoanUse from './LoanUse';

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		BorrowerAvatar,
		BorrowerName,
		LoanUse,
	},
	data() {
		return {
			borrowerCount: 0,
			fallbackImage: '',
			images: [],
			loanAmount: '0',
			name: '',
			status: '',
			use: '',
		};
	},
	apollo: {
		query: gql`
			query borrowerAvatar($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						borrowerCount
						image {
							id
							urlSm1x: url(customSize: "s64fz50")
							urlSm2x: url(customSize: "s128fz50")
							urlMd1x: url(customSize: "s72fz50")
							urlMd2x: url(customSize: "s144fz50")
							urlLg1x: url(customSize: "s80fz50")
							urlLg2x: url(customSize: "s160fz50")
						}
						loanAmount
						name
						status
						use
					}
				}
			}
		`,
		preFetch: true,
		preFetchVariables({ route }) {
			return {
				loanId: Number(route?.params?.id ?? 0),
			};
		},
		variables() {
			return {
				loanId: Number(this.$route?.params?.id ?? 0),
			};
		},
		result({ data }) {
			this.borrowerCount = data?.lend?.loan?.borrowerCount ?? 0;
			this.fallbackImage = data?.lend?.loan?.image?.urlSm1x ?? '';
			this.loanAmount = data?.lend?.loan?.loanAmount ?? '0';
			this.name = data?.lend?.loan?.name ?? '';
			this.status = data?.lend?.loan?.status ?? '';
			this.use = data?.lend?.loan?.use ?? '';

			// Build images array
			this.images = [
				{
					media: 'min-width: 1024px', // large
					urls: {
						'2x': data?.lend?.loan?.image?.urlLg2x ?? '',
						'1x': data?.lend?.loan?.image?.urlLg1x ?? '',
					},
				},
				{
					media: 'min-width: 734px', // medium
					urls: {
						'2x': data?.lend?.loan?.image?.urlMd2x ?? '',
						'1x': data?.lend?.loan?.image?.urlMd1x ?? '',
					},
				},
				{
					media: 'min-width: 0',
					urls: {
						'2x': data?.lend?.loan?.image?.urlSm2x ?? '',
						'1x': data?.lend?.loan?.image?.urlSm1x ?? '',
					},
				},
			];
		},
	},
};
</script>
