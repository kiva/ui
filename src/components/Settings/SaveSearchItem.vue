<template>
	<article>
		<div
			class="tw-flex tw-flex-col"
		>
			<span
				v-if="savedSearch.name"
				class="tw-text-medium tw-m-1 tw-p-1 tw-font-medium"
			>
				{{ savedSearch.name }}
			</span>
			<span>
				<kv-checkbox
					v-model="showAlerts"
					class="tw-text-small tw-m-1 tw-p-1"
				>
					Email me when new loans become available
				</kv-checkbox>
			</span>
			<span>
				<kv-button
					variant="secondary"
					class="tw-text-small tw-m-1 tw-p-1"
				>
					Delete Search
				</kv-button>
				<kv-button
					variant="secondary"
					class="tw-text-small tw-m-1 tw-p-1"
				>
					View Loans
				</kv-button>
			</span>
		</div>
	</article>
</template>

<script>
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';

export default {
	name: 'SaveSearchItem',
	data() {
		return {
			showAlerts: false,
		};
	},
	inject: ['apollo', 'cookieStore'],
	components: {
		KvButton,
		KvCheckbox,
	},
	props: {
		savedSearch: {
			type: Object,
			default: () => {},
		}
	}
};
</script>
