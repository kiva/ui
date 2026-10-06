// @vitest-environment node
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import useExperimentCopy, { createExperimentCopyOperation } from '#src/composables/useExperimentCopy';

const cached = {
	contentful: {
		searchEntries: {
			items: [{
				entryId: 'id',
				entry: {
					sys: { contentType: { sys: { id: 'uiSetting' } } },
					fields: {
						key: 'tip-copy',
						active: true,
						content: [{
							sys: { contentType: { sys: { id: 'genericContentBlock' } } },
							fields: { key: 'tip-copy-b', headline: 'B headline' },
						}],
					},
				},
			}],
		},
	},
};

// Renders a small component on the server that shows the visitor's headline.
// attach: false leaves out preFetchOperations, as if the build had not added them
async function renderOnServer(apollo, { attach = true } = {}) {
	const operation = createExperimentCopyOperation('tip-copy');
	const Host = {
		name: 'Host',
		...(attach ? { preFetchOperations: [operation] } : {}),
		setup() {
			const { variants, version } = useExperimentCopy(operation, 'tip_copy_exp');
			return () => variants.value?.[version.value]?.headline ?? 'hardcoded';
		},
	};
	const app = createSSRApp(Host);
	app.provide('apollo', apollo);
	return renderToString(app);
}

describe('useExperimentCopy (server)', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders the assigned version from the prefetched copy without fetching', async () => {
		const apollo = {
			readQuery: vi.fn(() => cached),
			readFragment: vi.fn(() => ({ id: 'tip_copy_exp', version: 'b' })),
			query: vi.fn(),
			watchQuery: vi.fn(),
		};

		expect(await renderOnServer(apollo)).toBe('B headline');
		expect(apollo.readQuery).toHaveBeenCalledWith(expect.objectContaining({
			variables: expect.objectContaining({ contentType: 'uiSetting', contentKey: 'tip-copy' }),
		}));
		expect(apollo.query).not.toHaveBeenCalled();
		expect(apollo.watchQuery).not.toHaveBeenCalled();
	});

	it('renders the fallback and warns with the operation name when the copy was not prefetched', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const apollo = {
			readQuery: vi.fn(() => null),
			readFragment: vi.fn(() => ({ id: 'tip_copy_exp', version: 'b' })),
			query: vi.fn(),
			watchQuery: vi.fn(),
		};

		expect(await renderOnServer(apollo, { attach: false })).toBe('hardcoded');
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('SSR cache miss for contentfulEntries'));
		expect(apollo.query).not.toHaveBeenCalled();
	});
});
