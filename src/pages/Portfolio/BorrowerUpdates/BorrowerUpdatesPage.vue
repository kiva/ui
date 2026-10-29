<template>
	<www-page main-class="tw-bg-secondary">
		<kv-page-container class="tw-pt-4 tw-pb-8">
			<h1 class="tw-mb-2">
				Updates from borrowers
			</h1>
			<p v-if="error" class="tw-mt-4" data-testid="updates-error">
				We couldn't load your updates right now. Please refresh the page to try again.
			</p>
			<p v-else-if="totalCount === 0" class="tw-mt-4" data-testid="updates-empty">
				You don't have any updates from borrowers yet.
				<router-link to="/lend-by-category">
					Find a borrower to support
				</router-link>
			</p>
			<p v-else-if="isPastLastPage" class="tw-mt-4" data-testid="updates-past-last-page">
				There are no updates on this page.
				<router-link :to="{ query: pageQuery(1) }">
					Go to the first page
				</router-link>
			</p>
			<template v-else>
				<ul class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-2">
					<template v-if="loading">
						<li v-for="index in 3" :key="index">
							<kv-loading-placeholder class="tw-rounded" style="height: 12rem;" />
						</li>
					</template>
					<template v-else>
						<li v-for="update in updates" :key="update.id" data-testid="borrower-update">
							<journal-update-card
								:update="update"
								:read-more-url="`/blog/loan/${update.id}`"
								:show-share="false"
							/>
						</li>
					</template>
				</ul>
				<kv-pagination
					v-if="showPagination"
					class="tw-mt-4"
					:class="{ 'tw-pointer-events-none tw-opacity-low': loading }"
					:aria-disabled="loading ? 'true' : undefined"
					:limit="limit"
					:offset="offset"
					:total="totalCount"
					:scroll-to-top="false"
					:kv-track-function="kvTrackEvent"
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
import { KvLoadingPlaceholder, KvPageContainer, KvPagination } from '@kiva/kv-components';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import JournalUpdateCard from '#src/components/MyKiva/JournalUpdateCard';
import useMyUpdates from '#src/composables/useMyUpdates';

defineOptions({ name: 'BorrowerUpdatesPage' });

useHead({ title: 'Updates from borrowers' });

// Not named $kvTrackEvent: the template doesn't read $-prefixed setup bindings, it would get the global instead
const kvTrackEvent = inject('$kvTrackEvent');
const route = useRoute();
const router = useRouter();

const {
	updates,
	totalCount,
	limit,
	offset,
	loading,
	error,
} = useMyUpdates();

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
