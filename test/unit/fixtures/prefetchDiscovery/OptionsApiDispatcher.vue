<template>
	<component :is="child" />
</template>

<script>
import StaticChild from './StaticChild';

export default {
	name: 'OptionsApiDispatcher',
	computed: {
		child() {
			return StaticChild;
		},
	},
};
</script>
