import KvButton from './KvButton';

export default { title: 'Button' };

export const withText = () => '<kv-button>with text</kv-button>';

export const withEmoji = () => '<kv-button>😀 😎 👍 💯</kv-button>';

export const asAComponent = () => ({
	components: { KvButton },
	template: '<kv-button :rounded="true">rounded</kv-button>'
});
