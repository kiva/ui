import { render } from '@testing-library/vue';
import KvCodeBlock from '../../../../../src/components/Kv/KvCodeBlock';

describe('KvCodeBlock.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvCodeBlock).toBeDefined();
		expect(KvCodeBlock.name).toBe('KvCodeBlock');
	});

	it('renders code from the code prop', () => {
		const codeContent = 'const example = "test code";';
		const { container } = render(KvCodeBlock, {
			props: {
				code: codeContent
			}
		});

		const pre = container.querySelector('pre');
		expect(pre).toBeTruthy();
		expect(pre.textContent).toBe(codeContent);
	});

	it('renders code from the default slot when code prop is empty', () => {
		const slotContent = 'function test() { return true; }';
		const { container } = render(KvCodeBlock, {
			slots: {
				default: slotContent
			}
		});

		const code = container.querySelector('code');
		expect(code).toBeTruthy();
		expect(code.textContent).toContain(slotContent);
	});

	it('prefers code prop over slot content', () => {
		const propCode = 'const prop = "code";';
		const slotCode = 'const slot = "code";';
		const { container } = render(KvCodeBlock, {
			props: {
				code: propCode
			},
			slots: {
				default: slotCode
			}
		});

		const pre = container.querySelector('pre');
		expect(pre.textContent).toBe(propCode);
		expect(pre.textContent).not.toContain(slotCode);
	});

	it('has empty string as default code prop', () => {
		const { container } = render(KvCodeBlock);
		const code = container.querySelector('code');

		expect(code).toBeTruthy();
		// When code prop is empty, slot is used (which is also empty by default)
	});

	it('renders multiline code correctly', () => {
		const multilineCode = `function hello() {
	console.log("Hello");
	return true;
}`;
		const { container } = render(KvCodeBlock, {
			props: {
				code: multilineCode
			}
		});

		const pre = container.querySelector('pre');
		expect(pre.textContent).toBe(multilineCode);
	});

	it('renders within a code element', () => {
		const { container } = render(KvCodeBlock, {
			props: {
				code: 'test'
			}
		});

		expect(container.querySelector('code')).toBeTruthy();
	});

	it('renders pre element only when code prop is provided', () => {
		const { container: withCode } = render(KvCodeBlock, {
			props: {
				code: 'test'
			}
		});
		const { container: withoutCode } = render(KvCodeBlock);

		expect(withCode.querySelector('pre')).toBeTruthy();
		expect(withoutCode.querySelector('pre')).toBeFalsy();
	});
});
