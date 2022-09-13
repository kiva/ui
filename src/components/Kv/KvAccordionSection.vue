<template>
	<div>
		<kv-accordion-item
			:id="item.id"
			v-for="item in items"
			:key="item.id"
			:active="activeAccordion === item.id"
			@toggle="setActiveAccordion"
		>
			<template #header>
				<h2>{{ getTitle(item) }}</h2>
			</template>
			<p>
				{{ getDescription(item) }}
			</p>
		</kv-accordion-item>
	</div>
</template>
<script>
import KvAccordionItem from '@/components/Kv/KvAccordionItem';

export default {
	name: 'KvAccordionSection',
	components: { KvAccordionItem },
	props: {
		items: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			activeAccordion: '',
		};
	},
	methods: {
		getTitle(item) {
			return item?.content?.title ?? '';
		},
		getDescription(item) {
			return item?.content?.description ?? '';
		},
		setActiveAccordion({ id }) {
			this.activeAccordion = id;
		}
	},
};
</script>
