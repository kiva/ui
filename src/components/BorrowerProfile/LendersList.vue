<template>
	<div ref="wrapper"
		:class="['tw-mt-1.5', 'lg:tw-mb-1.5']"
	>
		<div
			:class="[
				'tw-w-full',
				'tw-flex tw-flex-col',
				{
					'md:tw-static': !isSticky,
				},
				'tw-relative',
				'lenders-container'
			]"
		>
			<span
				class="tw-inline-block tw-align-middle tw-mb-2"
				data-testid="bp-lend-cta-powered-by-text"
				key="numLendersStat"
			>
				<kv-material-icon
					class="tw-w-2.5 tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle"
					:icon="mdiLightningBolt"
				/>
				{{ poweredByText }}
			</span>
			<div v-for="(lender, idx) in sortedLenders" :key="lender.id">
				<template v-if="isValidLength(idx)">
					<lenders-list-item
						:lender="lender"
					/>
				</template>
			</div>
		</div>
		<div v-if="!isMobile" class="tw-mt-2">
			<button
				class="tw-bg-transparent tw-border tw-border-black tw-px-3 tw-py-1 tw-rounded tw-text-base"
				@click="toogleLightBox"
			>
				See all lenders
			</button>
		</div>
	</div>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import LendersListItem from '@/components/BorrowerProfile/LendersListItem';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LendersList',
	inject: ['apollo', 'cookieStore'],
	props: {
		lenders: {
			type: Array,
			default: () => []
		},
		isMobile: {
			type: Boolean,
			default: false
		}
	},
	components: {
		LendersListItem,
		KvMaterialIcon,
	},
	data() {
		return {
			mdiLightningBolt,
		};
	},
	methods: {
		isValidLength(idx) {
			return (this.isMobile && idx < 2) || (!this.isMobile && idx < 3);
		},
		toogleLightBox() {
			this.$emit('tooglelightbox');
		}
	},
	computed: {
		isSticky() {
			return true;
		},
		limit() {
			return this.lenders.length > 3 ? 2 : 1;
		},
		sortedLenders() {
			const inviterName = this.$route.query.utm_content ?? '';
			const inviterIndex = this.lenders.findIndex(lender => {
				return inviterName.localeCompare(lender?.name) === 0;
			});
			return inviterIndex >= 0 ? [
				this.lenders[inviterIndex],
				...this.lenders.slice(0, inviterIndex),
				...this.lenders.slice(inviterIndex + 1, this.lenders.length - 1)
			] : this.lenders;
		},
		lendersListName() {
			if (this.lenders.length < 4) return this.sortedLenders[0].name;
			const filteredLenders = [...this.sortedLenders].slice(0, this.limit);
			// eslint-disable-next-line max-len
			return filteredLenders.map(lender => lender.name)
				.join(', ')
				.replace(/,\s*$/, '');
		},
		poweredByText() {
			if (this.lenders.length - this.limit <= 0) return `powered by ${this.lendersListName}`;
			if (this.lenders.length - this.limit === 1) return `powered by ${this.lendersListName} and 1 more`;
			return `powered by ${this.lendersListName} and ${this.lenders.length - this.limit} others`;
		}
	}
};

</script>

<style lang="scss" scoped>
	.lenders-container::after {
		content: "";
		position: absolute;
		z-index: 1;
		bottom: 0;
		left: 0;
		pointer-events: none;
		background-image: linear-gradient(to bottom, transparent, rgba(245, 245, 245, 1) 100%);
		width: 100%;
		height: 5em;

		@media screen and (min-width: 660px) {
			background-image: linear-gradient(to bottom, transparent, white);
		}
	}

</style>
