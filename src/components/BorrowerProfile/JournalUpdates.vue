<!-- this id is used to link directly to the section via a hash '#updates' in the url -->
<template>
	<section id="updates">
		<!-- Display Content -->
		<h2 class="tw-text-headline tw-mb-3" :data-testid="`bp-updates-header`">
			<!-- eslint-disable-next-line max-len -->
			{{ sectionTitle }} <kv-loading-placeholder v-if="firstLoading" class="tw-inline-block tw-align-middle tw-mb-0.5" :style="{width: '27%', height: '28px' }" />
		</h2>

		<div
			:data-testid="`bp-updates-section`"
		>
			<update-details
				v-for="(journal, index) in journals" :key="journal.id"
				:body="journal.body"
				:date="journal.date"
				:subject="journal.subject"
				:index="totalItemCount - index"
				:image-url="journal.image ? journal.image.url : null"
			/>
		</div>

		<div v-if="loading" class="tw-rounded tw-bg-primary tw-p-3 tw-mb-3">
			<!-- Loading placeholder for journal elements -->
			<kv-loading-placeholder
				class="tw-rounded tw-mb-2 tw-w-full" :style="{ height: '121px' }"
			/>
			<kv-loading-placeholder
				class="tw-mb-2" :style="{ height: '14px', width: '96%' }"
			/>
			<kv-loading-placeholder
				class="tw-mb-2" :style="{ height: '14px', width: '41%' }"
			/>
			<div class="tw-flex tw-justify-between tw-align-baseline">
				<kv-loading-placeholder class="tw-mb-2" :style="{height: '28px', width: '33%'}" />
				<kv-loading-placeholder class="tw-mb-2" :style="{height: '14px', width: '24%'}" />
			</div>
		</div>

		<!-- Load More Button -->
		<div v-if="journals.length < totalItemCount" class="tw-mb-3 tw-text-center">
			<kv-button
				class="tw-mb-3"
				@click="loadMore"
				variant="secondary"
				:disabled="loading"
				:state="buttonState"
				:aria-label="`See older updates`"
			>
				See older updates
			</kv-button>
		</div>
	</section>
</template>

<script>
import { KvLoadingPlaceholder, KvButton } from '@kiva/kv-components';
import updatesQuery from '#src/graphql/query/loanUpdates.graphql';
import UpdateDetails from './UpdateDetails';

export default {
	name: 'JournalUpdates',
	components: {
		KvButton,
		KvLoadingPlaceholder,
		UpdateDetails
	},
	inject: ['apollo', 'cookieStore'],
	emits: ['hide-section'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	apollo: {
		lazy: true,
		query: updatesQuery,
		variables() {
			return {
				loanId: this.loanId,
				limit: this.itemQueryLimit,
				offset: this.itemQueryOffset,
			};
		},
		result({ data }) {
			this.loanName = data?.lend?.loan?.name ?? '';
			this.totalItemCount = data?.lend?.loan?.updates?.totalCount ?? 0;
			if (!this.totalItemCount) {
				this.$emit('hide-section');
			}
			const values = data?.lend?.loan?.updates?.values ?? [];
			if (this.itemQueryOffset === 0) {
				this.journals = values;
			} else {
				this.journals = this.journals.concat(values);
			}
			this.loading = false;
		},
	},
	data() {
		return {
			loading: true,
			loanName: '',
			journals: [],
			itemQueryOffset: 0,
			itemQueryLimit: 3,
			totalItemCount: 0,
		};
	},
	computed: {
		sectionTitle() {
			return `Updates from ${this.loanName}`;
		},
		firstLoading() {
			return this.loading && this.journals.length === 0;
		},
		buttonState() {
			if (this.loading) return 'loading';
			return '';
		},
	},
	methods: {
		loadMore() {
			this.itemQueryOffset += this.itemQueryLimit;
		},
	},
};
</script>
