<template>
	<div class="pill-toggle">
		<div
			v-for="option in options"
			:key="option.key"
			class="pill"
		>
			<label class="label">
				<input
					class="radio"
					type="radio"
					:class="option.key"
					:disabled="option.disabled"
					:value="option.key"
					v-model="checked"
					@change="onChange(option.key)"
				>
				<span class="title">{{ option.title }}</span>
			</label>
		</div>
	</div>
</template>

<script>
export default {
	props: {
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
		selected: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			checked: ''
		};
	},
	methods: {
		onChange(key) {
			this.$emit('pill-toggled', key);
		},
	},
	created() {
		this.checked = this.selected;
	}
};

</script>

<style lang="scss" scoped>
@import "settings";

$form-border-radius: rem-calc(3);

.pill-toggle {
	display: flex;
	// height: rem-calc(34);

	.label {
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

	.title {
		flex: 1;
		padding: rem-calc(6) rem-calc(13);
		color: $tab-pill-color;
		border: $tab-pill-border;
	}

	.pill {
		background: $tab-pill-background;
		min-width: rem-calc(85);

		&:first-child {
			.title {
				border-bottom-left-radius: $form-border-radius;
				border-top-left-radius: $form-border-radius;
				margin-left: 0;
			}
		}

		&:last-child {
			.title {
				border-bottom-right-radius: $form-border-radius;
				border-top-right-radius: $form-border-radius;
			}
		}
	}

	.radio {
		position: absolute;
		opacity: 0;
		width: 0;

		&:focus + .title {
			border: $input-border-focus;
			background-color: $input-background-focus;
			box-shadow: $input-shadow-focus;
		}

		&:checked + .title {
			background: $tab-pill-active-background;
			color: $white;
			cursor: default;
			border-color: $kiva-green;
			position: relative;
		}

		&:active + .title {
			background: $kiva-green;
			color: $white;
		}

		&[disabled] + .title {
			@include disabled();
		}
	}
}
</style>
