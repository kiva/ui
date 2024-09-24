import KvAccordionItem from '#src/components/Kv/KvAccordionItem';

export default {
	title: 'Kv/KvAccordionItem',
	component: KvAccordionItem,
	args: {
		open: false,
		disabled: false,
	},
};

export const Default = (args, { argTypes }) => ({
	components: { KvAccordionItem },
	props: Object.keys(argTypes),
	template: `
		<div>
			<kv-accordion-item
				id="my_cool_accordion"
				:disabled="disabled"
				:open="open"
			>
				<template #header>
					<h2>Title</h2>
				</template>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus in hendrerit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Interdum varius sit amet mattis vulputate enim. Maecenas pharetra convallis posuere morbi leo urna molestie. Duis ut diam quam nulla porttitor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Elit pellentesque habitant morbi tristique senectus et netus. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Non quam lacus suspendisse faucibus interdum posuere lorem. Magnis dis parturient montes nascetur ridiculus. Et tortor consequat id porta nibh venenatis cras sed felis. Dui ut ornare lectus sit amet est placerat. Eu non diam phasellus vestibulum lorem. Dignissim convallis aenean et tortor at.
				</p>
				<p>
					Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Sed odio morbi quis commodo odio aenean. Et tortor at risus viverra. Bibendum enim facilisis gravida neque. Ut tellus elementum sagittis vitae et leo duis. Aliquet lectus proin nibh nisl condimentum id venenatis a condimentum. Et malesuada fames ac turpis egestas integer eget aliquet. In hac habitasse platea dictumst quisque. Dignissim cras tincidunt lobortis feugiat. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam. Quam nulla porttitor massa id. Ac tortor dignissim convallis aenean et tortor at risus. Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. Vitae aliquet nec ullamcorper sit amet. Ornare arcu odio ut sem nulla. Viverra orci sagittis eu volutpat odio. Ut venenatis tellus in metus. Amet justo donec enim diam.
				</p>
			</kv-accordion-item>
			<kv-accordion-item
				id="my_cool_accordion2"
				:disabled="disabled"
				:open="open"
			>
				<template #header>
					<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h2>
				</template>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus in hendrerit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Interdum varius sit amet mattis vulputate enim. Maecenas pharetra convallis posuere morbi leo urna molestie. Duis ut diam quam nulla porttitor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Elit pellentesque habitant morbi tristique senectus et netus. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Non quam lacus suspendisse faucibus interdum posuere lorem. Magnis dis parturient montes nascetur ridiculus. Et tortor consequat id porta nibh venenatis cras sed felis. Dui ut ornare lectus sit amet est placerat. Eu non diam phasellus vestibulum lorem. Dignissim convallis aenean et tortor at.
				</p>
				<p>
					Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Sed odio morbi quis commodo odio aenean. Et tortor at risus viverra. Bibendum enim facilisis gravida neque. Ut tellus elementum sagittis vitae et leo duis. Aliquet lectus proin nibh nisl condimentum id venenatis a condimentum. Et malesuada fames ac turpis egestas integer eget aliquet. In hac habitasse platea dictumst quisque. Dignissim cras tincidunt lobortis feugiat. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam. Quam nulla porttitor massa id. Ac tortor dignissim convallis aenean et tortor at risus. Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. Vitae aliquet nec ullamcorper sit amet. Ornare arcu odio ut sem nulla. Viverra orci sagittis eu volutpat odio. Ut venenatis tellus in metus. Amet justo donec enim diam.
				</p>
			</kv-accordion-item>
		</div>
	`,
});

export const Disabled = Default.bind({});
Disabled.args = {
	disabled: true
};

export const Open = Default.bind({});
Open.args = {
	open: true
};

export const OpenAndDisabled = Default.bind({});
OpenAndDisabled.args = {
	open: true,
	disabled: true
};

export const H3Header = (args, { argTypes }) => ({
	components: { KvAccordionItem },
	props: Object.keys(argTypes),
	template: `
		<div>
			<kv-accordion-item
				id="my_cool_accordion"
				:disabled="disabled"
				:open="open"
			>
				<template #header>
					<h3>Title</h3>
				</template>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus in hendrerit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Interdum varius sit amet mattis vulputate enim. Maecenas pharetra convallis posuere morbi leo urna molestie. Duis ut diam quam nulla porttitor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Elit pellentesque habitant morbi tristique senectus et netus. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Non quam lacus suspendisse faucibus interdum posuere lorem. Magnis dis parturient montes nascetur ridiculus. Et tortor consequat id porta nibh venenatis cras sed felis. Dui ut ornare lectus sit amet est placerat. Eu non diam phasellus vestibulum lorem. Dignissim convallis aenean et tortor at.
				</p>
				<p>
					Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Sed odio morbi quis commodo odio aenean. Et tortor at risus viverra. Bibendum enim facilisis gravida neque. Ut tellus elementum sagittis vitae et leo duis. Aliquet lectus proin nibh nisl condimentum id venenatis a condimentum. Et malesuada fames ac turpis egestas integer eget aliquet. In hac habitasse platea dictumst quisque. Dignissim cras tincidunt lobortis feugiat. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam. Quam nulla porttitor massa id. Ac tortor dignissim convallis aenean et tortor at risus. Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. Vitae aliquet nec ullamcorper sit amet. Ornare arcu odio ut sem nulla. Viverra orci sagittis eu volutpat odio. Ut venenatis tellus in metus. Amet justo donec enim diam.
				</p>
			</kv-accordion-item>
			<kv-accordion-item
				id="my_cool_accordion2"
				:disabled="disabled"
				:open="open"
			>
				<template #header>
					<h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h3>
				</template>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus in hendrerit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Interdum varius sit amet mattis vulputate enim. Maecenas pharetra convallis posuere morbi leo urna molestie. Duis ut diam quam nulla porttitor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Elit pellentesque habitant morbi tristique senectus et netus. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Non quam lacus suspendisse faucibus interdum posuere lorem. Magnis dis parturient montes nascetur ridiculus. Et tortor consequat id porta nibh venenatis cras sed felis. Dui ut ornare lectus sit amet est placerat. Eu non diam phasellus vestibulum lorem. Dignissim convallis aenean et tortor at.
				</p>
				<p>
					Habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat. Sed odio morbi quis commodo odio aenean. Et tortor at risus viverra. Bibendum enim facilisis gravida neque. Ut tellus elementum sagittis vitae et leo duis. Aliquet lectus proin nibh nisl condimentum id venenatis a condimentum. Et malesuada fames ac turpis egestas integer eget aliquet. In hac habitasse platea dictumst quisque. Dignissim cras tincidunt lobortis feugiat. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam. Quam nulla porttitor massa id. Ac tortor dignissim convallis aenean et tortor at risus. Aliquam faucibus purus in massa tempor nec feugiat nisl pretium. Vitae aliquet nec ullamcorper sit amet. Ornare arcu odio ut sem nulla. Viverra orci sagittis eu volutpat odio. Ut venenatis tellus in metus. Amet justo donec enim diam.
				</p>
			</kv-accordion-item>
		</div>
	`,
});
