<template>
	<div class="algolia-search-box">
		<ais-search-box
			:placeholder="placeholder"
		/>
		<kv-icon class="algolia-magnifying-glass" name="magnify-glass" :from-sprite="true" />
	</div>
</template>

<script>
import { AisSearchBox } from 'vue-instantsearch';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'AlgoliaSearchBox',
	components: {
		KvIcon,
		AisSearchBox,
	},
	props: {
		placeholder: {
			type: String,
			default: 'Search loans',
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.algolia-search-box {
	position: relative;
	max-width: 640px;

	.ais-SearchBox-form {
		.ais-SearchBox-input {
			width: 100%;
			border-radius: rem-calc(2);
			padding: 0.5rem;
			padding-left: 3rem;
			font-size: 1rem;
			height: 2.6875rem;
			margin: 0 0 1rem;
			border: 1px solid rgb(var(--border-tertiary));

			&::placeholder {
				font-style: normal;
			}

			&::-webkit-search-cancel-button {
				display: none;
			}

			&::-ms-clear {
				display: none;
			}
		}

		.ais-SearchBox-reset {
			position: absolute;
			right: 0;
			top: 2px;
			padding: 0.2rem 0.8rem;
			height: 2.6875rem;

			.ais-SearchBox-resetIcon {
				fill: rgb(var(--text-tertiary));
			}
		}

		.ais-SearchBox-submit {
			display: none;
		}
	}

	.algolia-magnifying-glass {
		position: absolute;
		left: 1rem;
		pointer-events: none;
		top: 0.75rem;
		height: rem-calc(18);
		width: rem-calc(18);
		fill: $gray;
	}
}
</style>
