import KvPillToggle from '#src/components/Kv/KvPillToggle';

export default {
	title: 'Kv/Form Elements/KvPillToggle',
	component: KvPillToggle,
};

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
				id="pill"
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
			id="pill"
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
			id="pill"
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
			options1: [
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
			selected1: 'o1',
			options2: [
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
			selected2: 'o2',
			options3: [
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
			selected3: 'o3',
		}
	},
	template: `
		<div>
			<kv-pill-toggle
				id="pill1"
				:options="options1"
				:selected="selected1"
			/>
			<kv-pill-toggle
				id="pill2"
				:options="options2"
				:selected="selected2"
			/>
			<kv-pill-toggle
				id="pill3"
				:options="options3"
				:selected="selected3"
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
			id="pill"
			:options="options"
		/>
	`
});

export const SplitPills = () => ({
	components: {
		KvPillToggle
	},
	data() {
		return {
			options: [
				{
					title: '$10',
					key: 'o1',
				},
				{
					title: '$25',
					key: 'o2',
				},
				{
					title: '$50',
					key: 'o3',
				},
				{
					title: '$100',
					key: 'o4',
				},
				{
					title: 'Other',
					key: 'o5',
				},
			],
		}
	},
	template: `
		<kv-pill-toggle
			id="pill"
			:options="options"
			:split-pills="true"
			selected="o2"
		/>
	`
});

