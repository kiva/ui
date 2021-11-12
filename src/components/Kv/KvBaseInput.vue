<template>
	<label class="kv-base-input" :for="name">
		<slot></slot>
		<div class="kv-base-input__wrapper">
			<input
				:id="name"
				:name="name"
				class="kv-base-input__input"
				:class="{ 'kv-base-input__input--error': validation.$error }"
				v-model="inputValue"
				v-on="inputListeners"
				v-bind="$attrs"
			>
			<kv-icon class="kv-base-input__error-icon" v-show="validation.$error" name="alert-circle" />
		</div>
		<slot name="after"></slot>
		<ul class="kv-base-input__error-list" v-show="validation.$error">
			<li class="kv-base-input__error-item"
				v-for="error in errors"
				:key="error"
			>
				<slot :name="error"></slot>
			</li>
		</ul>
	</label>
</template>

<script>
import inputWrapperMixin from '@/plugins/input-wrapper-mixin';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	name: 'KvBaseInput',
	props: {
		// Name of the input. Will be used as the id, so make sure that it is unique to the page.
		name: {
			type: String,
			required: true,
		},
		// Validation object from Vuelidate for this input
		validation: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	mixins: [inputWrapperMixin],
	components: {
		KvIcon,
	},
	computed: {
		// A named slot will be created for each validator that fails, where the name of the slot will
		// be the key of the validator that failed in the validation object
		errors() {
			return Object.keys(this.validation.$params || {}).filter(param => !this.validation[param]);
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.kv-base-input {
	margin: 0 0 rem-calc(32); // override foundation var $form-spacing
	text-align: left;
	font-weight: 500; // override foundation var $form-label-font-weight
	font-size: 1rem; // override foundation var $form-label-font-size
	line-height: 1.4; // override foundation var $form-label-line-height

	&__wrapper {
		position: relative;
	}

	&__input {
		margin: 0; // override foundation var $form-spacing
		padding: rem-calc(12); // override foundation var $input-padding
		height: rem-calc(40); // override foundation var based on $input-font-size, $input-line-height, $input-padding
		line-height: 1; // override foundation var $input-line-height
		border: 1px solid $kiva-glyph-grey-primary; // override foundation var $input-border
		border-radius: rem-calc(4); // override foundation var $input-radius
		box-shadow: none; // override foundation var $input-shadow

		&:focus {
			box-shadow: none; // override foundation var $input-shadow-focus
			border: 1px solid $kiva-glyph-grey-primary; // override foundation var $input-border-focus
		}

		&[type="checkbox"] {
			float: left;
			margin: 0.25rem 0.4rem 1rem 0;
			height: auto;
		}

		&--error,
		// &--error:focus is needed to override foundation input focus styles
		&--error:focus {
			border-color: $kiva-accent-red;
			background-color: rgba($kiva-accent-red, 0.25);
		}
	}

	&__error-icon {
		position: absolute;
		pointer-events: none;
		height: 1rem;
		width: 1rem;
		top: rem-calc(12);
		right: rem-calc(12);
		color: $kiva-accent-red;
	}

	&__error-list {
		margin: 0;
	}

	&__error-item {
		list-style: none;
		color: $kiva-accent-red;
		font-weight: $global-weight-highlight;
		font-size: rem-calc(12);
	}
}
</style>
