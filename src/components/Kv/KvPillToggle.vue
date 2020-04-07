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

$form-border-radius: rem-calc(3);

.kv-pill-toggle {
	display: flex;

	.label {
		flex: 1;
		padding: rem-calc(6) rem-calc(13);
		color: $tab-pill-color;
		border: $tab-pill-border;
		display: flex;
		justify-content: center;
		align-items: stretch;
		margin: 0;
		font-size: 1em;
		text-align: center;
		min-height: 100%;
		margin-left: rem-calc(-1);
		line-height: 1.3;

		&:hover {
			background: $white;
			color: $kiva-text-dark;
		}
	}

	.pill {
		background: $tab-pill-background;
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
			border: $input-border-focus;
			background-color: $input-background-focus;
			box-shadow: $input-shadow-focus;
		}

		&:checked + .label {
			background: $tab-pill-active-background;
			color: $white;
			cursor: default;
			border-color: $kiva-green;
			position: relative;
		}

		&:active + .label {
			background: $kiva-green;
			color: $white;
		}

		&[disabled] + .label {
			@include disabled();
		}

		&[disabled]:active + .label,
		&[disabled] + .title:hover {
			background: inherit;
			color: $tab-pill-color;
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
