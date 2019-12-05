import KvPillToggle from '@/components/Kv/KvPillToggle';

export default { title: 'Kv | Form Elements/KvPillToggle' };

export const Default = () => ({
	components: {
		KvPillToggle
	},
	data() {
		return {
			options: [
				{
					title: 'Option 1',
					key: 'o1',
				},
				{
					title: 'Option 2',
					key: 'o2',
				},
				{
					title: 'Option 3',
					key: 'o3',
				},
			],
			selected: 'o2',
		}
	},
	template: `
		<div>
			<kv-pill-toggle
				:options="options"
				:selected="selected"
			/>
		</div>
	`
});

export const Disabled = () => ({
	components: {
		KvPillToggle
	},
	data() {
		return {
			options: [
				{
					title: 'Option 1',
					key: 'o1',
					disabled: true
				},
				{
					title: 'Option 2',
					key: 'o2',
				},
				{
					title: 'Option 3',
					key: 'o3',
				},
			],
			selected: 'o2',
		}
	},
	template: `
		<kv-pill-toggle
			:options="options"
			:selected="selected"
		/>
	`
});

export const NoneSelected = () => ({
	components: {
		KvPillToggle
	},
	data() {
		return {
			options: [
				{
					title: 'Option 1',
					key: 'o1',
				},
				{
					title: 'Option 2',
					key: 'o2',
				},
				{
					title: 'Option 3',
					key: 'o3',
				},
			],
		}
	},
	template: `
		<kv-pill-toggle
			:options="options"
		/>
	`
});

export const MultipleOnPage = () => ({
	components: {
		KvPillToggle
	},
	data() {
		return {
			options: [
				{
					title: 'Option 1',
					key: 'o1',
				},
				{
					title: 'Option 2',
					key: 'o2',
				},
				{
					title: 'Option 3',
					key: 'o3',
				},
			],
			selected: 'o2',
		}
	},
	template: `
		<div>
			<kv-pill-toggle
				:options="options"
				:selected="selected"
			/>
			<kv-pill-toggle
				:options="options"
				:selected="selected"
			/>
			<kv-pill-toggle
				:options="options"
				:selected="selected"
			/>
		</div>
	`
});

export const LongTitles = () => ({
	components: {
		KvPillToggle
	},
	data() {
		return {
			options: [
				{
					title: 'LoremEu do ad anim sit consectetur esse elit deserunt occaecat.',
					key: 'o1',
				},
				{
					title: 'Small',
					key: 'o2',
				},
				{
					title: 'LoremEu do ad anim sit consectetur esse elit deserunt occaecat.',
					key: 'o3',
				},
				{
					title: 'LoremEu do ad anim sit consectetur esse elit deserunt occaecat.',
					key: 'o4',
				},
			],
		}
	},
	template: `
		<kv-pill-toggle
			:options="options"
		/>
	`
});

