<template>
	<div class="tw-mb-4">
		<div class="tw-flex tw-justify-between tw-mb-2 tw-bg-[#efefef] tw-p-2">
			<div class="tw-flex-1"></div>
			<div class="tw-flex-1 tw-text-right tw-font-medium">
				My stats
			</div>
			<div class="tw-flex-1 tw-text-right tw-font-medium">
				Avg Kiva lender
			</div>
		</div>

		<div class="tw-space-y-2">
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount lent
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$50.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$367.52
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount repaid
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$327.36
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount lost
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$7.64
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount refunded
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$11.11
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Delinquency rate
				</div>
				<div class="tw-col-span-4 tw-text-right">
					0.00%
				</div>
				<div class="tw-col-span-4 tw-text-right">
					12.51%
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount in arrears
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$2.05
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Outstanding loans
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$16.37
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Default rate
				</div>
				<div class="tw-col-span-4 tw-text-right">
					0.00%
				</div>
				<div class="tw-col-span-4 tw-text-right">
					1.83%
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount defaulted
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$5.67
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount ended
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$50.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$325.78
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Currency loss rate
				</div>
				<div class="tw-col-span-4 tw-text-right">
					0.00%
				</div>
				<div class="tw-col-span-4 tw-text-right">
					0.54%
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Amount of currency loss
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$1.97
				</div>
			</div>
			<div class="tw-grid tw-grid-cols-12 tw-gap-4">
				<div class="tw-col-span-4">
					Currency loss reimbursement
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
				<div class="tw-col-span-4 tw-text-right">
					$0.00
				</div>
			</div>
		</div>

		<hr class="tw-border-tertiary tw-my-4">

		<div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-font-medium">
			<div>Fundraising</div>
			<div class="tw-text-right">
				0
			</div>
			<div>Funded</div>
			<div class="tw-text-right">
				0
			</div>
			<div>Paying back</div>
			<div class="tw-text-right">
				0
			</div>
		</div>
		<div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-font-medium">
			<div>Paying back delinquent</div>
			<div class="tw-text-right">
				0
			</div>
			<div>Repaid</div>
			<div class="tw-text-right">
				1
			</div>
			<div>Repaid with currency loss</div>
			<div class="tw-text-right">
				1
			</div>
		</div>
		<div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-font-medium">
			<div>Ended in default</div>
			<div class="tw-text-right">
				0
			</div>
			<div>Refunded</div>
			<div class="tw-text-right">
				0
			</div>
			<div>Expired</div>
			<div class="tw-text-right">
				0
			</div>
		</div>
		<hr class="tw-border-tertiary tw-my-4">
	</div>
</template>

<script>
export default {
	name: 'LoanStatsTable',
	props: {
		stats: {
			type: Object,
			default: () => ({})
		},
		avgStats: {
			type: Object,
			default: () => ({})
		}
	}
};
</script>
