<template>
	<div v-if="combinedActivities.length > 0" class="loan-activity">
		<div class="tw-relative tw-flex tw-flex-col tw-gap-1 lg:tw-px-0">
			<div class="tw-absolute top-0 tw-h-full tw-w-full loan-activity-overlay"></div>
			<kv-activity-row
				v-for="(activity, index) in shortActivity"
				:key="index"
				:activity="activity"
			/>
		</div>
		<div class="tw-flex tw-justify-center tw-mt-1 tw-text-small">
			<button
				v-kv-track-event="['Borrower profile', 'click', 'see-all-activity']"
				class="tw-text-action hover:tw-underline"
				@click="showActivityModal"
			>
				See all activity
			</button>
		</div>
		<kv-lightbox
			:title="modalTitle"
			:visible="lightboxOpen"
			@lightbox-closed="closeLightbox"
		>
			<div class="tw-overflow-x-hidden tw-px-2 tw-pb-1">
				<div
					v-for="activity in combinedActivities"
					:key="activity.key"
					class="md:tw-px-8 lg:tw-px-14 tw-mt-4"
				>
					<h4 class="tw-text-center tw-text-h4">
						{{ formattedDate(activity.key) }}
					</h4>
					<div class="tw-flex tw-flex-col tw-gap-y-1">
						<kv-activity-row
							v-for="(act, index) in activity.data"
							:key="index"
							:activity="act"
						/>
					</div>
				</div>
			</div>
			<div>
				<p v-if="errorMsg" class="tw-mt-1 tw-text-small tw-text-danger">
					{{ errorMsg }}
				</p>
				<div class="tw-flex tw-justify-end tw-mt-4 tw-pb-2.5 md:tw-pb-4">
					<kv-lend-cta
						:loan="loan"
						:is-loading="false"
						:kv-track-function="$kvTrackEvent"
						:get-cookie="getCookie"
						:set-cookie="setCookie"
						:user-balance="userBalance"
						:basket-items="basketItems"
						:route="$route"
						:is-adding="isAdding"
						@add-to-basket="addToBasket"
					/>
				</div>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
import { format } from 'date-fns';
import KvLightbox from '#kv-components/KvLightbox';
import KvLendCta from '#kv-components/KvLendCta';
import KvActivityRow from './KvActivityRow';

export default {
	name: 'KvLoanActivities',
	inject: ['cookieStore'],
	components: {
		KvActivityRow,
		KvLightbox,
		KvLendCta
	},
	emits: ['add-to-basket'],
	props: {
		/**
		 * loan object coming from parent component
		 */
		loan: {
			type: Object,
			default: () => ({}),
		},
		/**
		 * loan activities coming from parent component
		 */
		activities: {
			type: Object,
			default: () => ({}),
		},
		/**
		 * isAdding flag coming from parent add to basket method
		 */
		isAdding: {
			type: Boolean,
			default: false
		},
		/**
		 * basketItems array coming from parent component
		 */
		basketItems: {
			type: Array,
			default: () => ([]),
		},
		/**
		 * userBalance string coming from parent component
		 */
		userBalance: {
			type: String,
			default: undefined
		},
		/**
		 * errorMsg string coming from parent add to basket method
		 */
		errorMsg: {
			type: String,
			default: undefined
		},
	},
	data() {
		return {
			lightboxOpen: false,
			commentsData: this.activities?.lend?.loan?.comments?.values || [],
			lendingActionsData: this.activities?.lend?.loan?.lendingActions?.values || [],
		};
	},
	computed: {
		combinedActivities() {
			const activities = [];

			this.lendingActionsData.forEach(action => {
				const actionDate = new Date(action?.latestSharePurchaseDate).toDateString();
				if (!activities.some(activity => activity.key === actionDate)) {
					activities.push({
						key: actionDate,
						data: [],
					});
				}
				if (action?.lender.name) {
					const dataObject = activities.find(activity => activity.key === actionDate);
					dataObject?.data.push({
						lenderName: action.lender.name,
						lenderImage: action.lender?.image?.url,
						text: `${action.lender.name} lent`,
						date: action.latestSharePurchaseDate,
					});
				}
			});

			this.commentsData.forEach(comment => {
				const commentDate = new Date(comment?.date).toDateString();
				if (!activities.some(activity => activity.key === commentDate)) {
					activities.push({
						key: commentDate,
						data: [],
					});
				}
				if (comment?.authorName) {
					const dataObject = activities.find(activity => activity.key === commentDate);
					dataObject?.data.push({
						lenderName: comment.authorName,
						lenderImage: comment.authorLendingAction?.lender?.image?.url,
						text: comment.body
							? `${comment.authorName} left comment <span class="tw-italic">"${comment.body}"</span>`
							: '',
						date: comment.date,
					});
				}
			});

			// Sort activities by day
			const sortedActivities = activities.sort((a, b) => new Date(b.key).getTime() - new Date(a.key).getTime());

			// Sort combined lending and comment activities within each day
			sortedActivities.forEach(d => d.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); // eslint-disable-line max-len

			return sortedActivities;
		},
		shortActivity() {
			const activities = [];
			this.combinedActivities.forEach(activity => {
				activity.data.forEach(element => {
					activities.push(element);
				});
			});

			return activities.slice(0, 3);
		},
		modalTitle() {
			return `Activity for ${this.loan?.name}`;
		},
	},
	methods: {
		getCookie(name) {
			return this.cookieStore.get(name);
		},
		setCookie(name, value, options) {
			return this.cookieStore.set(name, value, options);
		},
		addToBasket(lendAmount) {
			this.$emit('add-to-basket', lendAmount);
		},
		formattedDate(date) {
			const dateObj = new Date(date);
			return format(dateObj, 'MMM d, yyyy');
		},
		showActivityModal() {
			this.lightboxOpen = true;
		},
		closeLightbox() {
			this.lightboxOpen = false;
		},
	},
};
</script>

<style scoped lang="postcss">
.loan-activity-overlay {
	background: linear-gradient(0deg, #f5f5f5 0%, rgb(255 255 255 / 0%) 100%);
}

@screen lg {
	.loan-activity-overlay {
		background: linear-gradient(0deg, #fff 0%, rgb(245 245 245 / 0%) 60%);
	}
}

.loan-activity :deep(#kvLightboxBody) {
	@apply tw-flex tw-flex-col tw-px-0 tw-pb-0;
}

.loan-activity :deep(#kvLightboxBody) div {
	box-shadow: none;
}

.loan-activity :deep(#kvLightboxBody) > div:first-child {
	@apply tw-px-4;
}

.loan-activity :deep([role=dialog]) {
	min-width: 840px;
	max-width: 840px !important;

	@media (width <= calc(840px + 2rem)) {
		min-width: 100%;
		max-width: 100% !important;
	}
}

.loan-activity :deep(#kvLightboxBody) > div:nth-child(2) {
	@apply tw-px-4;

	box-shadow: var(--kiva-negative-box-shadow);
}

.loan-activity :deep(div) > div > div > div > div:first-child {
	box-shadow: var(--kiva-box-shadow);
}

.loan-activity :deep(div) > div > div > div > div:first-child > div {
	box-shadow: none;
}
</style>
