<template>
	<www-page main-class="tw-bg-secondary">
		<kv-page-container class="tw-pt-3 tw-pb-5 md:tw-pt-4 md:tw-pb-8">
			<div class="tw-flex tw-flex-col tw-gap-1 tw-mb-3 md:tw-mb-4">
				<p class="tw-text-upper tw-text-secondary">
					Your account
				</p>
				<h1>Borrower Messages</h1>
				<p class="tw-text-subhead tw-text-gray-600">
					Messages from the borrowers you have funded, newest first.
				</p>
			</div>
			<p v-if="error" data-testid="messages-error">
				We couldn't load your messages right now. Please refresh the page to try again.
			</p>
			<p v-else-if="totalCount === 0" data-testid="messages-empty">
				You don't have any messages from borrowers yet.
				<router-link
					to="/lend-by-category"
					v-kv-track-event="['portfolio', 'click', 'Borrower messages empty find a loan']"
				>
					Find a borrower to support
				</router-link>
			</p>
			<p v-else-if="isPastLastPage" data-testid="messages-past-last-page">
				There are no messages on this page.
				<router-link
					:to="{ query: pageQuery(1) }"
					v-kv-track-event="['portfolio', 'click', 'Borrower messages go to first page']"
				>
					Go to the first page
				</router-link>
			</p>
			<template v-else>
				<ul
					class="tw--mx-2.5 md:tw-mx-0 tw-bg-white md:tw-rounded tw-divide-y tw-divide-tertiary
						tw-overflow-hidden"
				>
					<template v-if="loading">
						<li
							v-for="index in 3"
							:key="index"
							class="tw-flex tw-gap-1 md:tw-gap-4 tw-px-2.5 tw-py-2.5 md:tw-px-3 md:tw-py-3"
							data-testid="borrower-message-loading"
						>
							<kv-loading-placeholder
								class="tw-shrink-0 tw-rounded-md !tw-w-8 !tw-h-8 md:!tw-w-15 md:!tw-h-15"
							/>
							<div class="tw-flex tw-flex-col tw-gap-1 tw-grow">
								<kv-loading-text class="tw-text-title tw-w-1/2" />
								<kv-loading-text class="tw-text-small tw-w-1/4" />
								<kv-loading-text :lines="3" />
							</div>
						</li>
					</template>
					<template v-else>
						<li v-for="update in updates" :key="update.id">
							<borrower-message-row :message="update" />
						</li>
					</template>
				</ul>
				<kv-pagination
					v-if="showPagination"
					class="tw-mt-3 md:tw-mt-4"
					:class="{ 'tw-pointer-events-none tw-opacity-low': loading }"
					:aria-disabled="loading ? 'true' : undefined"
					:limit="limit"
					:offset="offset"
					:total="totalCount"
					:scroll-to-top="false"
					:kv-track-function="$kvTrackEvent"
					track-event-category="portfolio"
					@page-changed="handlePageChange"
				/>
			</template>
		</kv-page-container>
	</www-page>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import {
	KvLoadingPlaceholder,
	KvLoadingText,
	KvPageContainer,
	KvPagination,
} from '@kiva/kv-components';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import useBorrowerMessages from '#src/composables/useBorrowerMessages';
import BorrowerMessageRow from './BorrowerMessageRow';

defineOptions({ name: 'BorrowerMessagesPage' });

useHead({ title: 'Borrower Messages' });

const $kvTrackEvent = inject('$kvTrackEvent');
const route = useRoute();
const router = useRouter();

const {
	updates,
	totalCount,
	limit,
	offset,
	loading,
	error,
} = useBorrowerMessages();

const showPagination = computed(() => totalCount.value > limit);
const isPastLastPage = computed(() => !loading.value && totalCount.value > 0 && updates.value.length === 0);

const pageQuery = page => {
	const { page: _page, ...query } = route.query;
	return page > 1 ? { ...query, page: String(page) } : query;
};

const handlePageChange = ({ pageOffset }) => {
	if (loading.value) {
		return;
	}
	router.push({ query: pageQuery(pageOffset / limit + 1) });
};
</script>
