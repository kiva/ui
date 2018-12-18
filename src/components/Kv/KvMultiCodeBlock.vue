<template>
	<div>
		<div class="tab-container">
			<div
				v-for="{title, index} in code"
				:key="index"
				class="tab"
				:class="`${isTabSelected(index) ? 'active' : ''}`"
				@click="setSelected(index)"
			>
				{{ title }}
			</div>
		</div>
		<kv-code-block :code="selectedCode" :nowrap="nowrap" />
	</div>
</template>

<script>
import KvCodeBlock from '@/components/Kv/KvCodeBlock';

export default {
	components: {
		KvCodeBlock,
	},
	data() {
		return {
			code: [
				{
					title: 'JS',
					snippet: 'dfghjkl;rgthjklghjkl',
				},
				{
					title: 'ES',
					snippet: '123',
				},
			].map((codeObject, index) => ({ ...codeObject, index })),
			selectedIndex: 0,
		};
	},
	props: {
		/*
		code: {
			type: Array,
			default: () => [],
		},
		*/
		nowrap: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		selectedCode() {
			return this.code[this.selectedIndex].snippet;
		},
	},
	methods: {
		isTabSelected(index) {
			return index === this.selectedIndex;
		},
		setSelected(index) {
			this.selectedIndex = index;
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.tab-container {
	display: flex;
	justify-content: flex-start;
	margin-bottom: 0.25rem;

	.tab {
		border-bottom: 1px solid rgba(17, 138, 238, 0);
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		user-select: none;
		transition: color 0.18s linear, border-bottom 0.18s linear;

		&:hover, &.active {
			color: $blue;
		}

		&.active {
			border-bottom: 1px solid rgba(17, 138, 238, 1);
		}
	}
}
</style>
