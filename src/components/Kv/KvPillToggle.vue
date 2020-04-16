<template>
	<div :class="{ 'kv-pill-toggle': true, 'split-pills': splitPills }">
		<div
			v-for="option in options"
			:key="option.key"
			:class="{ 'pill': true, 'split-pill': splitPills }"
		>
			<input
				class="radio"
				type="radio"
				:id="`${id}-${option.key}`"
				:disabled="option.disabled"
				:value="option.key"
				v-model="checked"
				@change="onChange(option.key)"
			>
			<label
				:class="{ 'label': true, 'split-pill-label': splitPills }"
				:for="`${id}-${option.key}`"
			>
				{{ option.title }}
			</label>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		id: {
			type: String,
			required: true
		},
		options: {
			type: Array,
			required: true,
			default() {
				return [
					{
						title: '',
						key: '',
						disabled: false
					}
				];
			}
		},
		/**
     	* A key from options array you want to be selected
     	*/
		selected: {
			type: String,
			default: '',
		},
		splitPills: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			checked: this.selected
		};
	},
	methods: {
		onChange(key) {
			this.$emit('pill-toggled', key);
		},
	}
};

</script>

<style lang="scss" scoped>
@import "settings";

.kv-pill-toggle {
	display: flex;

	.label {
		flex: 1;
		padding: rem-calc(6) rem-calc(13);
		border: rem-calc(1) solid $form-border-color;
		display: flex;
		justify-content: center;
		align-items: stretch;
		margin: 0;
		font-size: 1em;
		text-align: center;
		min-height: 100%;
		margin-left: rem-calc(-1);
		line-height: 1.3;
		box-shadow: 0 0 0 0 rgba(79, 175, 78, 0.2);
		transition: border-color 100ms ease-in-out, box-shadow 100ms ease-in-out;

		&:hover {
			background: $white;
		}
	}

	.pill {
		background: $platinum;
		min-width: rem-calc(85);

		&:first-child {
			.label {
				border-bottom-left-radius: $form-border-radius;
				border-top-left-radius: $form-border-radius;
				margin-left: 0;
			}
		}

		&:last-child {
			.label {
				border-bottom-right-radius: $form-border-radius;
				border-top-right-radius: $form-border-radius;
			}
		}
	}

	.radio {
		position: absolute;
		opacity: 0;
		width: 0;

		&:focus + .label {
			@include form-focus();
		}

		&:checked + .label {
			color: $white;
			background: $form-checked-color;
			cursor: default;
			border-color: $form-checked-border-color;
			position: relative;
		}

		&:active + .label {
			background: $form-active-color;
			color: #fff;
		}

		&[disabled] + .label {
			@include disabled();
		}

		&[disabled]:active + .label,
		&[disabled] + .title:hover {
			background: inherit;
			color: #fff;
		}
	}
}

.split-pills {
	flex-wrap: wrap;

	.split-pill {
		flex: 1 1 auto;
		margin: 0.5rem;

		.split-pill-label {
			border-radius: $form-border-radius;
		}

		&:first-child {
			.split-pill-label {
				border-radius: $form-border-radius;
			}
		}

		&:last-child {
			.split-pill-label {
				border-radius: $form-border-radius;
			}
		}
	}
}
</style>
