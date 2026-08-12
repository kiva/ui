<template>
	<div>
		<StaticChild />
		<DynamicChild />
	</div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import StaticChild from './StaticChild';

const DynamicChild = defineAsyncComponent(() => import('./DynamicChild'));

defineOptions({ name: 'ScriptSetupParent' });
</script>
