<template>
	<section v-if="lenderDedications.length > 0" class="tw-my-8">
		<h4 class="data-hj-suppress tw-mb-1">
			{{ lenderDedicationsTitle }}
		</h4>
		<p class="tw-mb-2">
			{{ showedDedications }}
		</p>

		<div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
			<div
				v-for="dedication in lenderDedications"
				:key="`dedication-${dedication.id}`"
				class="tw-flex tw-flex-col tw-gap-0.5"
			>
				<a
					:href="`/dedication/${dedication.loanId}`"
				>
					<dedicate-heart class="tw-w-full tw-px-4 tw-fill-brand" />
				</a>
				<a
					:href="`/dedication/${dedication.loanId}`"
					class="data-hj-suppress"
				>
					Dedicated by {{ dedication.senderName }}
				</a>
			</div>
		</div>
		<kv-pagination
			class="tw-mt-4"
			v-if="totalCount > dedicationsLimit"
			:limit="dedicationsLimit"
			:total="totalCount"
			:offset="dedicationsOffset"
			@page-changed="pageChange"
		/>
	</section>
</template>

<script>
import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import numeral from 'numeral';
import { mdiAccountCircle } from '@mdi/js';
import logReadQueryError from '@/util/logReadQueryError';
import lenderDedicationsQuery from '@/graphql/query/lenderDedications.graphql';
import DedicateHeart from '@/assets/icons/inline/dedicate-heart.svg';
import KvPagination from '~/@kiva/kv-components/vue/KvPagination';

export default {
	name: 'LenderDedicationsList',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvPagination,
		DedicateHeart,
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
			lenderDedications: [],
			dedicationsLimit: 12,
			dedicationsOffset: 0,
			totalCount: 0,
			pageQuery: { dedications: '1' },
			mdiAccountCircle,
		};
	},
	computed: {
		lenderDedicationsTitle() {
			return this.lenderInfo?.name
				? `${this.lenderInfo.name}'s loan dedications`
				: 'Loan dedications';
		},
		showedDedications() {
			return this.totalCount > 1
				? `${this.totalCount} dedications`
				: `${this.totalCount} dedication`;
		},
		urlParams() {
			const dedicationsPage = Math.floor(this.dedicationsOffset / this.dedicationsLimit) + 1;

			return { dedications: dedicationsPage > 1 ? String(dedicationsPage) : undefined };
		},
	},
	methods: {
		async fetchLenderDedications() {
			try {
				const { data } = await this.apollo.query({
					query: lenderDedicationsQuery,
					variables: {
						publicId: this.publicId,
						limit: this.dedicationsLimit,
						offset: this.dedicationsOffset
					},
				});

				this.lenderDedications = data.community?.lender?.dedicationsReceived?.values ?? [];
				this.totalCount = data.community?.lender?.dedicationsReceived?.totalCount ?? 0;
			} catch (e) {
				logReadQueryError(e, 'LenderDedicationsList lenderDedicationsQuery');
			}
		},
		pageChange({ pageOffset }) {
			this.dedicationsOffset = pageOffset;
			this.pushChangesToUrl();
			this.fetchLenderDedications();
		},
		updateFromParams(query) {
			const pageNum = numeral(query.dedications).value() - 1;

			this.dedicationsOffset = pageNum > 0 ? this.dedicationsLimit * pageNum : 0;
		},
		pushChangesToUrl() {
			if (!_isEqual(this.$route?.query, this.urlParams)) {
				this.$router.push({ query: this.urlParams });
			}
		},
	},
	mounted() {
		this.fetchLenderDedications();
	},
	created() {
		this.pageQuery = _get(this.$route, 'query');
		this.updateFromParams(this.pageQuery);
	}
};
</script>
