<template>
	<section v-if="lenderInvitees.length > 0" class="tw-my-8">
		<h4 class="data-hj-suppress tw-mb-1">
			{{ lenderInviteesTitle }}
		</h4>
		<p class="tw-mb-2">
			{{ showedInvitees }}
		</p>

		<div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
			<div
				v-for="invitee in lenderInvitees"
				:key="`invitee-${invitee.id}`"
				class="tw-flex tw-flex-col tw-gap-0.5"
			>
				<component
					:is="!invitee.publicId ? 'span' : 'a'"
					:href="`/lender/${invitee.publicId}`"
				>
					<kv-material-icon
						v-if="!getImageUrl(invitee)"
						:icon="mdiAccountCircle"
						class="!tw-block tw-mx-auto tw-w-3/4"
					/>
					<img
						v-else
						:src="getImageUrl(invitee)"
						style="width: 200px;"
						class="tw-object-cover tw-aspect-square"
					>
				</component>
				<component
					class="data-hj-suppress"
					:is="!invitee.publicId ? 'span' : 'a'"
					:href="`/lender/${invitee.publicId}`"
				>
					{{ invitee.name }}
				</component>
				<p v-if="whereabouts(invitee)">
					{{ whereabouts(invitee) }}
				</p>
			</div>
		</div>
		<kv-pagination
			class="tw-mt-4"
			v-if="totalCount > inviteesLimit"
			:limit="inviteesLimit"
			:total="totalCount"
			:offset="inviteesOffset"
			:scroll-to-top="false"
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
import lenderInviteesQuery from '@/graphql/query/lenderInvitees.graphql';
import KvPagination from '~/@kiva/kv-components/vue/KvPagination';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LenderInviteesList',
	inject: ['apollo', 'cookieStore'],
	components: {
		KvPagination,
		KvMaterialIcon,
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
			lenderInvitees: [],
			inviteesLimit: 12,
			inviteesOffset: 0,
			totalCount: 0,
			pageQuery: { invitees: '1' },
			mdiAccountCircle,
		};
	},
	computed: {
		lenderInviteesTitle() {
			return this.lenderInfo?.name
				? `${this.lenderInfo.name}'s invites`
				: 'Invites';
		},
		showedInvitees() {
			return this.totalCount > 1
				? `Showing ${this.totalCount} accepted invitations`
				: `Showing ${this.totalCount} accepted invitation`;
		},
		urlParams() {
			const inviteesPage = Math.floor(this.inviteesOffset / this.inviteesLimit) + 1;

			return { invitees: inviteesPage > 1 ? String(inviteesPage) : undefined };
		},
	},
	methods: {
		async fetchLenderInvitees() {
			try {
				const { data } = await this.apollo.query({
					query: lenderInviteesQuery,
					variables: {
						publicId: this.publicId,
						limit: this.inviteesLimit,
						offset: this.inviteesOffset
					},
				});

				this.lenderInvitees = data.community?.lender?.invitees?.values ?? [];
				this.totalCount = data.community?.lender?.invitees?.totalCount ?? 0;
			} catch (e) {
				logReadQueryError(e, 'LenderInviteesList lenderInviteesQuery');
			}
		},
		pageChange({ pageOffset }) {
			this.inviteesOffset = pageOffset;
			this.pushChangesToUrl();
			this.fetchLenderInvitees();
		},
		updateFromParams(query) {
			const pageNum = numeral(query.invitees).value() - 1;

			this.inviteesOffset = pageNum > 0 ? this.inviteesLimit * pageNum : 0;
		},
		pushChangesToUrl() {
			if (!_isEqual(this.$route?.query, this.urlParams)) {
				this.$router.push({ query: this.urlParams });
			}
		},
		getImageUrl(invitee) {
			return invitee.image?.url ?? '';
		},
		whereabouts(invitee) {
			return invitee.lenderPage?.whereabouts ?? '';
		},
	},
	mounted() {
		this.fetchLenderInvitees();
	},
	created() {
		this.pageQuery = _get(this.$route, 'query');
		this.updateFromParams(this.pageQuery);
	}
};
</script>
