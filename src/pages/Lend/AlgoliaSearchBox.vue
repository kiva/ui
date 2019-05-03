<template>
	<div class="algolia-search-box">
		<ais-search-box
			:placeholder="placeholder"
		/>
		<kv-icon class="algolia-magnifying-glass" name="magnify-glass" />
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import { AisSearchBox } from 'vue-instantsearch';

export default {
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
			border-radius: rem-calc(2);
			padding-left: 3rem;

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
				fill: #9d9c9e;
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
