<template>
	<div>
		<h3 class="data-hj-suppress">
			Kiva Lender {{ lenderName }}
		</h3>
		<div class="tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-gap-y-2 md:tw-gap-x-8 tw-pt-2">
			<div class="tw-w-full md:tw-basis-1/4 tw-pt-1.5">
				<kv-material-icon
					v-if="!lenderImageUrl"
					:icon="mdiAccountCircle"
					class="!tw-block tw-mx-auto tw-w-14 tw-h-14"
				/>
				<img
					v-else
					:src="lenderImageUrl"
					class="tw-mx-auto tw-w-2/3 md:tw-w-full"
				>
			</div>
			<div class="tw-w-full">
				<dl class="tw-divide-y tw-divide-gray-100">
					<div
						v-for="(value, key, index) in lenderSummary"
						:key="index"
						class="tw-py-1.5 tw-flex tw-gap-x-2"
					>
						<dt class="tw-font-medium tw-capitalize tw-basis-1/3 md:tw-basis-1/4">
							{{ key }}:
						</dt>
						<dd class="tw-basis-2/3 lg:tw-basis-3/4 data-hj-suppress">
							<template v-if="key=='checkout'">
								<a
									:href="value"
									target="_blank"
								>
									{{ value }}
								</a>
							</template>
							<template v-else>
								{{ value }}
							</template>
						</dd>
					</div>
				</dl>

				<div class="tw-mt-2.5">
					<kv-button
						class="tw-w-full lg:tw-w-auto"
						variant="secondary"
						:href="`/gifts/kiva-cards?handle=${publicId}#/lender`"
					>
						Send a Kiva Card
					</kv-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { format, parseISO } from 'date-fns';
import { mdiAccountCircle } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LenderSummary',
	components: {
		KvMaterialIcon,
		KvButton,
	},
	props: {
		publicId: {
			type: String,
			required: true,
		},
		lenderInfo: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			mdiAccountCircle,
		};
	},
	computed: {
		lenderName() {
			return this.lenderInfo?.name ?? '';
		},
		lenderImageUrl() {
			return this.lenderInfo?.image?.url ?? '';
		},
		memberSince() {
			return format(parseISO(this.lenderInfo?.memberSince ?? new Date()), 'MMM dd, yyyy');
		},
		lenderSummary() {
			const summaryData = {
				location: this.lenderInfo?.lenderPage?.whereabouts ?? '',
				occupation: this.lenderInfo?.lenderPage?.occupation ?? '',
				'I loan because': this.lenderInfo?.lenderPage?.loanBecause ?? '',
				'About me': this.lenderInfo?.lenderPage?.otherInfo ?? '',
				checkout: this.lenderInfo?.lenderPage?.url ?? '',
				'Member since': this.memberSince,
			};

			return Object.fromEntries(
				Object.entries(summaryData)
					// eslint-disable-next-line no-unused-vars
					.filter(([_, value]) => value)
			);
		},
	},
};
</script>