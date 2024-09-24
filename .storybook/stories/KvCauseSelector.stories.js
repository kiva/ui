import KvCauseSelector from '#src/components/Kv/KvCauseSelector';

import causeList from '../mock-data/cause-selector-data-mock';

export default {
	title: 'Kv/KvCauseSelector',
	component: KvCauseSelector,
	args: {
		cause: 'COVID-19',
		asRadio: false,
		asIcon: false,
		disabled: false,
		checked: false,
	},
	argTypes: {
		cause: {
			control: {
				type: 'select',
			},
			options: causeList,
		},
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvCauseSelector
	},
	methods: {
		onChange(val) {
			console.log(`Changed to ${val}`);
		}
	},
	setup() { return args; },
	template: `
		<div>
			<kv-cause-selector
				:cause="cause"
				:checked="checked"
				:disabled="disabled"
				:as-radio="asRadio"
				:as-icon="asIcon"
				@change="onChange"
			  />
		</div>
	`,
});

export const Disabled = Default.bind({});
Disabled.args = {
	disabled: true,
};

export const AllAsCheckbox = (args, { argTypes }) => ({
	components: {
		KvCauseSelector
	},
	props: Object.keys(argTypes),
	data() {
		return {
			causeList
		}
	},
	methods: {
		onChange(val) {
			console.log(`Changed to ${val}`);
		}
	},
	template: `
	<div>
		<ul class="ul">
			<li
				class="li"
				v-for="cause in causeList"
				:key="cause"
			>
				<kv-cause-selector
					:cause="cause"
					:as-radio="asRadio"
					:as-icon="asIcon"
					:disabled="disabled"
					@change="onChange"
				/>
			</li>
		</ul>
		<component is="style">
			.ul {
				list-style: none;
				display: flex;
			}

			.li {
				margin: 0;
				padding: 0;
				margin-right: 2.75rem;
			}
		</component>
	</div>
	`,
});
AllAsCheckbox.argTypes = {
	checked: { control: { disable: true } },
	cause: { control: { disable: true } },
}

export const AllAsRadio = AllAsCheckbox.bind({});
AllAsRadio.args = {
	asRadio: true,
};

export const AllAsIcon = AllAsCheckbox.bind({});
AllAsIcon.args = {
	asIcon: true,
};
