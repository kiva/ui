<template>
	<async-lender-section @visible="fetchLenderDedications">
		<section v-if="lenderDedications.length > 0" class="tw-my-8" id="lender-dedications">
			<div v-if="!isLoading">
				<h2 class="data-hj-suppress tw-mb-1">
					{{ lenderDedicationsTitle }}
				</h2>
				<p class="tw-mb-2">
					{{ showedDedications }}
				</p>
			</div>
			<kv-loading-placeholder
				v-else
				class="tw-mb-2"
				style="height: 55px; width: 250px;"
			/>

			<div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
				<div
					v-for="(dedication, index) in lenderDedications"
					:key="`dedication-${dedication.id}-${index}`"
					class="tw-flex tw-flex-col tw-gap-0.5"
				>
					<div v-if="!dedication.id">
						<kv-loading-placeholder class="tw-w-full tw-aspect-square" />
					</div>
					<div v-else>
						<a
							:href="`/dedication/${dedication.loanId}`"
							v-kv-track-event="[
								'lender-profile',
								'click',
								'lender-received-dedication',
								dedication.senderName,
								dedication.loanId
							]"
						>
							<dedicate-heart class="tw-w-full tw-px-4 tw-fill-brand" />
						</a>
						<a
							:href="`/dedication/${dedication.loanId}`"
							class="data-hj-suppress"
							v-kv-track-event="[
								'lender-profile',
								'click',
								'lender-received-dedication',
								dedication.senderName,
								dedication.loanId
							]"
						>
							Dedicated by {{ dedication.senderName }}
						</a>
					</div>
				</div>
			</div>
			<kv-pagination
				class="tw-mt-4"
				v-if="totalCount > dedicationsLimit"
				:limit="dedicationsLimit"
				:total="totalCount"
				:offset="dedicationsOffset"
				:scroll-to-top="false"
				track-event-category="lender-profile-dedications"
				@page-changed="pageChange"
			/>
		</section>
	</async-lender-section>
</template>

<script>
import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import numeral from 'numeral';
import { mdiAccountCircle } from '@mdi/js';
import logReadQueryError from '#src/util/logReadQueryError';
import { formatPossessiveName } from '#src/util/stringParserUtils';
import smoothScrollMixin from '#src/plugins/smooth-scroll-mixin';
import lenderDedicationsQuery from '#src/graphql/query/lenderDedications.graphql';
import DedicateHeart from '#src/assets/icons/inline/dedicate-heart.svg';
import { KvPagination, KvLoadingPlaceholder } from '@kiva/kv-components';
import AsyncLenderSection from './AsyncLenderSection';

export default {
	name: 'LenderDedicationsList',
	mixins: [smoothScrollMixin],
	inject: ['apollo', 'cookieStore'],
	components: {
		KvPagination,
		DedicateHeart,
		KvLoadingPlaceholder,
		AsyncLenderSection
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
			lenderDedications: new Array(6).fill({ id: 0 }),
			dedicationsLimit: 12,
			dedicationsOffset: 0,
			totalCount: 0,
			pageQuery: { dedications: '1' },
			mdiAccountCircle,
			isLoading: true,
		};
	},
	computed: {
		lenderDedicationsTitle() {
			return this.lenderInfo?.name
				? `${formatPossessiveName(this.lenderInfo.name)} loan dedications`
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
				this.isLoading = false;
			} catch (e) {
				logReadQueryError(e, 'LenderDedicationsList lenderDedicationsQuery');
			}
		},
		pageChange({ pageOffset }) {
			this.dedicationsOffset = pageOffset;
			this.pushChangesToUrl();
			this.fetchLenderDedications();
			this.scrollToSection('#lender-dedications');
		},
		updateFromParams(query) {
			const pageNum = numeral(query.dedications).value() - 1;

			this.dedicationsOffset = pageNum > 0 ? this.dedicationsLimit * pageNum : 0;
		},
		pushChangesToUrl() {
			const currentQuery = this.$route?.query;
			if (!_isEqual(currentQuery, this.urlParams)) {
				this.$router.push({ query: { ...currentQuery, ...this.urlParams } });
			}
		},
		scrollToSection(sectionId) {
			const elementToScrollTo = document.querySelector(sectionId);
			const topOfSectionToScrollTo = (elementToScrollTo?.offsetTop ?? 0) - 50 ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		}
	},
	created() {
		this.pageQuery = _get(this.$route, 'query');
		this.updateFromParams(this.pageQuery);
	},
};
</script>
