<template>
	<div class="tw-relative">
		<kv-classic-loan-card
			class="tw-h-full"
			:loan-id="loanId"
			:loan="loan"
			:custom-loan-details="customLoanDetails"
			:use-full-width="useFullWidth"
			:show-tags="showTags"
			:category-page-name="categoryPageName"
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:five-dollars-selected="fiveDollarsSelected"
			:large-card="largeCard"
			:is-adding="isAdding"
			:is-visitor="isVisitor"
			:basket-items="basketItems"
			:is-bookmarked="isBookmarked"
			:kv-track-function="$kvTrackEvent"
			:photo-path="PHOTO_PATH"
			:show-view-loan="showViewLoan"
			:external-links="true"
			:route="$route"
			:user-balance="userBalance"
			:get-cookie="getCookie"
			:set-cookie="setCookie"
			:is-team-pick="isTeamPick"
			:combined-activities="combinedActivities"
			:error-msg="errorMsg"
			:custom-href="customHref"
			@toggle-bookmark="toggleBookmark"
			@jump-filter-page="jumpFilterPage"
			@add-to-basket="addToBasket"
			@show-loan-details="showLoanDetails"
		/>
		<div ref="bubble" class="tw-absolute tw-right-3 tw-z-modal">
			<kv-user-avatar
				v-show="addToBasketExpEnabled && showBubble"
				class="loan-image tw-rounded-full"
				:style="bubbleStyle"
				:lender-name="borrowerName"
				:lender-image-url="borrowerImageUrl"
				:class="{'animate': isAnimating}"
				@transitionend="resetBubble"
			/>
		</div>
	</div>
</template>

<script>
import * as Sentry from '@sentry/vue';
import { gql } from 'graphql-tag';
import { setLendAmount, handleInvalidBasket, hasBasketExpired } from '#src/util/basketUtils';
import { readLoanFragment, watchLoanData } from '#src/util/loanUtils';
import bookmarkLoan from '#src/util/bookmarkUtil';
import logFormatter from '#src/util/logFormatter';
import { createIntersectionObserver } from '#src/util/observerUtils';
import percentRaisedMixin from '#src/plugins/loan/percent-raised-mixin';
import loanCardFieldsExtendedFragment from '#src/graphql/fragments/loanCardFieldsExtended.graphql';
import loanActivitiesQuery from '#src/graphql/query/loanActivities.graphql';
import _isEqual from 'lodash/isEqual';
import { KvClassicLoanCard, KvUserAvatar } from '@kiva/kv-components';

const PHOTO_PATH = 'https://www.kiva.org/img/';

const loanQuery = gql`
	${loanCardFieldsExtendedFragment}
	query kcBasicLoanCard($basketId: String, $loanId: Int!) {
	shop (basketId: $basketId) {
		id
		nonTrivialItemCount
		basket {
			id
			# for isInBasket
			items {
				values {
					id
				}
			}
		}
	}
	lend {
		loan(id: $loanId) {
			id
			...loanCardFieldsExtended
		}
		loanThemeFilter {
			id
			name
		}
		tag {
			id
			name
			vocabularyId
		}
	}
	my {
		id
		userAccount {
			id
		}
	}
}`;

