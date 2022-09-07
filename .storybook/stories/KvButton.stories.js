import KvButton from '@/components/Kv/KvButton';

export default {
	title: 'KV/KvButton',
	component: KvButton,
};

export const Default = () => ({
	components: { KvButton },
	template: '<kv-button>Button</kv-button>'
});

export const DefaultSmaller = () => ({
	components: { KvButton },
	template: '<kv-button class="smaller">Button Smaller</kv-button>'
});

export const DefaultSmallest = () => ({
	components: { KvButton },
	template: '<kv-button class="smallest">Button Smallest</kv-button>'
});

export const Rounded = () => ({
	components: { KvButton },
	template: '<kv-button class="rounded">Button</kv-button>'
});

export const Alert = () => ({
	components: { KvButton },
	template: '<kv-button class="alert">Alert</kv-button>'
});

export const Classic = () => ({
	components: { KvButton },
	template: '<kv-button class="classic">Classic</kv-button>'
});

export const ClassicHollow = () => ({
	components: { KvButton },
	template: '<kv-button class="classic hollow">Classic</kv-button>'
});

export const Secondary = () => ({
	components: { KvButton },
	template: '<kv-button class="secondary">Secondary</kv-button>'
});

export const SecondarySmaller = () => ({
	components: { KvButton },
	template: '<kv-button class="secondary smaller">Secondary Smaller</kv-button>'
});

export const SecondarySmallest = () => ({
	components: { KvButton },
	template: '<kv-button class="secondary smallest">Secondary Smallest</kv-button>'
});

export const Setting = () => ({
	components: { KvButton },
	template: '<kv-button class="setting">Setting</kv-button>'
});

export const TextLink = () => ({
	components: { KvButton },
	template: '<kv-button class="text-link">Text Link Button</kv-button>'
});

export const Disabled = () => ({
	components: { KvButton },
	template: '<kv-button disabled>Button</kv-button>'
});

export const Expanded = () => ({
	components: { KvButton },
	template: '<kv-button class="expanded">Button</kv-button>'
});

export const AsALink = () => ({
	components: { KvButton },
	template: '<kv-button href="http://www.google.com">Button</kv-button>'
});

export const OnlyLeftBorder = () => ({
	components: { KvButton },
	template: '<kv-button class="left-border">Button</kv-button>'
});

export const ActiveLeftBorder = () => ({
	components: { KvButton },
	template: '<kv-button class="left-border active">Button</kv-button>'
});