export default {
	name: 'KvClassicLoanCardContainer',
	emits: ['add-to-basket', 'show-cart-modal', 'updating-totals', 'show-loan-details'],
	props: {
		loanId: {
			type: Number,
			required: true,
		},
		customLoanDetails: {
			type: Boolean,
			default: false
		},
		useFullWidth: {
			type: Boolean,
			default: false
		},
		showTags: {
			type: Boolean,
			default: false
		},
		categoryPageName: {
			type: String,
			default: '',
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		enableMoreCta: {
			type: Boolean,
			default: false
		},
		largeCard: {
			type: Boolean,
			default: false
		},
		showViewLoan: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: String,
			default: undefined
		},
		fiveDollarsSelected: {
			type: Boolean,
			default: false
		},
		isTeamPick: {
			type: Boolean,
			default: false,
		},
		showLoansActivityFeed: {
			type: Boolean,
			default: false,
		},
		addToBasketExpEnabled: {
			type: Boolean,
			default: false,
		},
		customHref: {
			type: String,
			default: '',
		},
		enableAiLoanPills: {
			type: Boolean,
			default: false
		},
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [percentRaisedMixin],
	components: {
		KvClassicLoanCard,
		KvUserAvatar,
	},
	data() {
		return {
			loan: null,
			basketItems: null,
			queryObserver: null,
			viewportObserver: null,
			isAdding: false,
			loanCallouts: undefined,
			isVisitor: true,
			isBookmarked: false,
			watchedQuery: {},
			PHOTO_PATH,
			combinedActivities: [],
			errorMsg: '',
			showBubble: false,
			isAnimating: false,
			targetPosition: {
				top: 0, left: 0, width: 0, height: 0
			},
			bubbleStyle: {},
			basketCount: 0,
		};
	},
	methods: {
		createViewportObserver() {
			// Watch for this element being in the viewport
			this.viewportObserver = createIntersectionObserver({
				targets: [this.$el],
				callback: entries => {
					entries.forEach(entry => {
						if (entry.target === this.$el && entry.intersectionRatio > 0) {
							// This element is in the viewport, so load the data
							this.loadData();
						}
					});
				}
			});
			if (!this.viewportObserver) {
				// Observer was not created, so call loadData right away as a fallback
				this.loadData();
			}
		},
		destroyViewportObserver() {
			if (this.viewportObserver) {
				this.viewportObserver.disconnect();
			}
		},
		loadData() {
			if (!this.queryObserver) {
				this.watchedQuery = watchLoanData({
					apollo: this.apollo,
					cookieStore: this.cookieStore,
					loanId: this.loanId,
					loanQuery,
					callback: result => this.processQueryResult(result),
				});
				this.queryObserver = this.watchedQuery.queryObserver;
			}
		},
		processQueryResult(result) {
			if (result.error) {
				console.error(result.error);
				this.$showTipMsg('There was a problem loading the loan', 'error');
				try {
					Sentry.withScope(scope => {
						scope.setTag('wizard_stage', 'results');
						scope.setTag('loan_id', this.loanId);
						Sentry.captureException(result.error);
					});
				} catch (e) {
					// no-op
				}
			}

			this.isVisitor = !result.data?.my?.userAccount?.id ?? true;

			// Some pages initially show loading cards without loan IDs
			if (result.data?.lend?.loan) {
				this.loan = result.data.lend.loan;
				this.isBookmarked = result.data.lend.loan?.userProperties?.favorited ?? false;
			}

			// Getting tags and themes data for clickable pills
			const { tags, themes } = this.loan || {};
			const tagList = result.data?.lend?.tag || [];
			const themeList = result.data?.lend?.loanThemeFilter || [];
			const tagsData = tagList.filter(tag => {
				return tags?.includes(tag.name) && tag?.vocabularyId === 2;
			});
			const publicTags = tagsData.map(tag => tag.name);
			const themesData = themeList.filter(theme => {
				return themes?.includes(theme.name);
			});
			this.loan = {
				...this.loan,
				tags: publicTags,
				tagsData,
				themesData
			};

			this.basketItems = result.data?.shop?.basket?.items?.values || null;
			this.basketCount = result.data?.shop?.nonTrivialItemCount || 0;
		},
		addToBasket(lendAmount) {
			// emitting updating tools for empty state in checkout page
			this.$emit('updating-totals', true);
			this.isAdding = true;
			this.errorMsg = '';
			return setLendAmount({
				amount: lendAmount,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				if (this.addToBasketExpEnabled) {
					this.animateBubble();
					// Show modal after 1s (Defined in CSS)
					setTimeout(() => {
						this.formatAddedLoan();
					}, 1000);
				}
				this.isAdding = false;
				this.$emit('add-to-basket', { loanId: this.loanId, name: this.loan?.name, success: true });
				this.$kvTrackEvent(
					'loan-card',
					'add-to-basket',
					null,
					this.loanId,
					this.lessThan25 ? this.amountLeft : 25
				);
			}).catch(e => {
				this.$emit('add-to-basket', { loanId: this.loanId, success: false });
				const msg = e?.[0]?.extensions?.code === 'reached_anonymous_basket_limit'
					? e?.[0]?.message
					: 'There was a problem adding the loan to your basket';
				this.errorMsg = msg;
				this.$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
				Sentry.captureException(e);
				// Handle errors from adding to basket
				if (hasBasketExpired(e?.[0]?.extensions?.code)) {
					// eslint-disable-next-line max-len
					this.$showTipMsg('There was a problem adding the loan to your basket, refreshing the page to try again.', 'error');
					return handleInvalidBasket({
						cookieStore: this.cookieStore,
						loan: {
							id: this.loanId,
							price: lendAmount
						}
					});
				}
				this.$showTipMsg(msg, 'error');
				this.isAdding = false;
			});
		},
		showLoanDetails() {
			this.$emit('show-loan-details', this.loan);
		},
		toggleBookmark() {
			if (!this.loanId) return;

			// Set bookmark optimistically
			this.isBookmarked = !this.isBookmarked;

			bookmarkLoan(this.apollo, this.loanId, this.isBookmarked)
				.then(() => {
					this.$kvTrackEvent(
						'Lending',
						'Loan Favorite Toggled',
						this.isBookmarked ? 'Favorite Loan Added' : 'Loan Favorite Removed',
						this.isBookmarked,
					);
				}).catch(error => {
					logFormatter(error, 'error');

					this.$kvTrackEvent('Lending', 'Loan Favorite Toggled', 'Failed to toggle favorite.');

					// Error occurred, change bookmark back due to failure
					this.isBookmarked = !this.isBookmarked;
				});
		},
		getCookie(name) {
			return this.cookieStore.get(name);
		},
		setCookie(name, value, options) {
			return this.cookieStore.set(name, value, options);
		},
		async fetchLoanActivity() {
			await this.apollo.query({
				query: loanActivitiesQuery,
				variables: { loanId: this.loanId }
			}).then(({ data }) => {
				const activities = [];

				const lendingActionsData = data.lend?.loan?.lendingActions?.values ?? [];
				const commentsData = data.lend?.loan?.comments?.values ?? [];

				lendingActionsData.forEach(action => {
					const actionDate = new Date(action?.latestSharePurchaseDate).toDateString();
					if (!activities.some(activity => activity.key === actionDate)) {
						activities.push({
							key: actionDate,
							data: [],
						});
					}
					if (action?.lender?.name) {
						const dataObject = activities.find(activity => activity.key === actionDate);
						dataObject?.data.push({
							lenderName: action.lender.name,
							lenderImage: action.lender?.image?.url,
							text: `${action.lender.name} lent`,
							date: action.latestSharePurchaseDate,
							type: action.__typename, // eslint-disable-line no-underscore-dangle
						});
					}
				});

				commentsData.forEach(comment => {
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
							type: comment.__typename, // eslint-disable-line no-underscore-dangle
						});
					}
				});

				// Sort activities by day
				const sortedActivities = activities.sort((a, b) => new Date(b.key).getTime() - new Date(a.key).getTime()); // eslint-disable-line max-len

				// Sort combined lending and comment activities within each day
				sortedActivities.forEach(d => d.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); // eslint-disable-line max-len

				// Set combined activities
				this.combinedActivities = sortedActivities;
			}).catch(e => {
				logFormatter(e, 'error');

				this.$kvTrackEvent('Lending', 'loan-card', 'Failed to fetch loan activity data.');
			});
		},
		jumpFilterPage(filter) {
			this.$kvTrackEvent('Lending', 'loan-card', 'clicked-tag', filter.type, filter.id.toString());
			const { query: currentQuery } = this.$route;
			const query = { ...currentQuery };

			if (filter.type in query && query[filter.type] !== filter.id.toString()) {
				query[filter.type] += `,${filter.id.toString()}`;
			} else {
				query[filter.type] = filter.id.toString();
			}

			if (!_isEqual(currentQuery, query)) {
				this.$router.push({
					path: '/lend/filter',
					query,
				});
			}
		},
		getTargetPosition() {
			const targets = [...document.querySelectorAll('[data-testid="header-basket"]')];
			const target = targets.find(t => t?.clientHeight);
			return target.getBoundingClientRect();
		},
		animateBubble() {
			const position = this.getTargetPosition();
			this.targetPosition = {
				top: position.top,
				left: position.left,
				width: position.width,
				height: position.height
			};

			this.showBubble = true;
			this.$nextTick(() => {
				const { bubble } = this.$refs;
				const bubbleRect = bubble.getBoundingClientRect();
				const targetX = this.targetPosition.left - bubbleRect.left
					+ this.targetPosition.width / 2 - bubbleRect.width / 2;
				const targetY = this.targetPosition.top - bubbleRect.top
					+ this.targetPosition.height / 2 - bubbleRect.height / 2;
				this.isAnimating = true;
				this.bubbleStyle = {
					transform: `translate(${targetX}px, ${targetY}px)`,
					opacity: 0
				};
			});
		},
		resetBubble() {
			this.showBubble = false;
			this.isAnimating = false;
		},
		formatAddedLoan() {
			const addedLoan = {
				id: this.loan?.id,
				name: this.loan?.name ?? '',
				gender: this.loan?.gender ?? '',
				borrowerCount: this.loan?.borrowerCount ?? 1,
				themes: this.loan?.themes ?? [],
				basketSize: this.basketCount,
			};
			this.$emit('show-cart-modal', addedLoan);
		},
	},
	mounted() {
		if (this.loan) {
			// Already have a loan, so only setup watch query to handle changes in data
			this.loadData();
		} else {
			// Don't have a loan yet, so setup viewport observer to prepare async loading
			this.createViewportObserver();
		}

		// fetch loan activity
		if (this.showLoansActivityFeed && this.isTeamPick) {
			this.fetchLoanActivity();
		}
	},
	beforeUnmount() {
		this.destroyViewportObserver();
		this.watchedQuery.subscription?.unsubscribe();
	},
	created() {
		// Use cached loan data if it exists
		const cachedLoan = readLoanFragment({
			apollo: this.apollo,
			loanId: this.loanId,
			fragment: loanCardFieldsExtendedFragment,
		});
		if (cachedLoan) {
			this.loan = cachedLoan;
		}
	},
	watch: {
		loanId(loanId) {
			if (this.queryObserver) {
				this.queryObserver.setVariables({
					basketId: this.cookieStore.get('kvbskt'),
					loanId,
				});
			}
		},
	},
	computed: {
		borrowerName() {
			return this.loan?.name ?? '';
		},
		borrowerImageUrl() {
			return this.loan?.image?.url ?? '';
		},
	}
};
</script>

<style lang="postcss" scoped>

.loan-image {
	transition: transform 1s, opacity 1s;
}

.loan-image.animate {
	opacity: 0;
}
</style>
